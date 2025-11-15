import { useState, useEffect, useCallback } from 'react';
import { Contract } from 'ethers';
import { PRIMECOIN_CONTRACT_ADDRESS, USDT_ADDRESS } from '../config/constants';
import { PRIMECOIN_ABI, USDT_ABI } from '../config/abi';
import { getContract, getContractReadOnly, formatToken, parseToken } from '../utils/web3';
import { UserData, UserStake, SellInfo, SellLimitInfo } from '../types/contract';
import { toast } from 'react-toastify';

export const useContract = (account: string | null) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [tokenPrice, setTokenPrice] = useState<string>('0');
  const [initialLoading, setInitialLoading] = useState(true);

  // Carregar dados do usuário
  const loadUserData = useCallback(async () => {
    if (!account) {
      setUserData(null);
      setInitialLoading(false);
      return;
    }

    try {
      const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      
      const [
        balance,
        activeStaking,
        credits,
        totalCommissions,
        referralInvestments,
        upline,
        hasSetUpline,
        trading,
      ] = await Promise.all([
        contract.balanceOf(account),
        contract.getActiveStaking(account),
        contract.getUserCredit(account),
        contract.totalCommissionsReceived(account),
        contract.referralInvestments(account),
        contract.userUpline(account),
        contract.hasSetUpline(account),
        contract.userTrading(account),
      ]);

      // Tentar carregar informações de boost de referral
      let referralBoost;
      try {
        const sellLimitInfo = await contract.getSellLimitInfo(account);
        referralBoost = {
          tier: Number(sellLimitInfo.boostTier),
          count: Number(sellLimitInfo.qualifiedReferrals),
          percentage: Number(sellLimitInfo.boostPercent),
        };
      } catch (error) {
        console.log('Referral boost info não disponível:', error);
      }

      setUserData({
        address: account,
        balance,
        activeStaking,
        credits,
        totalCommissions,
        referralInvestments,
        upline,
        hasSetUpline,
        trading,
        referralBoost,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [account]);

  // Carregar preço do token
  const loadTokenPrice = useCallback(async () => {
    try {
      const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      const price = await contract.getCurrentTokenPrice();
      setTokenPrice(formatToken(price));
    } catch (error) {
      console.error('Erro ao carregar preço:', error);
    }
  }, []);

  useEffect(() => {
    loadUserData();
    loadTokenPrice();
    
    const interval = setInterval(() => {
      loadUserData();
      loadTokenPrice();
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, [loadUserData, loadTokenPrice]);

  // Função para fazer stake
  const stake = async (amount: string, period: number) => {
    if (!account) {
      toast.error('Conecte sua carteira primeiro');
      return;
    }

    setLoading(true);
    try {
      const contract = await getContract(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      const amountInWei = parseToken(amount);
      
      const tx = await contract.stake(amountInWei, period);
      toast.info('Transação enviada. Aguardando confirmação...');
      
      await tx.wait();
      toast.success('Stake realizado com sucesso!');
      await loadUserData();
    } catch (error: any) {
      console.error('Erro ao fazer stake:', error);
      toast.error('Erro ao fazer stake: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Função para retirar stake
  const withdraw = async (stakeId: number) => {
    if (!account) {
      toast.error('Conecte sua carteira primeiro');
      return;
    }

    setLoading(true);
    try {
      const contract = await getContract(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      
      const tx = await contract.withdraw(stakeId);
      toast.info('Transação enviada. Aguardando confirmação...');
      
      await tx.wait();
      toast.success('Retirada realizada com sucesso!');
      await loadUserData();
    } catch (error: any) {
      console.error('Erro ao retirar stake:', error);
      toast.error('Erro ao retirar: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Função para comprar tokens com USDT
  const buyTokens = async (usdtAmount: string, slippage: number = 1) => {
    if (!account) {
      toast.error('Conecte sua carteira primeiro');
      return;
    }

    setLoading(true);
    try {
      const usdtContract = await getContract(USDT_ADDRESS, USDT_ABI);
      const primecoinContract = await getContract(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      
      const amountInWei = parseToken(usdtAmount);
      
      // Verificar e aprovar USDT
      const allowance = await usdtContract.allowance(account, PRIMECOIN_CONTRACT_ADDRESS);
      if (allowance < amountInWei) {
        toast.info('Aprovando USDT...');
        const approveTx = await usdtContract.approve(PRIMECOIN_CONTRACT_ADDRESS, amountInWei);
        await approveTx.wait();
        toast.success('USDT aprovado!');
      }
      
      // Calcular minTokensOut com slippage
      const minTokensOut = 0; // Pode calcular baseado no preço atual
      
      const tx = await primecoinContract.buyTokensWithUSDT(amountInWei, minTokensOut);
      toast.info('Transação enviada. Aguardando confirmação...');
      
      await tx.wait();
      toast.success('Tokens comprados com sucesso!');
      await loadUserData();
    } catch (error: any) {
      console.error('Erro ao comprar tokens:', error);
      toast.error('Erro ao comprar: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Função para vender tokens por USDT
  const sellTokens = async (tokenAmount: string, slippage: number = 1) => {
    if (!account) {
      toast.error('Conecte sua carteira primeiro');
      return;
    }

    setLoading(true);
    try {
      const contract = await getContract(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      const amountInWei = parseToken(tokenAmount);
      
      const minUSDTOut = 0; // Pode calcular baseado no preço atual
      
      const tx = await contract.sellTokensForUSDT(amountInWei, minUSDTOut);
      toast.info('Transação enviada. Aguardando confirmação...');
      
      await tx.wait();
      toast.success('Tokens vendidos com sucesso!');
      await loadUserData();
    } catch (error: any) {
      console.error('Erro ao vender tokens:', error);
      toast.error('Erro ao vender: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Função para definir upline
  const setUpline = async (uplineAddress: string) => {
    if (!account) {
      toast.error('Conecte sua carteira primeiro');
      return;
    }

    setLoading(true);
    try {
      const contract = await getContract(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      
      const tx = await contract.setUpline(uplineAddress);
      toast.info('Transação enviada. Aguardando confirmação...');
      
      await tx.wait();
      toast.success('Upline definido com sucesso!');
      await loadUserData();
    } catch (error: any) {
      console.error('Erro ao definir upline:', error);
      toast.error('Erro ao definir upline: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Função para obter informações de venda
  const getSellInfo = async (): Promise<SellInfo | null> => {
    if (!account) return null;

    try {
      const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      const result = await contract.getAmountToSell(account);
      
      return {
        amount: result[0],
        canSellToday: result[1],
        timeUntilNextSell: result[2],
        reason: result[3],
      };
    } catch (error) {
      console.error('Erro ao obter info de venda:', error);
      return null;
    }
  };

  // Função para obter stakes do usuário
  // Função para obter stakes do usuário
  const getUserStakes = async (): Promise<UserStake[]> => {
    if (!account) {
      console.log('getUserStakes: Sem conta conectada');
      return [];
    }

    try {
      console.log('getUserStakes: Buscando stakes para:', account);
      const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      const stakes: UserStake[] = [];
      
      // Tentar obter até 100 stakes (ajustar conforme necessário)
      for (let i = 0; i < 100; i++) {
        try {
          console.log(`getUserStakes: Tentando obter stake ${i}...`);
          const stake = await contract.userStakes(account, i);
          console.log(`getUserStakes: Stake ${i} encontrado:`, {
            amount: stake.amount.toString(),
            stakingPeriod: stake.stakingPeriod.toString(),
            claimed: stake.claimed,
            startTime: stake.startTime.toString(),
            endTime: stake.endTime.toString(),
          });
          
          // Verificar se o stake tem dados válidos (amount > 0)
          if (stake.amount > 0n) {
            stakes.push(stake);
          } else {
            console.log(`getUserStakes: Stake ${i} vazio, parando busca`);
            break;
          }
        } catch (error) {
          console.log(`getUserStakes: Erro ao buscar stake ${i}, fim da lista`, error);
          break; // Não há mais stakes
        }
      }
      
      console.log(`getUserStakes: Total de stakes encontrados: ${stakes.length}`);
      return stakes;
    } catch (error) {
      console.error('getUserStakes: Erro geral ao obter stakes:', error);
      return [];
    }
  };

  // Função para obter downlines
  const getDownlines = async (): Promise<string[]> => {
    if (!account) return [];

    try {
      const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      return await contract.getDirectDownlines(account);
    } catch (error) {
      console.error('Erro ao obter downlines:', error);
      return [];
    }
  };

  // Função para obter informações de limite de venda com boost
  const getSellLimitInfo = async (): Promise<SellLimitInfo | null> => {
    if (!account) return null;

    try {
      const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      
      // Buscar informações de venda
      const sellInfo = await contract.getAmountToSell(account);
      
      // Buscar informações de boost
      const referralBonus = await contract.referralBonuses(account);
      
      // Tiers de boost (conforme o contrato)
      const boostTiers = [
        { required: 0, boost: 0, total: 100 },
        { required: 3, boost: 15, total: 115 },
        { required: 6, boost: 30, total: 130 },
        { required: 10, boost: 50, total: 150 },
        { required: 15, boost: 75, total: 175 },
        { required: 20, boost: 100, total: 200 },
        { required: 25, boost: 150, total: 250 },
        { required: 30, boost: 200, total: 300 },
      ];
      
      const currentTier = Number(referralBonus.currentTier);
      const qualifiedReferrals = Number(referralBonus.qualifiedReferrals);
      const tierInfo = boostTiers[currentTier];
      
      // Próximo tier
      const nextTierIndex = Math.min(currentTier + 1, boostTiers.length - 1);
      const requiredForNextTier = boostTiers[nextTierIndex].required;
      
      return {
        maxSellAmount: sellInfo[0],
        boostTier: currentTier,
        boostPercent: tierInfo.boost,
        totalSellPercent: tierInfo.total,
        qualifiedReferrals: BigInt(qualifiedReferrals),
        requiredForNextTier,
      };
    } catch (error) {
      console.error('Erro ao obter info de limite de venda:', error);
      return null;
    }
  };

  return {
    loading: loading || initialLoading,
    userData,
    tokenPrice,
    stake,
    withdraw,
    buyTokens,
    sellTokens,
    setUpline,
    getSellInfo,
    getSellLimitInfo,
    getUserStakes,
    getDownlines,
    refreshData: loadUserData,
  };
};

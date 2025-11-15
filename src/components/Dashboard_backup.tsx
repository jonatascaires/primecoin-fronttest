import React, { useEffect, useState } from 'react';
import { formatToken } from '../utils/web3';
import { UserData } from '../types/contract';
import { FaCoins, FaLock, FaGift, FaDollarSign, FaCheckCircle, FaTimesCircle, FaChartLine, FaClock, FaUsers, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import { getContractReadOnly } from '../utils/web3';
import { PRIMECOIN_CONTRACT_ADDRESS } from '../config/constants';
import { PRIMECOIN_ABI } from '../config/abi';

interface DashboardProps {
  userData: UserData | null;
  tokenPrice: string;
}

interface SellInfo {
  amount: bigint;
  canSellToday: boolean;
  timeUntilNextSell: bigint;
  reason: string;
}

interface NetworkSize {
  levels: number[];
  total: number;
}

interface CommissionEligibility {
  level: number;
  isEligible: boolean;
  requiredAmount: string;
  currentAmount: string;
}

interface StakingStats {
  totalStaked: bigint;
  readyToWithdraw: bigint;
  totalWithdrawn: bigint;
  activeStakes: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, tokenPrice }) => {
  const [sellInfo, setSellInfo] = useState<SellInfo | null>(null);
  const [networkSize, setNetworkSize] = useState<NetworkSize | null>(null);
  const [commissionEligibility, setCommissionEligibility] = useState<CommissionEligibility[]>([]);
  const [stakingStats, setStakingStats] = useState<StakingStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData?.address) {
      loadExtendedData();
    }
  }, [userData?.address]);

  const loadExtendedData = async () => {
    if (!userData?.address) return;
    
    setLoading(true);
    try {
      const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      
      // Informações de venda
      const sellData = await contract.getAmountToSell(userData.address);
      setSellInfo({
        amount: sellData[0],
        canSellToday: sellData[1],
        timeUntilNextSell: sellData[2],
        reason: sellData[3],
      });

      // Tamanho da rede por nível
      const networkSizeData = await contract.getNetworkSizeByLevel(userData.address);
      const levels = Array.from(networkSizeData).map((n: any) => Number(n));
      const total = levels.reduce((acc, val) => acc + val, 0);
      setNetworkSize({ levels, total });

      // Verificar elegibilidade para comissões (níveis 1-5 como exemplo)
      const eligibilityPromises = [1, 2, 3, 4, 5].map(async (level) => {
        try {
          const result = await contract.checkCommissionEligibility(
            userData.address,
            level,
            'TRADING'
          );
          return {
            level,
            isEligible: result[0],
            requiredAmount: formatToken(result[1]),
            currentAmount: formatToken(result[2]),
          };
        } catch (error) {
          console.error(`Erro ao verificar elegibilidade nível ${level}:`, error);
          return {
            level,
            isEligible: false,
            requiredAmount: '0',
            currentAmount: '0',
          };
        }
      });

      const eligibilityResults = await Promise.all(eligibilityPromises);
      setCommissionEligibility(eligibilityResults);

      // Buscar estatísticas de staking
      let totalStaked = 0n;
      let readyToWithdraw = 0n;
      let totalWithdrawn = 0n;
      let activeStakes = 0;

      for (let i = 0; i < 100; i++) {
        try {
          const stake = await contract.userStakes(userData.address, i);
          if (stake.amount > 0n) {
            if (stake.claimed) {
              totalWithdrawn += stake.amount;
            } else {
              totalStaked += stake.amount;
              activeStakes++;
              
              // Verificar se está pronto para retirada
              const now = Math.floor(Date.now() / 1000);
              if (now >= Number(stake.endTime)) {
                readyToWithdraw += stake.amount;
              }
            }
          } else {
            break;
          }
        } catch (error) {
          break;
        }
      }

      setStakingStats({
        totalStaked,
        readyToWithdraw,
        totalWithdrawn,
        activeStakes,
      });
    } catch (error) {
      console.error('Erro ao carregar dados estendidos:', error);
    } finally {
      setLoading(false);
    }
  };
  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Conecte sua carteira para ver suas informações</p>
      </div>
    );
  }

  const formatTime = (seconds: bigint) => {
    const secs = Number(seconds);
    if (secs === 0) return 'Disponível agora';
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Hero Card - Preço do Token */}
      <div className="group relative overflow-hidden bg-gradient-to-r from-[#0D1F32] via-[#1A2332] to-[#0D1F32] rounded-2xl p-4 sm:p-5 text-white shadow-2xl border border-[#00D9D9]/20 hover:border-[#00D9D9]/40 transition-all">
        <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-[#00D9D9]/5 rounded-full blur-3xl -mr-20 sm:-mr-32 -mt-20 sm:-mt-32 group-hover:bg-[#00D9D9]/10 transition-all"></div>
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-[#00A3A3]/5 rounded-full blur-3xl -ml-16 sm:-ml-24 -mb-16 sm:-mb-24 group-hover:bg-[#00A3A3]/10 transition-all"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#00D9D9]/20 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="text-[#00D9D9] text-xs sm:text-sm" />
                </div>
                <span className="text-[10px] sm:text-xs text-[#A8B2C1] font-medium">Preço Atual do Token</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] bg-clip-text text-transparent">${parseFloat(tokenPrice).toFixed(6)}</p>
              <p className="text-[10px] sm:text-xs text-[#7D8694]">PSC / USDT</p>
            </div>
            <div className="text-3xl sm:text-5xl opacity-20">
              💎
            </div>
          </div>
        </div>
      </div>

      {/* Cards Principais - Grid 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Saldo */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl shadow-2xl p-4 sm:p-5 border border-[#2A3548] hover:border-[#00D9D9]/50 hover:shadow-[#00D9D9]/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D9D9]/0 to-[#00D9D9]/0 group-hover:from-[#00D9D9]/5 group-hover:to-[#00D9D9]/10 transition-all"></div>
          <div className="relative flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-[#A8B2C1] text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">Saldo Disponível</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] bg-clip-text text-transparent">
                {parseFloat(formatToken(userData.balance)).toFixed(6)}
              </p>
              <p className="text-[10px] sm:text-xs text-[#7D8694] mt-0.5 sm:mt-1">PSC</p>
            </div>
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] rounded-xl blur opacity-75 group-hover/icon:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] p-2 sm:p-3 rounded-xl shadow-lg transform group-hover/icon:scale-110 transition-transform">
                <FaCoins className="text-white text-base sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="relative bg-[#1E2635]/50 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-[#2A3548]/50">
            <p className="text-[10px] sm:text-xs text-[#00D9D9] font-semibold">
              ≈ ${(parseFloat(formatToken(userData.balance)) * parseFloat(tokenPrice)).toFixed(2)} USD
            </p>
          </div>
        </div>

        {/* Em Staking */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl shadow-2xl p-4 sm:p-5 border border-[#2A3548] hover:border-[#00E676]/50 hover:shadow-[#00E676]/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/0 to-[#00E676]/0 group-hover:from-[#00E676]/5 group-hover:to-[#00E676]/10 transition-all"></div>
          <div className="relative flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-[#A8B2C1] text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">Em Staking</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#00E676] to-[#00B359] bg-clip-text text-transparent">
                {parseFloat(formatToken(userData.activeStaking)).toFixed(6)}
              </p>
              <p className="text-[10px] sm:text-xs text-[#7D8694] mt-0.5 sm:mt-1">PSC</p>
            </div>
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E676] to-[#00B359] rounded-xl blur opacity-75 group-hover/icon:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-[#00E676] to-[#00B359] p-2 sm:p-3 rounded-xl shadow-lg transform group-hover/icon:scale-110 transition-transform">
                <FaLock className="text-white text-base sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="relative bg-[#1E2635]/50 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-[#2A3548]/50">
            <p className="text-[10px] sm:text-xs text-[#00E676] font-semibold">
              Gerando recompensas automáticas
            </p>
          </div>
        </div>

        {/* Comissões */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl shadow-2xl p-4 sm:p-5 border border-[#2A3548] hover:border-[#FFB800]/50 hover:shadow-[#FFB800]/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/0 to-[#FFB800]/0 group-hover:from-[#FFB800]/5 group-hover:to-[#FFB800]/10 transition-all"></div>
          <div className="relative flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-[#A8B2C1] text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">Comissões Recebidas</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FFB800] to-[#FFA726] bg-clip-text text-transparent">
                {parseFloat(formatToken(userData.totalCommissions)).toFixed(6)}
              </p>
              <p className="text-[10px] sm:text-xs text-[#7D8694] mt-0.5 sm:mt-1">PSC</p>
            </div>
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800] to-[#FFA726] rounded-xl blur opacity-75 group-hover/icon:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-[#FFB800] to-[#FFA726] p-2 sm:p-3 rounded-xl shadow-lg transform group-hover/icon:scale-110 transition-transform">
                <FaDollarSign className="text-white text-base sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="relative bg-[#1E2635]/50 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-[#2A3548]/50">
            <p className="text-[10px] sm:text-xs text-[#FFB800] font-semibold">
              ≈ ${(parseFloat(formatToken(userData.totalCommissions)) * parseFloat(tokenPrice)).toFixed(2)} USD
            </p>
          </div>
        </div>

        {/* Créditos */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl shadow-2xl p-4 sm:p-5 border border-[#2A3548] hover:border-[#00D9D9]/50 hover:shadow-[#00D9D9]/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D9D9]/0 to-[#00D9D9]/0 group-hover:from-[#00D9D9]/5 group-hover:to-[#00D9D9]/10 transition-all"></div>
          <div className="relative flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-[#A8B2C1] text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">Créditos 3x</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] bg-clip-text text-transparent">
                {parseFloat(formatToken(userData.credits)).toFixed(2)}
              </p>
              <p className="text-[10px] sm:text-xs text-[#7D8694] mt-0.5 sm:mt-1">USDT</p>
            </div>
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] rounded-xl blur opacity-75 group-hover/icon:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] p-2 sm:p-3 rounded-xl shadow-lg transform group-hover/icon:scale-110 transition-transform">
                <FaGift className="text-white text-base sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="relative bg-[#1E2635]/50 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-[#2A3548]/50">
            <p className="text-[9px] sm:text-xs text-[#00D9D9] font-semibold leading-tight">
              +$0.50 por cada $1 investido
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#2A3548]">
        <h3 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 flex items-center">
          <FaChartLine className="mr-2 text-[#00D9D9]" />
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <a href="/trading" className="bg-[#0D1F32]/50 hover:bg-[#0D1F32] border border-[#2A3548] hover:border-[#00E676]/50 rounded-xl p-3 sm:p-4 transition-all group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00E676]/20 rounded-lg flex items-center justify-center group-hover:bg-[#00E676]/30 transition-all">
                <FaExchangeAlt className="text-[#00E676] text-lg" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">Comprar/Vender</p>
                <p className="text-[9px] sm:text-xs text-[#A8B2C1]">Trading PSC</p>
              </div>
            </div>
          </a>
          <a href="/staking" className="bg-[#0D1F32]/50 hover:bg-[#0D1F32] border border-[#2A3548] hover:border-[#FFB800]/50 rounded-xl p-3 sm:p-4 transition-all group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FFB800]/20 rounded-lg flex items-center justify-center group-hover:bg-[#FFB800]/30 transition-all">
                <FaLock className="text-[#FFB800] text-lg" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">Fazer Staking</p>
                <p className="text-[9px] sm:text-xs text-[#A8B2C1]">Até 325% APR</p>
              </div>
            </div>
          </a>
          <a href="/network" className="bg-[#0D1F32]/50 hover:bg-[#0D1F32] border border-[#2A3548] hover:border-[#00D9D9]/50 rounded-xl p-3 sm:p-4 transition-all group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00D9D9]/20 rounded-lg flex items-center justify-center group-hover:bg-[#00D9D9]/30 transition-all">
                <FaUsers className="text-[#00D9D9] text-lg" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">Minha Rede</p>
                <p className="text-[9px] sm:text-xs text-[#A8B2C1]">MLM & Comissões</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Resumo de Proteções - Compacto */}
      <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#00E676]/20">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center">
            <FaCheckCircle className="mr-2 text-[#00E676]" />
            Proteções Ativas
          </h3>
          <a href="/trading" className="text-[9px] sm:text-xs text-[#00D9D9] hover:text-[#00E676] transition-colors">
            Ver detalhes →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-[#0D1F32]/50 rounded-lg p-2 sm:p-3 text-center border border-[#2A3548]">
            <p className="text-lg sm:text-2xl mb-1">🛡️</p>
            <p className="text-[9px] sm:text-xs font-bold text-white">Anti-Dump</p>
            <p className="text-[8px] sm:text-[10px] text-[#A8B2C1]">{userData.referralBoost?.tier === 0 ? '1%' : (userData.referralBoost?.tier || 0) <= 3 ? '2%' : '3%'}/dia</p>
          </div>
          <div className="bg-[#0D1F32]/50 rounded-lg p-2 sm:p-3 text-center border border-[#2A3548]">
            <p className="text-lg sm:text-2xl mb-1">📊</p>
            <p className="text-[9px] sm:text-xs font-bold text-white">Profit Cap</p>
            <p className="text-[8px] sm:text-[10px] text-[#A8B2C1]">2x Limite</p>
          </div>
          <div className="bg-[#0D1F32]/50 rounded-lg p-2 sm:p-3 text-center border border-[#2A3548]">
            <p className="text-lg sm:text-2xl mb-1">💰</p>
            <p className="text-[9px] sm:text-xs font-bold text-white">Buy Limit</p>
            <p className="text-[8px] sm:text-[10px] text-[#A8B2C1]">10% Reserva</p>
          </div>
          <div className="bg-[#0D1F32]/50 rounded-lg p-2 sm:p-3 text-center border border-[#2A3548]">
            <p className="text-lg sm:text-2xl mb-1">🔒</p>
            <p className="text-[9px] sm:text-xs font-bold text-white">Imutável</p>
            <p className="text-[8px] sm:text-[10px] text-[#A8B2C1]">Ownership ✓</p>
          </div>
        </div>
      </div>

      {/* Info Card Simplificado */}
      <div className="bg-gradient-to-br from-[#00D9D9]/10 to-[#00A3A3]/10 rounded-xl p-3 sm:p-4 border border-[#00D9D9]/30">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <FaInfoCircle className="text-[#00D9D9] text-sm sm:text-base mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] sm:text-xs text-white leading-relaxed">
              <strong>Bem-vindo ao PrimeCoin!</strong> Seus saldos são atualizados em tempo real. 
              Use o menu acima para navegar entre <strong className="text-[#00E676]">Trading</strong>, <strong className="text-[#FFB800]">Staking</strong> e <strong className="text-[#00D9D9]">Rede</strong> para acessar funcionalidades completas.
            </p>
          </div>
        </div>
      </div>
    </div>

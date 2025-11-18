import { useEffect, useState } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { getContractReadOnly } from '../utils/web3';
import { PRIMECOIN_ABI } from '../config/abi';
import { PRIMECOIN_CONTRACT_ADDRESS } from '../config/constants';

export const StakesDebug = () => {
  const { account } = useWalletContext();
  const [info, setInfo] = useState<string>('');

  useEffect(() => {
    const checkStakes = async () => {
      if (!account) {
        setInfo('❌ Sem conta conectada');
        return;
      }

      try {
        const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
        
        let debugInfo = `🔍 Verificando stakes para: ${account}\n\n`;
        
        // Verificar activeStaking
        try {
          const activeStaking = await contract.getActiveStaking(account);
          debugInfo += `✅ Active Staking: ${activeStaking.toString()}\n`;
        } catch (e: any) {
          debugInfo += `❌ Erro activeStaking: ${e.message}\n`;
        }

        // Tentar pegar primeiro stake
        for (let i = 0; i < 5; i++) {
          try {
            const stake = await contract.userStakes(account, i);
            debugInfo += `\n📊 Stake #${i}:\n`;
            debugInfo += `  Amount: ${stake.amount.toString()}\n`;
            debugInfo += `  Staking Period: ${Number(stake.stakingPeriod) / (24 * 60 * 60)} dias (${stake.stakingPeriod.toString()} segundos)\n`;
            debugInfo += `  StartTime: ${stake.startTime.toString()}\n`;
            debugInfo += `  EndTime: ${stake.endTime.toString()}\n`;
            debugInfo += `  Claimed: ${stake.claimed}\n`;
            debugInfo += `  ReturnRate: ${stake.returnRate.toString()}\n`;
            debugInfo += `  Net Amount: ${stake.netAmount.toString()}\n`;
            debugInfo += `  Fee Amount: ${stake.feeAmount.toString()}\n`;
          } catch (e: any) {
            debugInfo += `\n❌ Stake #${i}: ${e.message}\n`;
            if (i === 0) {
              debugInfo += `\n⚠️ Primeiro stake falhou - usuário pode não ter stakes\n`;
            }
            break;
          }
        }

        setInfo(debugInfo);
      } catch (error: any) {
        setInfo(`❌ Erro geral: ${error.message}`);
      }
    };

    checkStakes();
  }, [account]);

  if (!account) return null;

  return (
    <div className="fixed top-20 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-md max-h-96 overflow-auto z-50">
      <div className="font-bold mb-2 text-yellow-300">🔍 Stakes Debug</div>
      <pre className="whitespace-pre-wrap">{info || 'Carregando...'}</pre>
    </div>
  );
};

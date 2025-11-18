import React, { useState, useEffect } from 'react';
import { STAKE_PERIODS } from '../config/constants';
import { formatToken } from '../utils/web3';
import { UserStake } from '../types/contract';
import { FaLock, FaUnlock, FaClock, FaChartLine } from 'react-icons/fa';

interface StakingProps {
  balance: bigint;
  onStake: (amount: string, period: number) => Promise<void>;
  onWithdraw: (stakeId: number) => Promise<void>;
  getUserStakes: () => Promise<UserStake[]>;
  loading: boolean;
}

export const Staking: React.FC<StakingProps> = ({
  balance,
  onStake,
  onWithdraw,
  getUserStakes,
  loading,
}) => {
  const [amount, setAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [stakes, setStakes] = useState<UserStake[]>([]);
  const [loadingStakes, setLoadingStakes] = useState(false);

  const loadStakes = async () => {
    console.log('Staking: Carregando stakes...');
    setLoadingStakes(true);
    try {
      const userStakes = await getUserStakes();
      console.log('Staking: Stakes recebidos:', userStakes.length);
      console.log('Staking: Stakes detalhados:', userStakes);
      
      // Contar stakes claimed vs ativos
      const claimed = userStakes.filter((s: UserStake) => s.claimed).length;
      const active = userStakes.filter((s: UserStake) => !s.claimed).length;
      console.log(`Staking: ${active} ativos, ${claimed} reclamados`);
      
      setStakes(userStakes);
    } catch (error) {
      console.error('Staking: Erro ao carregar stakes:', error);
    } finally {
      setLoadingStakes(false);
    }
  };

  useEffect(() => {
    loadStakes();
  }, [getUserStakes]); // Recarrega quando a função muda (ex: conta diferente)

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    await onStake(amount, selectedPeriod);
    setAmount('');
    loadStakes();
  };

  const handleWithdraw = async (stakeId: number) => {
    await onWithdraw(stakeId);
    loadStakes();
  };

  const calculateReward = (stake: UserStake) => {
    const amountNum = parseFloat(formatToken(stake.amount));
    const returnRate = Number(stake.returnRate) / 10000; // returnRate vem como 300 para 3%, então divide por 10000
    return (amountNum * returnRate).toFixed(6);
  };

  const calculateEndDate = (stake: UserStake) => {
    // Usar endTime diretamente do contrato
    return new Date(Number(stake.endTime) * 1000);
  };

  const isStakeReady = (stake: UserStake) => {
    return Date.now() >= calculateEndDate(stake).getTime();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Calculadora de APR */}
      <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-4 sm:p-5 border border-[#2A3548]">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
          <div className="bg-gradient-to-br from-[#FFB800] to-[#FFA726] p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-2.5">
            <FaChartLine className="text-white text-xs sm:text-sm" />
          </div>
          Calculadora de Retornos
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {STAKE_PERIODS.map((period) => {
            const mockAmount = 1000; // 1000 PSC como exemplo
            const returnAmount = mockAmount * (period.returnRate / 100);
            // Calcular APR: (returnRate / dias) * 365
            const days = period.value / (24 * 60 * 60); // converter segundos para dias
            const apr = ((period.returnRate / days) * 365).toFixed(0);
            
            return (
              <div
                key={period.value}
                className="bg-[#1E2635] rounded-xl p-3 sm:p-4 border border-[#2A3548] hover:border-[#00D9D9]/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm sm:text-base font-bold text-white">{period.label}</span>
                  <div className="bg-gradient-to-r from-[#00E676] to-[#00B359] text-white px-2 py-1 rounded-full text-xs font-bold">
                    {apr}% APR
                  </div>
                </div>
                
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7D8694]">Retorno:</span>
                    <span className="font-semibold text-[#00E676]">+{period.returnRate}%</span>
                  </div>
                  <div className="bg-[#242D3E] rounded-lg p-2 mt-2">
                    <p className="text-[10px] sm:text-xs text-[#A8B2C1] mb-1">Exemplo: 1.000 PSC</p>
                    <p className="text-sm sm:text-base font-bold text-white">
                      Retorna {returnAmount.toFixed(0)} PSC
                    </p>
                    <p className="text-[10px] text-[#7D8694] mt-1">
                      Total: {(mockAmount + returnAmount).toFixed(0)} PSC
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 bg-[#1E2635] border border-[#00D9D9]/30 rounded-xl p-3">
          <p className="text-xs sm:text-sm text-[#A8B2C1] leading-relaxed">
            💡 <strong className="text-white">Dica:</strong> Quanto maior o período, maior o APR! 
            O período de 28 dias oferece até <strong className="text-[#00E676]">325% APR</strong>, 
            o mais alto do mercado DeFi.
          </p>
        </div>
      </div>

      {/* Estatísticas de Staking */}
      {stakes.length > 0 && (
        <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-4 sm:p-5 border border-[#2A3548]">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
            <div className="bg-gradient-to-br from-[#00E676] to-[#00B359] p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-2.5">
              <FaChartLine className="text-white text-xs sm:text-sm" />
            </div>
            Estatísticas Gerais
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(() => {
              const activeStakes = stakes.filter(s => !s.claimed);
              const totalStaked = activeStakes.reduce((sum, s) => sum + parseFloat(formatToken(s.amount)), 0);
              const readyStakes = activeStakes.filter(s => isStakeReady(s));
              const totalReady = readyStakes.reduce((sum, s) => {
                const amount = parseFloat(formatToken(s.amount));
                const reward = parseFloat(calculateReward(s));
                return sum + amount + reward;
              }, 0);
              const totalRewards = activeStakes.reduce((sum, s) => sum + parseFloat(calculateReward(s)), 0);
              
              return (
                <>
                  <div className="bg-[#1E2635] rounded-xl p-3 border border-[#2A3548]">
                    <p className="text-xs text-[#7D8694] mb-1">Stakes Ativos</p>
                    <p className="text-xl font-bold text-white">{activeStakes.length}</p>
                  </div>
                  <div className="bg-[#1E2635] rounded-xl p-3 border border-[#2A3548]">
                    <p className="text-xs text-[#7D8694] mb-1">Total em Stake</p>
                    <p className="text-xl font-bold text-[#00D9D9]">{totalStaked.toFixed(2)} PSC</p>
                  </div>
                  <div className="bg-[#1E2635] rounded-xl p-3 border border-[#2A3548]">
                    <p className="text-xs text-[#7D8694] mb-1">Pronto p/ Retirar</p>
                    <p className="text-xl font-bold text-[#00E676]">{totalReady.toFixed(2)} PSC</p>
                  </div>
                  <div className="bg-[#1E2635] rounded-xl p-3 border border-[#2A3548]">
                    <p className="text-xs text-[#7D8694] mb-1">Recompensas</p>
                    <p className="text-xl font-bold text-[#FFB800]">+{totalRewards.toFixed(2)} PSC</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Formulário de Stake */}
      <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-4 sm:p-5 border border-[#2A3548]">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
          <div className="bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-2.5">
            <FaLock className="text-white text-xs sm:text-sm" />
          </div>
          Fazer Stake
        </h2>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#A8B2C1] mb-2">
              Quantidade de PSC
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1E2635] border border-[#2A3548] text-white text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-[#00D9D9] focus:border-transparent placeholder-[#7D8694]"
              />
              <button
                onClick={() => setAmount(formatToken(balance))}
                className="absolute right-2 top-2 px-2 sm:px-3 py-1 bg-[#00D9D9]/20 text-[#00D9D9] rounded text-xs sm:text-sm hover:bg-[#00D9D9]/30 transition-colors border border-[#00D9D9]/30"
              >
                MAX
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#7D8694] mt-1">
              Disponível: {parseFloat(formatToken(balance)).toFixed(6)} PSC
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#A8B2C1] mb-2">
              Período de Stake
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {STAKE_PERIODS.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedPeriod === period.value
                      ? 'border-[#00D9D9] bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] text-white shadow-lg'
                      : 'border-[#2A3548] bg-[#1E2635] text-[#A8B2C1] hover:border-[#00D9D9]/50'
                  }`}
                >
                  <div className="text-base sm:text-lg font-bold">{period.label}</div>
                  <div className={`text-xs sm:text-sm font-semibold ${
                    selectedPeriod === period.value ? 'text-white' : 'text-[#00E676]'
                  }`}>
                    +{period.returnRate}% retorno
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStake}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] hover:from-[#00B8B8] hover:to-[#008888] text-white text-sm sm:text-base font-bold py-2 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Processando...' : 'Fazer Stake'}
          </button>
        </div>
      </div>

      {/* Lista de Stakes Ativos */}
      <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-4 sm:p-5 border border-[#2A3548]">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold flex items-center text-white">
            <div className="bg-gradient-to-br from-[#00E676] to-[#00B359] p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-2.5">
              <FaChartLine className="text-white text-xs sm:text-sm" />
            </div>
            Meus Stakes
          </h2>
          <button
            onClick={loadStakes}
            disabled={loadingStakes}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1E2635] hover:bg-[#242D3E] text-[#00D9D9] rounded-xl transition-all border border-[#2A3548] hover:border-[#00D9D9] disabled:opacity-50"
            title="Recarregar stakes"
          >
            <FaClock className={loadingStakes ? 'animate-spin' : ''} />
            <span className="text-xs sm:text-sm">Atualizar</span>
          </button>
        </div>

        {loadingStakes ? (
          <div className="text-center py-6 sm:py-8">
            <FaClock className="animate-spin text-3xl sm:text-4xl text-[#00D9D9] mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-[#A8B2C1]">Carregando seus stakes...</p>
          </div>
        ) : stakes.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <FaLock className="text-5xl sm:text-6xl text-[#2A3548] mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-[#A8B2C1] mb-2">Você não possui stakes ativos</p>
            <p className="text-xs sm:text-sm text-[#7D8694]">Faça seu primeiro stake acima para começar a ganhar recompensas!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {stakes.map((stake, index) => {
              // Mostrar apenas stakes não reclamados (ativos)
              if (stake.claimed) return null;
              
              const endDate = calculateEndDate(stake);
              const isReady = isStakeReady(stake);
              const reward = calculateReward(stake);

              return (
                <div
                  key={index}
                  className="border-2 border-[#2A3548] rounded-xl p-3 sm:p-4 hover:shadow-xl transition-all bg-[#1E2635] hover:border-[#00D9D9]/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaLock className="text-[#00D9D9] text-sm sm:text-base" />
                        <span className="font-bold text-base sm:text-lg text-white">
                          {parseFloat(formatToken(stake.amount)).toFixed(6)} PSC
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <p className="text-[#7D8694] text-[10px] sm:text-xs">Período</p>
                          <p className="font-semibold text-white">{Number(stake.stakingPeriod) / (24 * 60 * 60)} dias</p>
                        </div>
                        <div>
                          <p className="text-[#7D8694] text-[10px] sm:text-xs">Retorno</p>
                          <p className="font-semibold text-[#00E676]">
                            {Number(stake.returnRate) / 100}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[#7D8694] text-[10px] sm:text-xs">Recompensa</p>
                          <p className="font-semibold text-[#00D9D9]">{reward} PSC</p>
                        </div>
                        <div>
                          <p className="text-[#7D8694] text-[10px] sm:text-xs">Término</p>
                          <p className="font-semibold text-white text-[10px] sm:text-xs break-all">
                            {endDate.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-2 sm:ml-4">
                      {isReady ? (
                        <button
                          onClick={() => handleWithdraw(index)}
                          disabled={loading}
                          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-[#00E676] to-[#00B359] hover:from-[#00C864] hover:to-[#009F4A] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg text-xs sm:text-sm"
                        >
                          <FaUnlock className="text-xs sm:text-sm" />
                          <span>Retirar</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1 sm:space-x-2 text-[#FFB800] bg-[#1E2635] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-[#2A3548]">
                          <FaClock className="text-xs sm:text-sm" />
                          <span className="text-xs sm:text-sm">Bloqueado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

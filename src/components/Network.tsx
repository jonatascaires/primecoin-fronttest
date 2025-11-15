import React, { useState, useEffect } from 'react';
import { shortenAddress, formatToken } from '../utils/web3';
import { FaNetworkWired, FaUsers, FaLink, FaChevronDown, FaChevronRight, FaCoins } from 'react-icons/fa';
import { getContractReadOnly } from '../utils/web3';
import { PRIMECOIN_CONTRACT_ADDRESS } from '../config/constants';
import { PRIMECOIN_ABI } from '../config/abi';
import { useReferral } from '../hooks/useReferral';

interface NetworkMember {
  address: string;
  totalInvestedUSDT: bigint;
  activeStaking: bigint;
  commissionsReceived: bigint; // Quanto VOCÊ recebeu deste membro
  downlines?: NetworkMember[];
  isExpanded?: boolean;
}

interface NetworkProps {
  account: string | null;
  upline: string;
  hasSetUpline: boolean;
  onSetUpline: (uplineAddress: string) => Promise<void>;
  getDownlines: () => Promise<string[]>;
  loading: boolean;
}

export const Network: React.FC<NetworkProps> = ({
  account,
  upline,
  hasSetUpline,
  onSetUpline,
  getDownlines,
  loading,
}) => {
  const { savedReferral, getReferral, clearReferral } = useReferral();
  const [uplineAddress, setUplineAddress] = useState('');
  const [networkData, setNetworkData] = useState<NetworkMember[]>([]);
  const [referralLink, setReferralLink] = useState('');
  const [loadingNetwork, setLoadingNetwork] = useState(false);

  useEffect(() => {
    if (account) {
      setReferralLink(`${window.location.origin}?ref=${account}`);
      loadNetworkData();
    }
  }, [account]);

  // Preencher automaticamente o campo de upline com referral salvo
  useEffect(() => {
    if (!hasSetUpline && savedReferral) {
      setUplineAddress(savedReferral);
    }
  }, [savedReferral, hasSetUpline]);

  const loadNetworkData = async () => {
    if (!account) return;
    
    setLoadingNetwork(true);
    try {
      const contract = getContractReadOnly(PRIMECOIN_CONTRACT_ADDRESS, PRIMECOIN_ABI);
      
      // Buscar indicados diretos
      const directDownlines = await contract.getDirectDownlines(account);
      console.log('Direct downlines:', directDownlines);
      
      // Para cada indicado direto, buscar seus dados
      const networkMembers: NetworkMember[] = await Promise.all(
        directDownlines.map(async (downlineAddr: string) => {
          try {
            // Buscar dados de trading e staking deste usuário
            const tradingData = await contract.userTrading(downlineAddr);
            const activeStaking = await contract.getActiveStaking(downlineAddr);
            
            console.log(`Member ${downlineAddr}:`, {
              totalInvestedUSDT: tradingData.totalInvestedUSDT.toString(),
              activeStaking: activeStaking.toString(),
            });
            
            // Buscar comissões que VOCÊ recebeu deste membro
            const tradingComm = await contract.getTradingCommissionsGeneratedByUser(account, downlineAddr);
            const stakingComm = await contract.getStakingCommissionsGeneratedByUser(account, downlineAddr);
            const totalCommissions = tradingComm + stakingComm;
            
            console.log(`Commissions from ${downlineAddr}:`, {
              tradingComm: tradingComm.toString(),
              stakingComm: stakingComm.toString(),
              total: totalCommissions.toString(),
            });
            
            // Buscar indicados deste membro (nível 2)
            const level2Downlines = await contract.getDirectDownlines(downlineAddr);
            
            // Buscar dados dos indicados de nível 2
            const level2Data: NetworkMember[] = await Promise.all(
              level2Downlines.map(async (level2Addr: string) => {
                try {
                  const tradingData2 = await contract.userTrading(level2Addr);
                  const activeStaking2 = await contract.getActiveStaking(level2Addr);
                  
                  // Comissões que VOCÊ recebeu deste membro de nível 2
                  const tradingComm2 = await contract.getTradingCommissionsGeneratedByUser(account, level2Addr);
                  const stakingComm2 = await contract.getStakingCommissionsGeneratedByUser(account, level2Addr);
                  const totalCommissions2 = tradingComm2 + stakingComm2;
                  
                  return {
                    address: level2Addr,
                    totalInvestedUSDT: tradingData2.totalInvestedUSDT,
                    activeStaking: activeStaking2,
                    commissionsReceived: totalCommissions2,
                    isExpanded: false,
                  };
                } catch (error) {
                  console.error(`Erro ao buscar dados do nível 2 ${level2Addr}:`, error);
                  return {
                    address: level2Addr,
                    totalInvestedUSDT: 0n,
                    activeStaking: 0n,
                    commissionsReceived: 0n,
                    isExpanded: false,
                  };
                }
              })
            );
            
            return {
              address: downlineAddr,
              totalInvestedUSDT: tradingData.totalInvestedUSDT,
              activeStaking: activeStaking,
              commissionsReceived: totalCommissions,
              downlines: level2Data,
              isExpanded: false,
            };
          } catch (error) {
            console.error(`Erro ao buscar dados de ${downlineAddr}:`, error);
            return {
              address: downlineAddr,
              totalInvestedUSDT: 0n,
              activeStaking: 0n,
              commissionsReceived: 0n,
              downlines: [],
              isExpanded: false,
            };
          }
        })
      );
      
      setNetworkData(networkMembers);
    } catch (error) {
      console.error('Erro ao carregar rede:', error);
    } finally {
      setLoadingNetwork(false);
    }
  };

  const toggleMemberExpansion = (index: number) => {
    setNetworkData(prev => 
      prev.map((member, i) => 
        i === index ? { ...member, isExpanded: !member.isExpanded } : member
      )
    );
  };

  const handleSetUpline = async () => {
    if (!uplineAddress) return;
    await onSetUpline(uplineAddress);
    setUplineAddress('');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Link de referência copiado!');
  };

  return (
    <div className="space-y-4">
      {/* Definir Upline */}
      {!hasSetUpline && (
        <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-3 sm:p-5 border border-[#2A3548]">
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
            <div className="bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] p-1.5 sm:p-2.5 rounded-xl mr-1.5 sm:mr-2.5">
              <FaLink className="text-white text-xs sm:text-sm" />
            </div>
            Definir Patrocinador (Upline)
          </h2>

          <div className="bg-[#1E2635] border border-[#FFB800]/30 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-[#FFB800] leading-snug">
              ⚠️ Você precisa definir um patrocinador antes de fazer transações. Esta ação é permanente e não pode ser alterada.
            </p>
          </div>

          {savedReferral && (
            <div className="bg-[#1E2635] border border-[#00E676]/30 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-[#00E676] mb-1.5 sm:mb-2">
                ✅ Link de referência detectado! O endereço foi preenchido automaticamente.
              </p>
              <p className="text-[10px] sm:text-xs text-[#00E676] font-mono break-all">
                {savedReferral}
              </p>
              <button
                onClick={() => {
                  clearReferral();
                  setUplineAddress('');
                }}
                className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-[#FF4757] hover:text-[#E63946] underline"
              >
                Limpar e usar outro endereço
              </button>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#A8B2C1] mb-1.5 sm:mb-2">
                Endereço do Patrocinador
              </label>
              <input
                type="text"
                value={uplineAddress}
                onChange={(e) => setUplineAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1E2635] border border-[#2A3548] text-white rounded-xl focus:ring-2 focus:ring-[#00D9D9] focus:border-transparent placeholder-[#7D8694] text-sm sm:text-base"
              />
            </div>

            <button
              onClick={handleSetUpline}
              disabled={loading || !uplineAddress}
              className="w-full bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] hover:from-[#00B8B8] hover:to-[#008888] text-white font-bold py-2 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
            >
              {loading ? 'Processando...' : 'Definir Patrocinador'}
            </button>
          </div>
        </div>
      )}

      {/* Informações da Rede */}
      {hasSetUpline && (
        <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-3 sm:p-5 border border-[#2A3548]">
          <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 flex items-center text-white">
            <div className="bg-gradient-to-br from-[#00E676] to-[#00B359] p-1.5 sm:p-2.5 rounded-xl mr-1.5 sm:mr-2.5">
              <FaNetworkWired className="text-white text-xs sm:text-sm" />
            </div>
            Sua Rede
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {/* Upline */}
            <div>
              <h3 className="font-semibold text-[#A8B2C1] mb-1.5 sm:mb-2 flex items-center text-xs sm:text-sm">
                <FaLink className="mr-1.5 sm:mr-2 text-[#00D9D9] text-xs sm:text-base" />
                Seu Patrocinador
              </h3>
              <div className="bg-[#1E2635] rounded-xl p-3 sm:p-4 border border-[#2A3548]">
                <p className="font-mono text-xs sm:text-sm break-all text-white">{upline || 'Nenhum'}</p>
              </div>
            </div>

            {/* Link de Referência */}
            <div>
              <h3 className="font-semibold text-[#A8B2C1] mb-1.5 sm:mb-2 flex items-center text-xs sm:text-sm">
                <FaUsers className="mr-1.5 sm:mr-2 text-[#00E676] text-xs sm:text-base" />
                Seu Link de Referência
              </h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 sm:px-4 py-2 bg-[#1E2635] border border-[#2A3548] text-white rounded-xl text-xs sm:text-sm font-mono"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-4 py-2 bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] hover:from-[#00B8B8] hover:to-[#008888] text-white rounded-xl transition-all transform hover:scale-105 shadow-lg text-xs sm:text-sm whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#7D8694] mt-1.5 sm:mt-2">
                Compartilhe este link para convidar pessoas para sua rede
              </p>
            </div>

            {/* Rede Completa */}
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-[#A8B2C1] flex items-center text-xs sm:text-sm">
                  <FaUsers className="mr-1.5 sm:mr-2 text-[#FFB800] text-xs sm:text-base" />
                  Sua Rede ({networkData.length} diretos)
                </h3>
                <button
                  onClick={loadNetworkData}
                  disabled={loadingNetwork}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] hover:from-[#00B8B8] hover:to-[#008888] text-white rounded-lg transition-all disabled:opacity-50 shadow-lg"
                >
                  {loadingNetwork ? 'Carregando...' : 'Atualizar'}
                </button>
              </div>

              {loadingNetwork ? (
                <div className="bg-[#1E2635] rounded-xl p-6 sm:p-8 text-center border border-[#2A3548]">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#00D9D9] mb-1.5 sm:mb-2"></div>
                  <p className="text-[#A8B2C1] text-xs sm:text-sm">Carregando rede...</p>
                </div>
              ) : networkData.length === 0 ? (
                <div className="bg-[#1E2635] rounded-xl p-3 sm:p-4 text-center border border-[#2A3548]">
                  <p className="text-[#A8B2C1] text-xs sm:text-sm">Você ainda não possui indicados diretos</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {networkData.map((member, index) => (
                    <div key={index} className="border-2 border-[#2A3548] rounded-xl overflow-hidden bg-[#1E2635]">
                      {/* Indicado Direto (Nível 1) */}
                      <div className="bg-gradient-to-r from-[#00D9D9]/10 to-[#00A3A3]/10 p-3 sm:p-4 border-b border-[#2A3548]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                              <span className="text-[10px] sm:text-xs font-semibold text-white bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                NÍVEL 1
                              </span>
                              <span className="font-mono text-xs sm:text-sm font-semibold text-white">
                                {shortenAddress(member.address)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm mt-1.5 sm:mt-2">
                              <div className="bg-[#242D3E] rounded-lg p-1.5 sm:p-2 border border-[#2A3548]">
                                <p className="text-[10px] sm:text-xs text-[#7D8694] mb-0.5 sm:mb-1">Investido</p>
                                <p className="font-semibold text-[#00E676] flex items-center text-[10px] sm:text-xs">
                                  <FaCoins className="mr-0.5 sm:mr-1 text-[10px] sm:text-xs" />
                                  {formatToken(member.totalInvestedUSDT)} USDT
                                </p>
                              </div>
                              <div className="bg-[#242D3E] rounded-lg p-1.5 sm:p-2 border border-[#2A3548]">
                                <p className="text-[10px] sm:text-xs text-[#7D8694] mb-0.5 sm:mb-1">Em Stake</p>
                                <p className="font-semibold text-[#00D9D9] flex items-center text-[10px] sm:text-xs">
                                  <FaCoins className="mr-0.5 sm:mr-1 text-[10px] sm:text-xs" />
                                  {formatToken(member.activeStaking)} PSC
                                </p>
                              </div>
                              <div className="bg-gradient-to-r from-[#FFB800]/20 to-[#FFA726]/20 border border-[#FFB800]/30 rounded-lg p-1.5 sm:p-2">
                                <p className="text-[10px] sm:text-xs text-[#FFB800] mb-0.5 sm:mb-1 font-semibold">💰 Você Ganhou</p>
                                <p className="font-bold text-[#FFB800] flex items-center text-[10px] sm:text-xs">
                                  <FaCoins className="mr-0.5 sm:mr-1 text-[10px] sm:text-xs" />
                                  {formatToken(member.commissionsReceived)} PSC
                                </p>
                              </div>
                            </div>

                            {member.downlines && member.downlines.length > 0 && (
                              <button
                                onClick={() => toggleMemberExpansion(index)}
                                className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-[#00D9D9] hover:text-[#00B8B8] flex items-center"
                              >
                                {member.isExpanded ? <FaChevronDown className="mr-0.5 sm:mr-1 text-[10px] sm:text-xs" /> : <FaChevronRight className="mr-0.5 sm:mr-1 text-[10px] sm:text-xs" />}
                                {member.downlines.length} indicado(s) indireto(s)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Indicados Indiretos (Nível 2) */}
                      {member.isExpanded && member.downlines && member.downlines.length > 0 && (
                        <div className="bg-[#1E2635] p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                          {member.downlines.map((level2Member, level2Index) => (
                            <div key={level2Index} className="bg-[#242D3E] border border-[#2A3548] rounded-lg p-2 sm:p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                                    <span className="text-[10px] sm:text-xs font-semibold text-white bg-gradient-to-r from-[#00E676] to-[#00B359] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                      NÍVEL 2
                                    </span>
                                    <span className="font-mono text-[10px] sm:text-xs text-white">
                                      {shortenAddress(level2Member.address)}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                                    <div>
                                      <p className="text-[#7D8694] text-[10px] sm:text-xs">Investido</p>
                                      <p className="font-semibold text-[#00E676] text-[10px] sm:text-xs">
                                        {formatToken(level2Member.totalInvestedUSDT)} USDT
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[#7D8694] text-[10px] sm:text-xs">Em Stake</p>
                                      <p className="font-semibold text-[#00D9D9] text-[10px] sm:text-xs">
                                        {formatToken(level2Member.activeStaking)} PSC
                                      </p>
                                    </div>
                                    <div className="bg-[#FFB800]/20 rounded px-1 border border-[#FFB800]/30">
                                      <p className="text-[#FFB800] text-[10px] sm:text-xs font-semibold">Ganhou</p>
                                      <p className="font-bold text-[#FFB800] text-[10px] sm:text-xs">
                                        {formatToken(level2Member.commissionsReceived)} PSC
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Informações sobre Comissões */}
      <div className="bg-gradient-to-r from-[#00D9D9]/20 to-[#00A3A3]/20 rounded-2xl p-3 sm:p-5 text-white shadow-xl border border-[#00D9D9]/30">
        <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Sistema de Comissões</h3>
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm leading-snug">
          <p>• Ganhe comissões de até 17 níveis de profundidade na sua rede</p>
          <p>• As taxas variam de 3.5% a 14% dependendo do nível</p>
          <p>• Quanto maior sua rede, maiores são seus ganhos passivos</p>
          <p>• Todas as comissões são pagas automaticamente pelo contrato</p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { formatToken } from '../utils/web3';
import { FaDollarSign, FaExchangeAlt, FaInfoCircle, FaUsers, FaShieldAlt, FaChartLine, FaClock } from 'react-icons/fa';
import { SellLimitInfo, UserData } from '../types/contract';

interface TradingProps {
  balance: bigint;
  tokenPrice: string;
  onBuy: (usdtAmount: string) => Promise<void>;
  onSell: (tokenAmount: string) => Promise<void>;
  getSellLimitInfo: () => Promise<SellLimitInfo | null>;
  loading: boolean;
  userData?: UserData | null;
}

export const Trading: React.FC<TradingProps> = ({
  balance,
  tokenPrice,
  onBuy,
  onSell,
  getSellLimitInfo,
  loading,
  userData,
}) => {
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [sellLimitInfo, setSellLimitInfo] = useState<SellLimitInfo | null>(null);
  const [nextSellTime, setNextSellTime] = useState<bigint>(0n);
  const [countdown, setCountdown] = useState<string>('');

  // Carregar informações de limite ao trocar para aba de venda
  useEffect(() => {
    if (activeTab === 'sell') {
      loadSellLimitInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Atualizar countdown a cada segundo
  useEffect(() => {
    if (nextSellTime === 0n) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = BigInt(Math.floor(Date.now() / 1000));
      const remaining = nextSellTime - now;

      if (remaining <= 0n) {
        setCountdown('Disponível agora!');
        setNextSellTime(0n);
        return;
      }

      const hours = Number(remaining / 3600n);
      const minutes = Number((remaining % 3600n) / 60n);
      const seconds = Number(remaining % 60n);

      setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextSellTime]);

  const loadSellLimitInfo = async () => {
    const info = await getSellLimitInfo();
    setSellLimitInfo(info);
    
    // Atualizar o próximo tempo de venda se não puder vender hoje
    if (info && !info.canSellToday && info.timeUntilNextSell > 0n) {
      const now = BigInt(Math.floor(Date.now() / 1000));
      setNextSellTime(now + info.timeUntilNextSell);
    } else {
      setNextSellTime(0n);
    }
  };

  const calculateTokensFromUSDT = (usdt: string) => {
    if (!usdt || !tokenPrice) return '0';
    const price = parseFloat(tokenPrice);
    return (parseFloat(usdt) / price).toFixed(6);
  };

  const calculateUSDTFromTokens = (tokens: string) => {
    if (!tokens || !tokenPrice) return '0';
    return (parseFloat(tokens) * parseFloat(tokenPrice)).toFixed(2);
  };

  const handleBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) return;
    await onBuy(buyAmount);
    setBuyAmount('');
  };

  const handleSell = async () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) return;
    await onSell(sellAmount);
    setSellAmount('');
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Seção: Profit Cap (Cap de Lucro 2x) */}
      {userData?.trading && (
        <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-4 sm:p-5 border border-[#2A3548]">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
            <div className="bg-gradient-to-br from-[#FFB800] to-[#FFA726] p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-2.5">
              <FaShieldAlt className="text-white text-xs sm:text-sm" />
            </div>
            Cap de Lucro (2x)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div className="bg-[#1E2635] rounded-xl p-3 sm:p-4 border border-[#2A3548]">
              <p className="text-xs sm:text-sm text-[#7D8694] mb-1">Total Investido</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                ${parseFloat(formatToken(userData.trading.totalInvestedUSDT)).toFixed(2)}
              </p>
            </div>
            <div className="bg-[#1E2635] rounded-xl p-3 sm:p-4 border border-[#2A3548]">
              <p className="text-xs sm:text-sm text-[#7D8694] mb-1">Total Vendido</p>
              <p className="text-lg sm:text-xl font-bold text-[#00E676]">
                ${parseFloat(formatToken(userData.trading.totalSoldUSDT)).toFixed(2)}
              </p>
            </div>
            <div className="bg-[#1E2635] rounded-xl p-3 sm:p-4 border border-[#2A3548]">
              <p className="text-xs sm:text-sm text-[#7D8694] mb-1">Cap Máximo</p>
              <p className="text-lg sm:text-xl font-bold text-[#FFB800]">
                ${(parseFloat(formatToken(userData.trading.totalInvestedUSDT)) * 2).toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          <div className="bg-[#1E2635] rounded-xl p-3 sm:p-4 border border-[#2A3548]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-[#A8B2C1]">Progresso do Cap</span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {userData.trading.totalInvestedUSDT > 0n
                  ? ((parseFloat(formatToken(userData.trading.totalSoldUSDT)) / (parseFloat(formatToken(userData.trading.totalInvestedUSDT)) * 2)) * 100).toFixed(1)
                  : '0'}%
              </span>
            </div>
            <div className="w-full bg-[#242D3E] rounded-full h-3 sm:h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00E676] to-[#00B359] transition-all duration-500 rounded-full"
                style={{
                  width: userData.trading.totalInvestedUSDT > 0n
                    ? `${Math.min(((parseFloat(formatToken(userData.trading.totalSoldUSDT)) / (parseFloat(formatToken(userData.trading.totalInvestedUSDT)) * 2)) * 100), 100)}%`
                    : '0%'
                }}
              />
            </div>
            <p className="text-xs text-[#7D8694] mt-2">
              Você pode vender até 2x o valor investido. Restante: ${Math.max((parseFloat(formatToken(userData.trading.totalInvestedUSDT)) * 2) - parseFloat(formatToken(userData.trading.totalSoldUSDT)), 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Seção: Sistema Anti-Dump */}
      {sellLimitInfo && (
        <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-4 sm:p-5 border border-[#2A3548]">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
            <div className="bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] p-2 sm:p-2.5 rounded-xl mr-2 sm:mr-2.5">
              <FaChartLine className="text-white text-xs sm:text-sm" />
            </div>
            Sistema Anti-Dump
          </h3>
          
          {/* Informações Consolidadas */}
          <div className="bg-gradient-to-r from-[#1E2635] to-[#242D3E] border border-[#00D9D9]/30 rounded-xl p-3 sm:p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs sm:text-sm text-[#7D8694] mb-1">Tier Atual</p>
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-[#FFB800] to-[#FFA726] text-white px-3 py-1 rounded-full text-sm font-bold">
                    Nível {sellLimitInfo.boostTier + 1}
                  </div>
                  <span className="text-lg font-bold text-white">{(sellLimitInfo.totalSellPercent / 100).toFixed(2)}%/dia</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-[#7D8694] mb-1">
                  <FaUsers className="inline mr-1 text-[10px] sm:text-xs" />
                  Indicados Qualificados
                </p>
                <p className="text-xl font-bold text-[#00E676]">
                  {sellLimitInfo.qualifiedReferrals.toString()}/{sellLimitInfo.requiredForNextTier}
                </p>
              </div>
            </div>
            
            {/* Breakdown dos Limites */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-[#242D3E] rounded-lg p-2 border border-[#2A3548] text-center">
                <p className="text-[10px] sm:text-xs text-[#7D8694] mb-0.5">Base</p>
                <p className="text-xs sm:text-sm font-semibold text-white">1%</p>
              </div>
              <div className="bg-[#242D3E] rounded-lg p-2 border border-[#2A3548] text-center">
                <p className="text-[10px] sm:text-xs text-[#7D8694] mb-0.5">Boost</p>
                <p className="text-xs sm:text-sm font-semibold text-[#00E676]">+{(sellLimitInfo.boostPercent / 100).toFixed(2)}%</p>
              </div>
              <div className="bg-[#242D3E] rounded-lg p-2 border border-[#FFB800]/30 text-center">
                <p className="text-[10px] sm:text-xs text-[#7D8694] mb-0.5">Total</p>
                <p className="text-sm sm:text-base font-bold text-[#FFB800]">{(sellLimitInfo.totalSellPercent / 100).toFixed(2)}%</p>
              </div>
            </div>
            
            {/* Próximo Tier */}
            {sellLimitInfo.boostTier < 7 && (
              <div className="bg-[#242D3E] rounded-lg p-3 border border-[#2A3548]">
                <p className="text-xs text-[#A8B2C1] mb-2">
                  💡 Próximo Nível: {sellLimitInfo.requiredForNextTier - Number(sellLimitInfo.qualifiedReferrals)} indicados restantes
                </p>
                <div className="w-full bg-[#1E2635] rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#FFB800] to-[#FFA726] rounded-full transition-all"
                    style={{
                      width: `${(Number(sellLimitInfo.qualifiedReferrals) / sellLimitInfo.requiredForNextTier) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Tiers do Sistema */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { tier: 0, refs: 0, percent: 1.00 },
              { tier: 1, refs: 3, percent: 1.15 },
              { tier: 2, refs: 6, percent: 1.30 },
              { tier: 3, refs: 10, percent: 1.50 },
              { tier: 4, refs: 15, percent: 1.75 },
              { tier: 5, refs: 20, percent: 2.00 },
              { tier: 6, refs: 25, percent: 2.50 },
              { tier: 7, refs: 30, percent: 3.00 },
            ].map((t) => (
              <div
                key={t.tier}
                className={`p-2 rounded-lg border ${
                  sellLimitInfo.boostTier === t.tier
                    ? 'bg-gradient-to-r from-[#FFB800] to-[#FFA726] border-[#FFB800] text-white'
                    : 'bg-[#1E2635] border-[#2A3548] text-[#7D8694]'
                }`}
              >
                <p className="font-bold">{t.refs}+ refs</p>
                <p className="text-[10px]">{t.percent}%/dia</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Compra/Venda */}
      <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-2xl shadow-xl p-3 sm:p-5 border border-[#2A3548]">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
        <div className="bg-gradient-to-br from-[#00E676] to-[#00B359] p-1.5 sm:p-2.5 rounded-xl mr-1.5 sm:mr-2.5">
          <FaExchangeAlt className="text-white text-xs sm:text-sm" />
        </div>
        Comprar/Vender Tokens
      </h2>

      {/* Tabs */}
      <div className="flex space-x-1.5 sm:space-x-2 mb-4 sm:mb-5 border-b border-[#2A3548]">
        <button
          onClick={() => setActiveTab('buy')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 font-semibold transition-all rounded-t-xl text-xs sm:text-sm ${
            activeTab === 'buy'
              ? 'text-white bg-gradient-to-r from-[#00E676] to-[#00B359] border-b-2 border-[#00E676]'
              : 'text-[#A8B2C1] hover:text-white hover:bg-[#1E2635]'
          }`}
        >
          Comprar
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 font-semibold transition-all rounded-t-xl text-xs sm:text-sm ${
            activeTab === 'sell'
              ? 'text-white bg-gradient-to-r from-[#FF4757] to-[#FF3B57] border-b-2 border-[#FF4757]'
              : 'text-[#A8B2C1] hover:text-white hover:bg-[#1E2635]'
          }`}
        >
          Vender
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-[#1E2635]/50 backdrop-blur-sm border border-[#00D9D9]/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
        <div className="flex items-start space-x-2 sm:space-x-2.5">
          <FaInfoCircle className="text-[#00D9D9] mt-0.5 flex-shrink-0 text-xs sm:text-base" />
          <div className="text-xs sm:text-sm text-[#A8B2C1]">
            <p className="font-semibold mb-1 text-white">Importante:</p>
            <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 leading-snug">
              <li>As transações são realizadas através da PancakeSwap na BSC</li>
              <li>Você precisa ter USDT na sua carteira para comprar tokens</li>
              <li>Existem limites diários para venda baseados no seu lucro</li>
              <li>Taxas de rede (gas) serão cobradas em BNB</li>
              <li className="text-[#FFB800] font-semibold">Buy Limit: Máximo de 10% da reserva USDT por compra</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Buy Tab */}
      {activeTab === 'buy' && (
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#A8B2C1] mb-1.5 sm:mb-2">
              Quantidade de USDT para gastar
            </label>
            <input
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1E2635] border border-[#2A3548] text-white rounded-xl focus:ring-2 focus:ring-[#00D9D9] focus:border-transparent placeholder-[#7D8694] text-sm sm:text-base"
            />
          </div>

          {buyAmount && parseFloat(buyAmount) > 0 && (
            <div className="bg-[#1E2635] rounded-xl p-3 sm:p-4 border border-[#2A3548]">
              <div className="flex justify-between items-center mb-1 sm:mb-0">
                <span className="text-[#A8B2C1] text-xs sm:text-sm">Você receberá aproximadamente:</span>
                <span className="text-lg sm:text-xl font-bold text-[#00E676]">
                  {calculateTokensFromUSDT(buyAmount)} PSC
                </span>
              </div>
              <p className="text-[10px] sm:text-sm text-gray-500 mt-1 sm:mt-2">
                Preço: ${parseFloat(tokenPrice).toFixed(6)} por PSC
              </p>
            </div>
          )}

          <button
            onClick={handleBuy}
            disabled={loading || !buyAmount || parseFloat(buyAmount) <= 0}
            className="w-full bg-gradient-to-r from-[#00E676] to-[#00B359] hover:from-[#00C864] hover:to-[#009F4A] text-white font-bold py-2 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5 sm:space-x-2 shadow-lg text-sm sm:text-base">
            <FaDollarSign className="text-sm sm:text-base" />
            <span>{loading ? 'Processando...' : 'Comprar Tokens'}</span>
          </button>
        </div>
      )}

      {/* Sell Tab */}
      {activeTab === 'sell' && (
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#A8B2C1] mb-1.5 sm:mb-2">
              Quantidade de PSC para vender
            </label>
            <div className="relative">
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1E2635] border border-[#2A3548] text-white rounded-xl focus:ring-2 focus:ring-[#00D9D9] focus:border-transparent placeholder-[#7D8694] text-sm sm:text-base"
              />
              <button
                onClick={() => {
                  if (sellLimitInfo) {
                    setSellAmount(formatToken(sellLimitInfo.maxSellAmount));
                  }
                }}
                disabled={!sellLimitInfo || sellLimitInfo.maxSellAmount === 0n}
                className="absolute right-2 top-1.5 sm:top-2 px-2 sm:px-3 py-1 bg-[#00D9D9]/20 text-[#00D9D9] rounded-lg text-xs sm:text-sm hover:bg-[#00D9D9]/30 disabled:opacity-50 disabled:cursor-not-allowed border border-[#00D9D9]/30"
              >
                MAX
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm mt-1 space-y-0.5 sm:space-y-0">
              <span className="text-[#7D8694]">Disponível: <span className="text-white">{parseFloat(formatToken(balance)).toFixed(6)} PSC</span></span>
              {sellLimitInfo && (
                <span className="text-[#FFB800] font-semibold">
                  Máx. Hoje: {parseFloat(formatToken(sellLimitInfo.maxSellAmount)).toFixed(6)} PSC
                </span>
              )}
            </div>
          </div>

          {sellAmount && parseFloat(sellAmount) > 0 && (
            <div className="bg-[#1E2635] rounded-xl p-3 sm:p-4 border border-[#2A3548]">
              <div className="flex justify-between items-center mb-1 sm:mb-0">
                <span className="text-[#A8B2C1] text-xs sm:text-sm">Você receberá aproximadamente:</span>
                <span className="text-lg sm:text-xl font-bold text-[#00E676]">
                  {calculateUSDTFromTokens(sellAmount)} USDT
                </span>
              </div>
              <p className="text-[10px] sm:text-sm text-[#7D8694] mt-1 sm:mt-2">
                Preço: ${parseFloat(tokenPrice).toFixed(6)} por PSC
              </p>
            </div>
          )}

          <div className="bg-[#1E2635] border border-[#FFB800]/30 rounded-xl p-2 sm:p-3">
            <p className="text-xs sm:text-sm text-[#FFB800] leading-snug">
              ⚠️ Verifique seus limites diários de venda antes de realizar a transação
            </p>
          </div>

          {/* Countdown para próxima venda */}
          {sellLimitInfo && !sellLimitInfo.canSellToday && countdown && (
            <div className="bg-gradient-to-r from-[#FF4757]/20 to-[#FF3B57]/20 border border-[#FF4757]/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaClock className="text-[#FF4757] text-lg sm:text-xl" />
                  <div>
                    <p className="text-xs sm:text-sm text-[#A8B2C1]">Próxima venda disponível em:</p>
                    <p className="text-xl sm:text-2xl font-bold text-white font-mono">{countdown}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#7D8694] mt-2">
                Você poderá vender novamente após o período de cooldown de 24 horas
              </p>
            </div>
          )}

          {/* Mensagem quando pode vender */}
          {sellLimitInfo && sellLimitInfo.canSellToday && sellLimitInfo.maxSellAmount > 0n && (
            <div className="bg-gradient-to-r from-[#00E676]/20 to-[#00B359]/20 border border-[#00E676]/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <div className="bg-[#00E676] rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-[#00E676] font-semibold">
                  Você pode vender agora!
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleSell}
            disabled={loading || !sellAmount || parseFloat(sellAmount) <= 0 || (sellLimitInfo && !sellLimitInfo.canSellToday)}
            className="w-full bg-gradient-to-r from-[#FF4757] to-[#FF3B57] hover:from-[#E63946] hover:to-[#D62839] text-white font-bold py-2 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5 sm:space-x-2 shadow-lg text-sm sm:text-base"
          >
            <FaExchangeAlt className="text-sm sm:text-base" />
            <span>
              {loading ? 'Processando...' : 
               sellLimitInfo && !sellLimitInfo.canSellToday ? 'Aguarde o período de cooldown' : 
               'Vender Tokens'}
            </span>
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

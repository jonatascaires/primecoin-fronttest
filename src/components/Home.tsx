import { Link } from 'react-router-dom';
import { FaRocket, FaChartLine, FaUsers, FaShieldAlt, FaCoins, FaNetworkWired, FaCheckCircle, FaTrophy, FaWallet, FaExchangeAlt, FaArrowRight, FaGift } from 'react-icons/fa';
import { LaunchCountdown } from './LaunchCountdown';

export const Home = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Launch Countdown */}
      <LaunchCountdown />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D1F32] via-[#1A2332] to-[#0A1628] rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-[#00D9D9]/20">
        <div className="absolute top-0 right-0 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-[#00D9D9]/10 rounded-full blur-3xl -mr-48 sm:-mr-72 -mt-48 sm:-mt-72 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#00E676]/10 rounded-full blur-3xl -ml-40 sm:-ml-60 -mb-40 sm:-mb-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <FaRocket className="text-white text-5xl sm:text-7xl" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-[#00D9D9] to-white bg-clip-text text-transparent leading-tight">
            PrimeCoin (PSC)
          </h1>
          
          <p className="text-lg sm:text-2xl text-[#A8B2C1] mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Token DeFi com Proteções Estruturais, Staking de Alto Rendimento e Sistema MLM de 17 Níveis na BSC
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#benefits"
              className="w-full sm:w-auto bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] hover:from-[#00B8B8] hover:to-[#008888] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-[#00D9D9]/30 flex items-center justify-center space-x-2"
            >
              <span>Descubra os Benefícios</span>
              <FaArrowRight />
            </a>
            <a 
              href="#how-it-works"
              className="w-full sm:w-auto bg-[#1E2635] hover:bg-[#242D3E] border-2 border-[#00D9D9] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Como Funciona</span>
              <FaChartLine />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-[#1E2635] to-[#242D3E] rounded-2xl p-4 sm:p-6 border border-[#00D9D9]/30 hover:border-[#00D9D9]/60 transition-all hover:shadow-2xl hover:shadow-[#00D9D9]/20 hover:-translate-y-1">
          <div className="text-3xl sm:text-4xl font-bold text-[#00D9D9] mb-2">325%</div>
          <div className="text-xs sm:text-sm text-[#A8B2C1]">APR Staking</div>
        </div>
        <div className="bg-gradient-to-br from-[#1E2635] to-[#242D3E] rounded-2xl p-4 sm:p-6 border border-[#00E676]/30 hover:border-[#00E676]/60 transition-all hover:shadow-2xl hover:shadow-[#00E676]/20 hover:-translate-y-1">
          <div className="text-3xl sm:text-4xl font-bold text-[#00E676] mb-2">17</div>
          <div className="text-xs sm:text-sm text-[#A8B2C1]">Níveis de Rede</div>
        </div>
        <div className="bg-gradient-to-br from-[#1E2635] to-[#242D3E] rounded-2xl p-4 sm:p-6 border border-[#FFB800]/30 hover:border-[#FFB800]/60 transition-all hover:shadow-2xl hover:shadow-[#FFB800]/20 hover:-translate-y-1">
          <div className="text-3xl sm:text-4xl font-bold text-[#FFB800] mb-2">300%</div>
          <div className="text-xs sm:text-sm text-[#A8B2C1]">Boost Máximo</div>
        </div>
        <div className="bg-gradient-to-br from-[#1E2635] to-[#242D3E] rounded-2xl p-4 sm:p-6 border border-[#00D9D9]/30 hover:border-[#00D9D9]/60 transition-all hover:shadow-2xl hover:shadow-[#00D9D9]/20 hover:-translate-y-1">
          <div className="text-3xl sm:text-4xl font-bold text-[#00D9D9] mb-2">BSC</div>
          <div className="text-xs sm:text-sm text-[#A8B2C1]">Blockchain</div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#2A3548]">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] bg-clip-text text-transparent">
            Por Que Investir no PrimeCoin?
          </h2>
          <p className="text-[#A8B2C1] text-sm sm:text-base max-w-2xl mx-auto">
            Uma plataforma completa que combina os melhores recursos de DeFi com um sistema de recompensas inovador
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Benefit 1 */}
          <div className="group relative bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#2A3548] hover:border-[#00D9D9]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00D9D9]/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D9D9]/0 to-[#00D9D9]/0 group-hover:from-[#00D9D9]/5 group-hover:to-[#00D9D9]/10 rounded-2xl transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] p-3 sm:p-4 rounded-xl w-fit mb-4 shadow-lg">
                <FaChartLine className="text-white text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Alto Rendimento</h3>
              <p className="text-xs sm:text-sm text-[#A8B2C1] leading-relaxed">
                Staking com APR de até 325% em períodos de 7, 14 ou 28 dias. Retornos de 3% a 25% por período com recompensas automáticas.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="group relative bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#2A3548] hover:border-[#00E676]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00E676]/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/0 to-[#00E676]/0 group-hover:from-[#00E676]/5 group-hover:to-[#00E676]/10 rounded-2xl transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#00E676] to-[#00B359] p-3 sm:p-4 rounded-xl w-fit mb-4 shadow-lg">
                <FaNetworkWired className="text-white text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Network MLM Unificado</h3>
              <p className="text-xs sm:text-sm text-[#A8B2C1] leading-relaxed">
                Sistema de 17 níveis com comissões de 3.5% a 14%. Receba comissões em Trading e Staking com requisitos simplificados.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="group relative bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#2A3548] hover:border-[#FFB800]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFB800]/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/0 to-[#FFB800]/0 group-hover:from-[#FFB800]/5 group-hover:to-[#FFB800]/10 rounded-2xl transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FFB800] to-[#FFA726] p-3 sm:p-4 rounded-xl w-fit mb-4 shadow-lg">
                <FaTrophy className="text-white text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Referral Boost System</h3>
              <p className="text-xs sm:text-sm text-[#A8B2C1] leading-relaxed">
                8 tiers de boost que aumentam seu limite diário de venda de 1% até 3% baseado em indicações qualificadas ($100 mínimo).
              </p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="group relative bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#2A3548] hover:border-[#00D9D9]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00D9D9]/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D9D9]/0 to-[#00D9D9]/0 group-hover:from-[#00D9D9]/5 group-hover:to-[#00D9D9]/10 rounded-2xl transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] p-3 sm:p-4 rounded-xl w-fit mb-4 shadow-lg">
                <FaShieldAlt className="text-white text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Proteções Estruturais</h3>
              <p className="text-xs sm:text-sm text-[#A8B2C1] leading-relaxed">
                Anti-Dump (1-3% diário), Profit Cap (2x lifetime), Buy Limit (10%) e Ownership Renunciado garantem sustentabilidade.
              </p>
            </div>
          </div>

          {/* Benefit 5 */}
          <div className="group relative bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#2A3548] hover:border-[#00E676]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00E676]/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/0 to-[#00E676]/0 group-hover:from-[#00E676]/5 group-hover:to-[#00E676]/10 rounded-2xl transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#00E676] to-[#00B359] p-3 sm:p-4 rounded-xl w-fit mb-4 shadow-lg">
                <FaCoins className="text-white text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Liquidez PancakeSwap</h3>
              <p className="text-xs sm:text-sm text-[#A8B2C1] leading-relaxed">
                Compre e venda PSC diretamente via PancakeSwap. Preço inicial $0.00001 USDT com liquidez de 1.000 USDT / 100M PSC.
              </p>
            </div>
          </div>

          {/* Benefit 6 */}
          <div className="group relative bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#2A3548] hover:border-[#FFB800]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFB800]/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/0 to-[#FFB800]/0 group-hover:from-[#FFB800]/5 group-hover:to-[#FFB800]/10 rounded-2xl transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FFB800] to-[#FFA726] p-3 sm:p-4 rounded-xl w-fit mb-4 shadow-lg">
                <FaGift className="text-white text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Sistema de Créditos 3x</h3>
              <p className="text-xs sm:text-sm text-[#A8B2C1] leading-relaxed">
                Holders de contratos antigos (C1, C2, PSTK) recebem créditos 3x. Para cada $1 investido, desbloqueia $0.50 em bônus.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#2A3548]">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#00E676] to-[#00B359] bg-clip-text text-transparent">
            Como Funciona?
          </h2>
          <p className="text-[#A8B2C1] text-sm sm:text-base max-w-2xl mx-auto">
            Comece a ganhar em 4 passos simples
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#00D9D9]/30 hover:border-[#00D9D9]/60 transition-all hover:shadow-2xl hover:shadow-[#00D9D9]/20">
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] text-white font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-lg">
                1
              </div>
              <div className="mt-4">
                <div className="bg-[#00D9D9]/20 p-3 rounded-xl w-fit mb-4">
                  <FaWallet className="text-[#00D9D9] text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Conecte sua Carteira</h3>
                <p className="text-xs sm:text-sm text-[#A8B2C1]">
                  Use MetaMask ou WalletConnect para conectar na rede BSC
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#00E676]/30 hover:border-[#00E676]/60 transition-all hover:shadow-2xl hover:shadow-[#00E676]/20">
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-[#00E676] to-[#00B359] text-white font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-lg">
                2
              </div>
              <div className="mt-4">
                <div className="bg-[#00E676]/20 p-3 rounded-xl w-fit mb-4">
                  <FaUsers className="text-[#00E676] text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Defina seu Upline</h3>
                <p className="text-xs sm:text-sm text-[#A8B2C1]">
                  Entre com link de indicação ou informe o endereço do seu patrocinador
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#FFB800]/30 hover:border-[#FFB800]/60 transition-all hover:shadow-2xl hover:shadow-[#FFB800]/20">
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-[#FFB800] to-[#FFA726] text-white font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-lg">
                3
              </div>
              <div className="mt-4">
                <div className="bg-[#FFB800]/20 p-3 rounded-xl w-fit mb-4">
                  <FaExchangeAlt className="text-[#FFB800] text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Compre PSC</h3>
                <p className="text-xs sm:text-sm text-[#A8B2C1]">
                  Troque USDT por tokens PSC via PancakeSwap ou interface da plataforma
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#1E2635] to-[#242D3E] p-5 sm:p-6 rounded-2xl border border-[#00D9D9]/30 hover:border-[#00D9D9]/60 transition-all hover:shadow-2xl hover:shadow-[#00D9D9]/20">
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] text-white font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-lg">
                4
              </div>
              <div className="mt-4">
                <div className="bg-[#00D9D9]/20 p-3 rounded-xl w-fit mb-4">
                  <FaRocket className="text-[#00D9D9] text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Faça Staking</h3>
                <p className="text-xs sm:text-sm text-[#A8B2C1]">
                  Escolha período de 7, 14 ou 28 dias e ganhe de 3% a 25% de retorno garantido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gradient-to-br from-[#1A2332] to-[#1E2635] rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#2A3548]">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#FFB800] to-[#FFA726] bg-clip-text text-transparent">
            Recursos Exclusivos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex items-start space-x-4 bg-[#1E2635] p-4 sm:p-5 rounded-xl border border-[#2A3548] hover:border-[#00D9D9]/50 transition-all">
            <div className="bg-[#00D9D9]/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <FaCheckCircle className="text-[#00D9D9] text-xl sm:text-2xl" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-sm sm:text-base">Comissões Automáticas</h4>
              <p className="text-xs sm:text-sm text-[#A8B2C1]">Todas as comissões são creditadas automaticamente pelo contrato inteligente</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-[#1E2635] p-4 sm:p-5 rounded-xl border border-[#2A3548] hover:border-[#00E676]/50 transition-all">
            <div className="bg-[#00E676]/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <FaCheckCircle className="text-[#00E676] text-xl sm:text-2xl" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-sm sm:text-base">Profit Cap 2x</h4>
              <p className="text-xs sm:text-sm text-[#A8B2C1]">Saque até 2x do valor investido ao longo da vida. Proteção contra volatilidade extrema</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-[#1E2635] p-4 sm:p-5 rounded-xl border border-[#2A3548] hover:border-[#FFB800]/50 transition-all">
            <div className="bg-[#FFB800]/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <FaCheckCircle className="text-[#FFB800] text-xl sm:text-2xl" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-sm sm:text-base">Sistema MLM Unificado</h4>
              <p className="text-xs sm:text-sm text-[#A8B2C1]">Requisitos baseados em investimento acumulado (100 a 1.700 USDT para todos os 17 níveis)</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-[#1E2635] p-4 sm:p-5 rounded-xl border border-[#2A3548] hover:border-[#00D9D9]/50 transition-all">
            <div className="bg-[#00D9D9]/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <FaCheckCircle className="text-[#00D9D9] text-xl sm:text-2xl" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-sm sm:text-base">Dashboard Completo</h4>
              <p className="text-xs sm:text-sm text-[#A8B2C1]">Visualize toda sua rede, stakes ativos e ganhos em tempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00D9D9] via-[#00A3A3] to-[#008F8F] rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-[#00D9D9]/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Conecte sua carteira agora e entre para a revolução do PrimeCoin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/network"
              className="w-full sm:w-auto bg-white text-[#00A3A3] hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
            >
              <span>Conectar Carteira</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

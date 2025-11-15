import React from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { shortenAddress } from '../utils/web3';
import { FaWallet, FaNetworkWired, FaExclamationTriangle } from 'react-icons/fa';

export const Header: React.FC = () => {
  const { account, isConnecting, isCorrectNetwork, connectWallet, disconnectWallet, switchToBSC } = useWalletContext();

  return (
    <header className="bg-[#0A1628]/95 backdrop-blur-md text-white shadow-2xl border-b border-[#00D9D9]/10 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#00D9D9] to-[#00A3A3] rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all">
                <span className="text-lg sm:text-xl">💎</span>
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-[#00D9D9] to-white bg-clip-text text-transparent">PrimeCoin</h1>
              <p className="text-[10px] sm:text-xs text-[#7D8694] flex items-center space-x-1 sm:space-x-1.5">
                <span className="hidden sm:inline">Staking & MLM Platform</span>
                <span className="sm:hidden">Staking</span>
                <span className="animate-pulse text-[#00D9D9]">•</span>
                <span className="text-[9px] sm:text-xs bg-[#00D9D9]/20 px-1.5 sm:px-2 py-0.5 rounded-full text-[#00D9D9]">BSC</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isCorrectNetwork && account && (
              <button
                onClick={switchToBSC}
                className="flex items-center space-x-1.5 sm:space-x-2 bg-[#FFB800] hover:bg-[#FFA726] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-[#0A1628] text-xs sm:text-sm"
              >
                <FaExclamationTriangle className="animate-pulse text-xs sm:text-sm" />
                <span className="hidden sm:inline">Trocar para BSC</span>
                <span className="sm:hidden">BSC</span>
              </button>
            )}

            {account ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-[#1E2635] backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-[#00D9D9]/30">
                  <FaWallet className="text-[#00D9D9] text-xs sm:text-sm" />
                  <span className="font-mono font-semibold text-white text-xs sm:text-sm">{shortenAddress(account)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-[#FF4757] hover:bg-[#FF3B57] px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Desconectar</span>
                  <span className="sm:hidden">Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="group relative flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-[#00D9D9] via-[#00B8B8] to-[#00A3A3] text-white hover:shadow-2xl hover:shadow-[#00D9D9]/50 px-4 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold overflow-hidden text-xs sm:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <FaWallet className="relative z-10 text-sm sm:text-lg" />
                <span className="relative z-10">{isConnecting ? 'Conectando...' : 'Conectar'}</span>
              </button>
            )}
          </div>
        </div>

        {isCorrectNetwork && account && (
          <div className="mt-3 flex items-center space-x-2 text-[#00E676] text-xs bg-gradient-to-r from-[#00E676]/10 to-[#00B359]/10 px-4 py-2 rounded-full inline-flex backdrop-blur-sm border border-[#00E676]/30 shadow-lg">
            <div className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse"></div>
            <FaNetworkWired />
            <span className="font-bold">Conectado à BSC Mainnet</span>
          </div>
        )}
      </div>
    </header>
  );
};

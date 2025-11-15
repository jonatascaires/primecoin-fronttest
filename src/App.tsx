import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useWalletContext } from './contexts/WalletContext';
import { useContract } from './hooks/useContract';

import { Header } from './components/Header';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Staking } from './components/Staking';
import { Trading } from './components/Trading';
import { Network } from './components/Network';

import { FaHome, FaLock, FaExchangeAlt, FaNetworkWired } from 'react-icons/fa';

// Componente de Rota Protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { account, isCorrectNetwork } = useWalletContext();
  const { userData, loading } = useContract(account);

  if (!account) {
    return <Navigate to="/" replace />;
  }

  if (!isCorrectNetwork) {
    return <Navigate to="/" replace />;
  }

  // Aguardar o carregamento dos dados antes de redirecionar
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9D9] mx-auto mb-4"></div>
          <p className="text-[#A8B2C1]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (userData && !userData.hasSetUpline) {
    return <Navigate to="/network" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const { account, isCorrectNetwork } = useWalletContext();
  const {
    loading,
    userData,
    tokenPrice,
    stake,
    withdraw,
    buyTokens,
    sellTokens,
    setUpline,
    getSellLimitInfo,
    getUserStakes,
    getDownlines,
  } = useContract(account);

  const [activeTab, setActiveTab] = useState('home');

  // Atualizar activeTab baseado na localização
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path === '/dashboard') setActiveTab('dashboard');
    else if (path === '/staking') setActiveTab('staking');
    else if (path === '/trading') setActiveTab('trading');
    else if (path === '/network') setActiveTab('network');
  }, [location.pathname]);

  // Notificar quando um referral for detectado
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refParam = params.get('ref');
    
    if (refParam && !userData?.hasSetUpline) {
      toast.info(`Link de indicação detectado! Você será indicado por ${refParam.slice(0, 6)}...${refParam.slice(-4)}`);
    }
  }, [location.search, userData?.hasSetUpline]);

  const navItems = [
    { id: 'home', label: 'Início', icon: FaHome, path: '/', protected: false },
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/dashboard', protected: true },
    { id: 'staking', label: 'Staking', icon: FaLock, path: '/staking', protected: true },
    { id: 'trading', label: 'Trading', icon: FaExchangeAlt, path: '/trading', protected: true },
    { id: 'network', label: 'Rede', icon: FaNetworkWired, path: '/network', protected: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D1F32] to-[#0A1628]">
      <Header />

      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">

        {/* Alert: Wrong Network */}
        {account && !isCorrectNetwork && (
          <div className="bg-gradient-to-r from-[#1E2635] to-[#242D3E] border-2 border-[#FFB800] rounded-xl p-4 sm:p-6 text-center mb-3 sm:mb-4 shadow-lg">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⚠️</div>
            <h3 className="text-lg sm:text-xl font-bold text-[#FFB800] mb-1.5 sm:mb-2">
              Rede Incorreta Detectada
            </h3>
            <p className="text-[#A8B2C1] mb-2 sm:mb-3 text-xs sm:text-sm">
              Por favor, conecte-se à rede <span className="font-bold text-white">BSC (Binance Smart Chain)</span>
            </p>
            <p className="text-xs sm:text-sm text-[#7D8694]">
              Chain ID: 56<span className="hidden sm:inline"> | RPC: https://bsc-dataseed.binance.org/</span>
            </p>
          </div>
        )}

        {/* Alert: Upline Not Set */}
        {account && isCorrectNetwork && userData && !userData.hasSetUpline && location.pathname !== '/' && location.pathname !== '/network' && (
          <div className="bg-gradient-to-r from-[#1E2635] to-[#242D3E] border-2 border-[#FFB800] rounded-xl p-4 sm:p-6 mb-3 sm:mb-4 shadow-lg">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-center">⚠️</div>
            <h3 className="text-lg sm:text-xl font-bold text-[#FFB800] mb-1.5 sm:mb-2 text-center">
              Você precisa definir um patrocinador (Upline)
            </h3>
            <p className="text-[#A8B2C1] mb-3 sm:mb-4 text-xs sm:text-sm text-center">
              Esta ação é <span className="font-bold text-white">permanente</span> e necessária antes de fazer transações. Esta é uma ação única e não pode ser alterada depois.
            </p>
            <div className="flex justify-center">
              <Link
                to="/network"
                className="bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] hover:from-[#00B8B8] hover:to-[#008888] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                Definir Patrocinador Agora
              </Link>
            </div>
          </div>
        )}

        {/* Layout Principal com Sidebar (Desktop) ou sem (Mobile/Public) */}
        <div className="flex flex-col lg:flex-row gap-4 pb-20 lg:pb-4">
          {/* Sidebar de Navegação - Desktop apenas - Aparece quando conectado */}
          {account && isCorrectNetwork && (
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl shadow-2xl p-4 sticky top-20 border border-[#00D9D9]/10">
                  <div className="mb-4 pb-3 border-b border-[#2A3548]/50">
                    <h2 className="text-sm font-bold bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] bg-clip-text text-transparent">
                      Menu Principal
                    </h2>
                  </div>
                  <nav className="space-y-1.5">
                    {navItems.map((item) => {
                      const isLocked = item.protected && !userData?.hasSetUpline;
                      return (
                        <Link
                          key={item.id}
                          to={isLocked ? '#' : item.path}
                          onClick={(e) => {
                            if (isLocked) {
                              e.preventDefault();
                              toast.warning('Defina seu upline primeiro!');
                            } else {
                              setActiveTab(item.id);
                            }
                          }}
                          className={`group flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                            isLocked
                              ? 'text-[#7D8694] cursor-not-allowed opacity-50'
                              : activeTab === item.id
                              ? 'bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] text-white shadow-lg shadow-[#00D9D9]/30'
                              : 'text-[#A8B2C1] hover:bg-[#1E2635]/50 hover:text-white'
                          }`}
                        >
                          <div className={`transform transition-transform ${
                            activeTab === item.id && !isLocked ? 'scale-110' : 'group-hover:scale-110'
                          }`}>
                            <item.icon />
                          </div>
                          <span className="font-semibold">{item.label}</span>
                          {isLocked && <span className="ml-auto text-xs">🔒</span>}
                        </Link>
                      );
                    })}
                  </nav>
                  
                  {/* Info Card na Sidebar */}
                  <div className="mt-4 pt-4 border-t border-[#2A3548]/50">
                    <div className="relative group overflow-hidden bg-gradient-to-br from-[#1E2635] to-[#242D3E] rounded-xl p-3.5 border border-[#00D9D9]/20 hover:border-[#00D9D9]/40 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00D9D9]/0 to-[#00D9D9]/0 group-hover:from-[#00D9D9]/5 group-hover:to-[#00D9D9]/10 transition-all"></div>
                      <div className="relative z-10">
                        <p className="text-xs text-[#00D9D9] mb-2 font-bold flex items-center">
                          <span className="mr-1.5">💡</span> Dica Rápida
                        </p>
                        <p className="text-xs text-[#A8B2C1] leading-relaxed">
                          Indique amigos para aumentar suas comissões e limites de venda!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Conteúdo Principal */}
          <div className="flex-1">
            <Routes>
              {/* Rota Pública - Home */}
              <Route path="/" element={<Home />} />
              
              {/* Rota Semi-Protegida - Network (precisa de wallet mas não de upline) */}
              <Route
                path="/network"
                element={
                  account && isCorrectNetwork ? (
                    <Network
                      account={account}
                      upline={userData?.upline || ''}
                      hasSetUpline={userData?.hasSetUpline || false}
                      onSetUpline={setUpline}
                      getDownlines={getDownlines}
                      loading={loading}
                    />
                  ) : (
                    <Home />
                  )
                }
              />

              {/* Rotas Protegidas - Requerem wallet, rede correta e upline definido */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard userData={userData} tokenPrice={tokenPrice} getUserStakes={getUserStakes} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staking"
                element={
                  <ProtectedRoute>
                    <Staking
                      balance={userData?.balance || BigInt(0)}
                      onStake={stake}
                      onWithdraw={withdraw}
                      getUserStakes={getUserStakes}
                      loading={loading}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trading"
                element={
                  <ProtectedRoute>
                    <Trading
                      balance={userData?.balance || BigInt(0)}
                      tokenPrice={tokenPrice}
                      onBuy={buyTokens}
                      onSell={sellTokens}
                      getSellLimitInfo={getSellLimitInfo}
                      loading={loading}
                      userData={userData}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>

        {/* Navegação Mobile no Rodapé - Aparece apenas quando conectado */}
        {account && isCorrectNetwork && (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A1628]/95 backdrop-blur-md border-t border-[#00D9D9]/10 shadow-2xl z-50">
            <div className="flex items-center justify-around px-2 py-3">
              {navItems.map((item) => {
                const isLocked = item.protected && !userData?.hasSetUpline;
                return (
                  <Link
                    key={item.id}
                    to={isLocked ? '#' : item.path}
                    onClick={(e) => {
                      if (isLocked) {
                        e.preventDefault();
                        toast.warning('Defina seu upline primeiro!');
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className="flex flex-col items-center justify-center min-w-[60px] px-2 py-1.5 rounded-xl transition-all relative"
                  >
                    <div className={`mb-1 transition-all duration-300 ${
                      isLocked
                        ? 'text-[#7D8694] opacity-50'
                        : activeTab === item.id 
                        ? 'text-[#00D9D9] scale-110' 
                        : 'text-[#7D8694] scale-100'
                    }`}>
                      <item.icon className="text-xl" />
                    </div>
                    <span className={`text-[10px] font-semibold transition-colors ${
                      isLocked
                        ? 'text-[#7D8694] opacity-50'
                        : activeTab === item.id 
                        ? 'text-[#00D9D9]' 
                        : 'text-[#7D8694]'
                    }`}>
                      {item.label}
                    </span>
                    {isLocked && <span className="absolute top-0 right-0 text-xs">🔒</span>}
                    {activeTab === item.id && !isLocked && (
                      <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

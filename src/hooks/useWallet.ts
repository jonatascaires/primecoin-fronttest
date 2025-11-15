import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import { BSC_CHAIN_ID, BSC_CHAIN_ID_HEX } from '../config/constants';
import { toast } from 'react-toastify';

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const currentChainId = Number(network.chainId);
    setChainId(currentChainId);
    setIsCorrectNetwork(currentChainId === BSC_CHAIN_ID);
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Por favor, instale MetaMask ou outra carteira compatível!');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await checkNetwork();
        toast.success('Carteira conectada com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao conectar carteira:', error);
      toast.error('Erro ao conectar carteira: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  }, [checkNetwork]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setIsCorrectNetwork(false);
    toast.info('Carteira desconectada');
  }, []);

  const switchToBSC = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID_HEX }],
      });
      toast.success('Rede alterada para BSC!');
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BSC_CHAIN_ID_HEX,
                chainName: 'Binance Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed1.binance.org'],
                blockExplorerUrls: ['https://bscscan.com'],
              },
            ],
          });
          toast.success('Rede BSC adicionada e selecionada!');
        } catch (addError) {
          console.error('Erro ao adicionar rede:', addError);
          toast.error('Erro ao adicionar rede BSC');
        }
      } else {
        console.error('Erro ao trocar rede:', error);
        toast.error('Erro ao trocar para rede BSC');
      }
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Contas alteradas:', accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toast.info(`Conta alterada para ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
        checkNetwork();
      } else {
        disconnectWallet();
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      console.log('Rede alterada:', chainIdHex);
      window.location.reload();
    };

    // Usar addEventListener ao invés de .on para melhor compatibilidade
    if (window.ethereum.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Verificar se já está conectado
    const checkConnection = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        console.log('Contas conectadas:', accounts);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await checkNetwork();
        }
      } catch (error) {
        console.error('Erro ao verificar conexão:', error);
      }
    };

    checkConnection();

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkNetwork, disconnectWallet]);

  return {
    account,
    chainId,
    isConnecting,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToBSC,
  };
};

import { useEffect } from 'react';
import { useWalletContext } from '../contexts/WalletContext';

export const WalletDebug = () => {
  const { account, chainId, isCorrectNetwork } = useWalletContext();

  useEffect(() => {
    console.log('=== Wallet Debug ===');
    console.log('Account:', account);
    console.log('Chain ID:', chainId);
    console.log('Is Correct Network:', isCorrectNetwork);
    console.log('Window.ethereum:', window.ethereum ? 'Disponível' : 'Não disponível');
    
    if (window.ethereum) {
      console.log('Provider:', window.ethereum.isMetaMask ? 'MetaMask' : 'Outro');
    }
  }, [account, chainId, isCorrectNetwork]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
      <div className="font-bold mb-2">🔍 Wallet Debug</div>
      <div>Account: {account || 'Não conectado'}</div>
      <div>Chain ID: {chainId || 'N/A'}</div>
      <div>Network: {isCorrectNetwork ? '✅ BSC' : '❌ Incorreta'}</div>
      <div>Ethereum: {window.ethereum ? '✅' : '❌'}</div>
    </div>
  );
};

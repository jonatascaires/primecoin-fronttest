import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';

export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error('MetaMask não está instalado!');
  }
  return new BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

export const getContract = async (address: string, abi: any) => {
  const signer = await getSigner();
  return new Contract(address, abi, signer);
};

export const getContractReadOnly = (address: string, abi: any) => {
  const provider = getProvider();
  return new Contract(address, abi, provider);
};

export const formatToken = (value: bigint, decimals: number = 18): string => {
  return formatUnits(value, decimals);
};

export const parseToken = (value: string, decimals: number = 18): bigint => {
  return parseUnits(value, decimals);
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const switchNetwork = async (chainId: string) => {
  if (!window.ethereum) {
    throw new Error('MetaMask não está instalado!');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error: any) {
    // Se a rede não estiver adicionada, adicionar
    if (error.code === 4902) {
      throw new Error('Por favor, adicione a rede BSC manualmente no MetaMask');
    }
    throw error;
  }
};

export const addNetwork = async (networkConfig: any) => {
  if (!window.ethereum) {
    throw new Error('MetaMask não está instalado!');
  }

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [networkConfig],
  });
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

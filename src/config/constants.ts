export const PRIMECOIN_CONTRACT_ADDRESS = '0x04b975f8c0b02354b0bbab5e274094f1df13631d';

export const BSC_CHAIN_ID = 56;
export const BSC_CHAIN_ID_HEX = '0x38';

export const BSC_TESTNET_CHAIN_ID = 97;
export const BSC_TESTNET_CHAIN_ID_HEX = '0x61';

export const NETWORK_CONFIG = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed1.binance.org'],
  blockExplorerUrls: ['https://bscscan.com'],
};

export const STAKE_PERIODS = [
  { value: 7, label: '7 dias', returnRate: 3 },
  { value: 14, label: '14 dias', returnRate: 8 },
  { value: 28, label: '28 dias', returnRate: 25 },
];

export const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'; // USDT na BSC

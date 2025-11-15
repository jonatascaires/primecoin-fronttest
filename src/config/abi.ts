export const PRIMECOIN_ABI = [
  // ERC20 Standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Staking Functions
  "function stake(uint256 amount, uint256 period)",
  "function withdraw(uint256 stakeId)",
  "function getActiveStaking(address user) view returns (uint256)",
  "function userStakes(address user, uint256 index) view returns (tuple(uint256 amount, uint256 stakingPeriod, uint256 startTime, uint256 endTime, uint256 returnRate, bool claimed, uint256 netAmount, uint256 feeAmount))",
  
  // Trading Functions
  "function buyTokensWithUSDT(uint256 usdtAmount, uint256 minTokensOut) returns (uint256)",
  "function sellTokensForUSDT(uint256 tokenAmount, uint256 minUSDTOut) returns (uint256)",
  "function getAmountToSell(address user) view returns (uint256 amount, bool canSellToday, uint256 timeUntilNextSell, string reason)",
  "function getCurrentTokenPrice() view returns (uint256)",
  
  // Network Functions
  "function setUpline(address uplineAddress)",
  "function userUpline(address) view returns (address)",
  "function hasSetUpline(address) view returns (bool)",
  "function getDirectDownlines(address user) view returns (address[])",
  "function getUplineChain(address user) view returns (address[])",
  "function getNetworkSizeByLevel(address user) view returns (uint256[17])",
  "function getTradingCommissionsGeneratedByUser(address receiver, address generator) view returns (uint256)",
  "function getStakingCommissionsGeneratedByUser(address receiver, address generator) view returns (uint256)",
  "function checkCommissionEligibility(address upline, uint256 level, string networkType) view returns (bool isEligible, uint256 requiredAmount, uint256 currentAmount)",
  
  // User Info
  "function userCredits(address) view returns (uint256)",
  "function getUserCredit(address user) view returns (uint256)",
  "function totalCommissionsReceived(address) view returns (uint256)",
  "function referralInvestments(address) view returns (uint256)",
  "function referralBonuses(address) view returns (uint256 totalDirectReferrals, uint256 qualifiedReferrals, uint256 sellLimitBoostBasisPoints, uint256 currentTier)",
  "function userTrading(address) view returns (tuple(uint256 totalInvestedUSDT, uint256 totalSoldUSDT, uint256 lastSellTimestamp, uint256 lastSellDate, uint256 firstBuyTimestamp))",
  
  // Contract Info
  "function tradingEnabled() view returns (bool)",
  "function pancakeswapPair() view returns (address)",
  "function usdtToken() view returns (address)",
  "function getContractBalance() view returns (uint256)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Staked(address indexed user, uint256 amount, uint256 period, uint256 stakeId, uint256 totalFees)",
  "event Withdrawn(address indexed user, uint256 amount, uint256 reward, uint256 stakeId)",
  "event UplineSet(address indexed user, address indexed upline)",
  "event TokensPurchased(address indexed buyer, uint256 usdtSpent, uint256 tokensReceived)",
  "event TokensSold(address indexed seller, uint256 tokensSold, uint256 usdtReceived)",
] as const;

export const USDT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
] as const;

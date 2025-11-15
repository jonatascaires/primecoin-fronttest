export interface UserStake {
  amount: bigint;
  stakingPeriod: bigint;
  startTime: bigint;
  endTime: bigint;
  returnRate: bigint;
  claimed: boolean;
  netAmount: bigint;
  feeAmount: bigint;
}

export interface UserTrading {
  totalInvestedUSDT: bigint;
  totalSoldUSDT: bigint;
  lastSellTimestamp: bigint;
  lastSellDate: bigint;
  firstBuyTimestamp: bigint;
}

export interface SellInfo {
  amount: bigint;
  canSellToday: boolean;
  timeUntilNextSell: bigint;
  reason: string;
}

export interface SellLimitInfo {
  maxSellAmount: bigint;
  boostTier: number;
  boostPercent: number;
  totalSellPercent: number;
  qualifiedReferrals: bigint;
  requiredForNextTier: number;
}

export interface ReferralBoost {
  tier: number;
  count: number;
  percentage: number;
}

export interface UserData {
  address: string;
  balance: bigint;
  activeStaking: bigint;
  credits: bigint;
  totalCommissions: bigint;
  referralInvestments: bigint;
  upline: string;
  hasSetUpline: boolean;
  trading: UserTrading;
  referralBoost?: ReferralBoost;
}

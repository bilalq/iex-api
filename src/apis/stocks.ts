export interface QuoteRequest {
  displayPercent: boolean
}

export interface QuoteResponse {
  symbol: string
  companyName: string
  primaryExchange: string
  sector: string
  calculationPrice: 'tops' | 'sip' | 'previousClose' | 'close'
  open: number
  openTime: number
  close: number
  closeTime: number
  latestPrice: number
  latestSource: 'IEX real time price' | '15 minute delayed price' | 'Close' | 'Previous close'
  latestTime: string
  latestUpdate: number
  latestVolume: number
  iexRealtimePrice: number
  iexRealtimeSize: number
  iexLastUpdated: number
  delayedPrice: number
  delayedPriceTime: number
  previousClose: number
  change: number
  changePercent: number
  iexMarketPercent: number
  iexVolume: number
  avgTotalVolume: number
  iexBidPrice: number
  iexBidSize: number
  iexAskPrice: number
  iexAskSize: number
  marketCap: number
  peRatio: number | null
  week52High: number
  week52Low: number
  ytdChange: number
}

/**
 * Unfortunately, pattern based type definitions aren't supported in TypeScript.
 * There's no way to express 'date/<YYYYMMDD>' as a type outside of a generic
 * catch-all string.
 */
export type ChartRangeOption = '5y' | '2y' | '1y' | 'ytd' | '6m' | '3m' | '1m' | '1d' | 'dynamic' | string

export interface ChartItem {
  high: number
  low: number
  volume: number
  label: number
  changeOverTime: number
}

export interface OneDayChartItem extends ChartItem {
  minute: string
  average: number
  notional: number
  numberOfTrades: number
}

export interface MultiDayChartItem extends ChartItem {
  date: string
  open: number
  close: number
  unadjustedVolume: number
  change: number
  changePercent: number
  vwap: number
}

export type ChartResponse = OneDayChartItem[] | MultiDayChartItem[]

export interface OpenCloseResponse {
  open: {
    price: number
    time: number
  }
  close: {
    price: number
    time: number
  }
}

/**
 * Refers to the common issue type of the stock.
 *
 * ad – American Depository Receipt (ADR’s)
 * re – Real Estate Investment Trust (REIT’s)
 * ce – Closed end fund (Stock and Bond Fund)
 * si – Secondary Issue
 * lp – Limited Partnerships
 * cs – Common Stock
 * et – Exchange Traded Fund (ETF)
 * (blank) = Not Available, i.e., Warrant, Note, or (non-filing) Closed Ended Funds
 */
export type IssueType = 'ad' | 're' | 'ce' | 'si' | 'lp' | 'cs' | 'et' | ''

export interface CompanyResponse {
  symbol: string
  companyName: string
  exchange: string
  industry: string
  website: string
  description: string
  CEO: string
  issueType: IssueType
  sector: string
}

export interface KeyStatsResponse {
  companyName: string
  marketCap: number
  beta: number
  week52high: number
  week52low: number
  week52change: number
  shortInterest: number
  shortDate: string
  dividendRate: number
  dividendYield: number
  exDividendDate: string
  latestEPS: number
  latestEPSDate: string
  sharesOutstanding: number
  float: number
  returnOnEquity: number
  consensusEPS: number
  numberOfEstimates: number
  symbol: string
  EBITDA: number
  revenue: number
  grossProfit: number
  cash: number
  debt: number
  ttmEPS: number
  revenuePerShare: number
  revenuePerEmployee: number
  peRatioHigh: number
  peRatioLow: number
  EPSSurpriseDollar: number
  EPSSurprisePercent: number
  returnOnAssets: number
  returnOnCapital: number
  profitMargin: number
  priceToSales: number
  priceToBook: number
  day200MovingAvg: number
  day50MovingAvg: number
  institutionPercent: number
  insiderPercent: number
  shortRatio: number
  year5ChangePercent: number
  year2ChangePercent: number
  year1ChangePercent: number
  ytdChangePercent: number
  month6ChangePercent: number
  month3ChangePercent: number
  month1ChangePercent: number
  day5ChangePercent: number
}

export interface Previous {
  symbol: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  unadjustedVolume: number
  change: number
  changePercent: number
  vwap: number
}

export interface PreviousMarket {
  [symbol: string]: Previous
}

export type PreviousResponse = Previous | PreviousMarket

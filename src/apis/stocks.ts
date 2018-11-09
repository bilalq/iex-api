/* tslint:disable:no-magic-numbers */

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
  tags: string[]
}

export interface RelevantResponse {
  peers: boolean
  symbols: string[]
}

export interface Financial {
  reportDate: string | null
  grossProfit: number | null
  costOfRevenue: number | null
  operatingRevenue: number | null
  totalRevenue: number | null
  operatingIncome: number | null
  netIncome: number | null
  researchAndDevelopment: number | null
  operatingExpense: number | null
  currentAssets: number | null
  totalAssets: number | null
  totalLiabilities: number | null
  currentCash: number | null
  currentDebt: number | null
  totalCash: number | null
  totalDebt: number | null
  shareholderEquity: number | null
  cashChange: number | null
  cashFlow: number | null
  operatingGainsLosses: number | null
}

export interface FinancialsResponse {
  symbol: string
  financials: Financial[]
}

export interface News {
  datetime: string
  headline: string
  source: string
  url: string
  summary: string
  related: string
}

export type NewsRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
  13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 |
  28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 |
  43 | 44 | 45 | 46 | 47 | 48 | 49 | 50

export type SplitRange = '5y' | '2y' | '1y' | 'ytd' | '6m' | '3m' | '1m'

export interface Split {
exDate: string
declaredDate: string
recordDate: string
paymentDate: string
ratio: number
toFactor: number // TODO: API docs say string, but this looks to actually be a number
forFactor: number // TODO: API docs say string, but this looks to actually be a number
}

export interface LogoResponse {
  url: string
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

export interface Earning {
  actualEPS: number
  consensusEPS: number
  estimatedEPS: number
  announceTime: string // TODO: API docs don't mention this, but this can probably be an enum
  numberOfEstimates: number
  EPSSurpriseDollar: number
  EPSReportDate: string
  fiscalPeriod: string
  fiscalEndDate: string
}

export interface EarningsResponse {
  symbol: string
  earnings: Earning[]
}

export type DividendRange = '5y' | '2y' | '1y' | 'ytd' | '6m' | '3m' | '1m'

export interface Dividend {
  exDate: string
  paymentDate: string
  recordDate: string
  declaredDate: string
  amount: number
  flag: string // TODO: API docs don't mention this, but this can probably be an enum
  type: 'Dividend income' | 'Interest income' | 'Stock dividend' |
        'Short term capital gain' | 'Medium term capital gain' |
        'Long term capital gain' | 'Unspecified term capital gain'
  qualified: 'P' | 'Q' | 'N' | '' | null // TODO: API Docs say null here, but we need to confirm if that ever happens
  indicated: string // TODO: API docs don't mention this, but this can probably be an enum
}

export interface DelayedQuoteResponse {
  symbol: string
  delayedPrice: number
  high: number
  low: number
  delayedSize: number
  delayedPriceTime: number
  processedTime: number
}

export type MarketList = 'mostactive' | 'gainers' | 'losers' | 'iexvolume' | 'iexpercent'

export interface EffectiveSpread {
  volume: number // TODO: API docs say this is a string, but it looks like it's a number
  venue: string
  venueName: string
  effectiveSpread: number
  effectiveQuoted: number
  priceImprovement: number
}

export interface VolumeByVenue {
volume: number
venue: string
venueName: string
date: string | null
marketPercent: number
avgMarketPercent: number
}

/**
 * Response type when fetching realtime data
 * for stocks.
 */
export interface RealtimeQuoteResponse {
  readonly symbol: string,
  readonly sector: string,
  readonly securityType: string,
  readonly bidPrice: number,
  readonly bidSize: number,
  readonly askPrice: number,
  readonly askSize: number,
  readonly lastUpdated: number,
  readonly lastSalePrice: number,
  readonly lastSaleSize: number,
  readonly lastSaleITime: number,
  readonly volume: number,
  readonly marketPercent: number,
  readonly seq: number
}

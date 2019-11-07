/* tslint:disable:no-magic-numbers */

export type StockEndpoint =
  | 'book'
  | 'chart'
  | 'company'
  | 'delayed-quote'
  | 'dividends'
  | 'earnings'
  | 'effective-spread'
  | 'financials'
  | 'threshold-securities'
  | 'short-interest'
  | 'stats'
  | 'largest-trades'
  | 'logo'
  | 'news'
  | 'ohlc'
  | 'peers'
  | 'previous'
  | 'price'
  | 'quote'
  | 'relevant'
  | 'splits'
  | 'volume-by-venue'
  | string

/**
 * IEX Primary Exchanges
 */
export enum PrimaryExchange {
  OTC = 'US OTC',
  NYSE = 'New York Stock Exchange',
  NASDAQ = 'NASDAQ'
}

export interface QuoteResponse {
  symbol: string
  companyName: string
  calculationPrice: 'tops' | 'sip' | 'previousClose' | 'close'
  open: number
  openTime: number
  close: number
  closeTime: number
  high: number
  low: number
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
  extendedPrice: number
  extendedChange: number
  extendedChangePercent: number
  extendedPriceTime: number
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
  week52High: number
  week52Low: number
  ytdChange: number
  primaryExchange: PrimaryExchange
}

/**
 * Unfortunately, pattern based type definitions aren't supported in TypeScript.
 * There's no way to express 'date/<YYYYMMDD>' as a type outside of a generic
 * catch-all string.
 */
export type ChartRangeOption = '5y' | '2y' | '1y' | 'ytd' | '6m' | '3m' | '1m' | '1d' | 'dynamic' | 'date' | string

export interface ChartParams {
  chartReset?: boolean
  chartSimplify?: boolean
  chartInterval?: number
  changeFromClose?: boolean
  chartLast?: number
  chartCloseOnly?: boolean
  range?: ChartRangeOption
  chartByDay?: boolean
  exactDate?: string
}

export interface ChartItem {
  change: number
  changeOverTime: number
  changePercent: number
  close: number
  date: string
  high: number
  label: string
  low: number
  open: number
  volume: number
}

// Not currently supported
export interface CloseOnlyChartItem {
  date: string
  close: number
  volume: number
}

export type ChartResponse = ChartItem[]

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
export type IssueType = 'ad' | 're' | 'ce' | 'si' | 'lp' | 'cs' | 'et' | '' | 'ps'

/**
 * IEX Languages
 */
export enum Language {
  EN = 'en',
  PT = 'pt',
  FR = 'fr',
  DE = 'de'
}

export type IexLanguage =
  | Language.EN
  | Language.PT
  | Language.FR
  | Language.DE

export interface CompanyResponse {
  symbol: string
  companyName: string
  employees: number
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
  datetime: number
  headline: string
  source: string
  url: string
  summary: string
  related: string
  image: string
  lang: IexLanguage
  hasPaywall: boolean
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
  marketcap: number
  week52high: number
  week52low: number
  week52change: number
  sharesOutstanding: number
  float: number
  symbol: string
  avg10Volume: number
  avg30Volume: number
  day200MovingAvg: number
  day50MovingAvg: number
  employees: number
  ttmEPS: number
  ttmDividendRate: number
  dividendYield: number
  nextDividendDate: string
  exDividendDate: string
  nextEarningsDate: string
  peRatio: number
  beta: number
  maxChangePercent: number
  year5ChangePercent: number
  year2ChangePercent: number
  year1ChangePercent: number
  ytdChangePercent: number
  month6ChangePercent: number
  month3ChangePercent: number
  month1ChangePercent: number
  day30ChangePercent: number
  day5ChangePercent: number
}

export interface Previous {
  symbol: string
  date: string
  open: number
  high: number
  low: number
  close: number
  uOpen: number
  uHigh: number
  uLow: number
  uClose: number
  volume: number
  uVolume: number
  change: number
  changePercent: number
  changeOverTime: number
}

export interface PreviousMarket {
  [symbol: string]: Previous
}

export type PreviousResponse = Previous | PreviousMarket

export interface Earning {
  actualEPS: number
  consensusEPS: number
  announceTime: string // TODO: API docs don't mention this, but this can probably be an enum
  numberOfEstimates: number
  EPSSurpriseDollar: number
  EPSReportDate: string
  fiscalPeriod: string
  fiscalEndDate: string
  yearAgo: number
  yearAgoChangePercent: number
}

export interface EarningsResponse {
  symbol: string
  earnings: Earning[]
}

export interface EarningsEstimate {
  consensusEPS: number
  numberOfEstimates: number
  fiscalPeriod: string
  fiscalEndDate: string
  reportDate: string
}

export interface EarningsEstimateResponse {
  symbol: string
  estimates: EarningsEstimate[]
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

export interface RecommendationTrendsResponse {
  consensusEndDate: number
  consensusStartDate: number
  corporateActionsAppliedDate: number
  ratingBuy: number
  ratingHold: number
  ratingNone: number
  ratingOverweight: number
  ratingScaleMark: number
  ratingSell: number
  ratingUnderweight: number
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

export type Collection = 'sector' | 'tag' | 'list'

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

export interface Classification {
  industry: string
  sector: string
  tags: string[]
}

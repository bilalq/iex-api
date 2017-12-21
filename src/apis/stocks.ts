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

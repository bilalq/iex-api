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

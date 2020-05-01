import moment from 'moment-timezone'
import { EVENT_TYPE } from './apis/events'
import * as MarketDataAPI from './apis/marketData'
import * as ReferenceDataAPI from './apis/referenceData'
import * as StocksAPI from './apis/stocks'

const toQueryList = (values: string[]): string => values.map(encodeURIComponent).join(',')

export const toIexSymbol = (symbol: string) => symbol.indexOf('/') > 1
  ? symbol.replace(/\//g, '.')
  : symbol

export const fromIexSymbol = (symbol: string) => symbol.replace(/\./g, '/')

const formatDate = (date: Date | undefined) => {
  if (date === undefined) {
    return date
  }
  // tslint:disable:no-unsafe-any
  return moment.tz(date, 'America/New_York').format('YYYY-MM-DD') as string
}

// tslint:disable:no-unsafe-any
const toParams = (params: any): string =>
  Object.keys(params)
    .filter(key => params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
// tslint:enable:no-unsafe-any

/**
 * This class handles communication with the IEX API in a type-safe and flexible
 * way. It is usable in Browser, React Native, and NodeJS contexts.
 */
export default class IEXClient {
  private readonly fetchFunction: typeof fetch
  private readonly httpsEndpoint: string

  /**
   * @param fetchFunction A function that is API compatible with the browser
   *  fetch function. In browsers and React Native contexts, the global fetch
   *  object can be passed in. In NodeJS, a library like fetch-ponyfill can be
   *  used to provide such a function.
   * @param httpsEndpoint An optional argument to override the IEX API endpoint.
   *  Unless you have a specific mock endpoint or the like in mind, it is
   *  recommended to omit this argument.
   */
  public constructor(fetchFunction: typeof fetch, httpsEndpoint = 'https://api.iextrading.com/1.0') {
    this.fetchFunction = fetchFunction
    this.httpsEndpoint = httpsEndpoint
    this.request = this.request.bind(this) // tslint:disable-line:no-unsafe-any
  }

  /**
   * This function does a straight pass-through request to the IEX api using the
   * path provided. It can be used to do any call to the service, including ones
   * that respond with content-type text/csv or application/json.
   *
   * @example
   *   request('/stock/aapl/price')
   *   request('/stock/aapl/quote?displayPercent=true')
   *
   * @see https://iextrading.com/developer/docs/#getting-started
   *
   * @param path The path to hit the IEX API endpoint at.
   */
  public request(path: string): Promise<any> {
    return this.fetchFunction(`${this.httpsEndpoint}/${path}`)
      .then(res => {
        const contentType = res.headers.get('content-type')
        if (contentType === null) {
          return null
        } else if (contentType.includes('application/json')) {
          return res.json()
        } else {
          return res.text()
        }
      })
  }

  /**
   * Gets the full list of stock symbols supported by IEX.
   *
   * @see https://iextrading.com/developer/docs/#symbols
   */
  public symbols(): Promise<ReferenceDataAPI.StockSymbol[]> {
    return this.request('/ref-data/symbols')
  }

  /**
   * This function retrieves symbols in batch mode
   *
   * @example
   *   request('price', 'AAPL', 'MSFT)
   *   request('quote', 'F', 'GM')
   *
   * @see https://iextrading.com/developer/docs/#batch-requests
   *
   * @param types one or more IEX endpoint names, eg quote, divideneds, earnings. Limited to 10 types
   * @param symbols the array of symbols to retrieve
   * @param params any optional map of additional params to pass through
   */
  public stockBatch(
    types: StocksAPI.StockEndpoint | StocksAPI.StockEndpoint[],
    symbols: string[],
    params?: {}
  ): Promise<any> {
    const iexSymbols = symbols.map(toIexSymbol)
    const paramSuffix = params ? toParams(params) : ''

    if (typeof types === 'string') {
      return this.request(`/stock/market/${encodeURIComponent(types)}?symbols=${toQueryList(iexSymbols)}&${paramSuffix}`)
    }

    return this.request(`/stock/market/batch?types=${toQueryList(types)}&symbols=${toQueryList(iexSymbols)}&${paramSuffix}`)
      .then((response: { [key: string]: any }) => {
        for (const key in response) {
          if (/\./g.test(key)) {
            response[fromIexSymbol(key)] = response[key]
            delete response[key] // tslint:disable-line:no-dynamic-delete
          }
        }

        return response
      })
  }

  /**
   * Gets the quote information of a given stock.
   *
   * @see https://iextrading.com/developer/docs/#quote
   * @param stockSymbol The symbol of the stock to fetch data for.
   * @param [displayPercent=false] If set to true, all percentage values will be multiplied by a factor of 100.
   */
  public stockQuote(stockSymbol: string, displayPercent?: boolean): Promise<StocksAPI.QuoteResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    const queryString = displayPercent ? '?displayPercent=true' : ''
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/quote${queryString}`)
  }

  /**
   * Gets charting data for a stock in a given range.
   *
   * @see https://iextrading.com/developer/docs/#chart
   * @param stockSymbol The symbol of the stock to fetch data for.
   * @param range The time range to load chart data for.
   */
  public stockChart(stockSymbol: string, params?: StocksAPI.ChartParams): Promise<StocksAPI.ChartResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    const urlSuffix = params ? `?${toParams(params)}` : ''
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/chart${urlSuffix}`)
  }

  /**
   * Gets the price and time for the open and close of a stock.
   *
   * @see https://iextrading.com/developer/docs/#open-close
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockOpenClose(stockSymbol: string): Promise<StocksAPI.OpenCloseResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/open-close`)
  }

  /**
   * Gets previous day adjusted price data for a single stock, or an object
   * keyed by symbol of price data for the whole market.
   *
   * @see https://iextrading.com/developer/docs/#previous
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockPrevious(stockSymbol: string): Promise<StocksAPI.PreviousResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/previous`)
  }

  /**
   * Gets information about the company associated with the stock symbol.
   *
   * @see https://iextrading.com/developer/docs/#company
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockCompany(stockSymbol: string): Promise<StocksAPI.CompanyResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/company`)
  }

  /**
   * Gets key stats for the given stock symbol.
   *
   * @see https://iextrading.com/developer/docs/#key-stats
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockKeyStats(stockSymbol: string): Promise<StocksAPI.KeyStatsResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/stats`)
  }

  /**
   * Gets a list of peer tickerss for the given symbols.
   *
   * @see https://iextrading.com/developer/docs/#peers
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockPeers(stockSymbol: string): Promise<string[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/peers`)
  }

  /**
   * Similar to the peers endpoint, except this will return most active market
   * symbols when peers are not available. If the symbols returned are not
   * peers, the peers key will be false. This is not intended to represent a
   * definitive or accurate list of peers, and is subject to change at any time.
   *
   * @see https://iextrading.com/developer/docs/#relevant
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockRelevant(stockSymbol: string): Promise<StocksAPI.RelevantResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/relevant`)
  }

  /**
   * Gets a list of news articles related to the given stock.
   *
   * @see https://iextrading.com/developer/docs/#news
   *
   * @param stockSymbol The symbol of the stock to fetch news for.
   * @param [range=10] The number of news articles to pull. Defaults to 10 if omitted.
   */
  public stockNews(stockSymbol: string, range?: StocksAPI.NewsRange): Promise<StocksAPI.News[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    if (range) {
      return this.request(`/stock/${encodeURIComponent(iexSymbol)}/news?last=${range}`)
    } else {
      return this.request(`/stock/${encodeURIComponent(iexSymbol)}/news`)
    }
  }

  /**
   * Gets income statement, balance sheet, and cash flow data from the four most recent reported quarters.
   *
   * @see https://iextrading.com/developer/docs/#financials
   * @param stockSymbol The symbol of the stock to fetch data for.
   * @param last The number of periods to fetch
   * @param annual Whether to fetch annual financials, as opposed to quarterly financials
   */
  public stockFinancials(stockSymbol: string, last = 4, annual = false): Promise<StocksAPI.FinancialsResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    const lastParam = `last=${last}`
    const period = annual ? 'period=annual' : ''
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/financials?${lastParam}&${period}`)
  }

  /**
   * Gets earnings data from the four most recent reported quarters.
   *
   * @see https://iextrading.com/developer/docs/#earnings
   * @param stockSymbol The symbol of the stock to fetch data for.
   * @param last The number of periods to fetch
   */
  public stockEarnings(stockSymbol: string, last = 4): Promise<StocksAPI.EarningsResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/earnings?last=${last}`)
  }

  /**
   * Gets earnings estimate data for the next reporting period
   *
   * @see https://iexcloud.io/docs/api/#estimates
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockEarningsEstimate(stockSymbol: string): Promise<StocksAPI.EarningsEstimateResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/estimates`)
  }

  /**
   * Gets dividends paid by the company over the given range.
   *
   * @see https://iextrading.com/developer/docs/#dividends
   * @param stockSymbol The symbol of the stock to fetch data for.
   * @param range The date range to get dividends from.
   */
  public stockDividends(stockSymbol: string, range: StocksAPI.DividendRange): Promise<StocksAPI.Dividend[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/dividends/${range}`)
  }

  /**
   * Gets stock splits of the company over the given range.
   *
   * @see https://iextrading.com/developer/docs/#splits
   * @param stockSymbol The symbol of the stock to fetch data for.
   * @param range The date range to get splits from.
   */
  public stockSplits(stockSymbol: string, range: StocksAPI.SplitRange): Promise<StocksAPI.Split[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/splits/${range}`)
  }

  /**
   * Gets an object containing a URL to the company's logo.
   *
   * @see https://iextrading.com/developer/docs/#logo
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockLogo(stockSymbol: string): Promise<StocksAPI.LogoResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/logo`)
  }

  /**
   * Fetches the price of a given stock.
   *
   * @see https://iextrading.com/developer/docs/#price
   * @param stockSymbol The symbol of the stock to fetch prices for.
   * @return A single number, being the IEX real time price, the 15 minute
   *  delayed market price, or the previous close price, is returned.
   */
  public stockPrice(stockSymbol: string): Promise<number> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/price`)
  }

  /**
   * Gets the 15 minute delayed market quote.
   *
   * @see https://iextrading.com/developer/docs/#delayed-quote
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockDelayedQuote(stockSymbol: string): Promise<number> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/price`)
  }

  /**
   * Pulls data from the last four months.
   *
   * @see https://iexcloud.io/docs/api/#recommendation-trends
   * @param stockSymbol The symbol of the stock to fetch data for.
   */

  public stockRecommendationTrends(stockSymbol: string): Promise<StocksAPI.RecommendationTrendsResponse[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/recommendation-trends`)
  }

  /**
   * Return list of related stocks
   */
  public stockRelated(stockSymbol: string): Promise<string[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/related`)
  }

  /**
   * Return classification of stock
   */
  public stockClassification(stockSymbol: string): Promise<StocksAPI.Classification> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/classification`)
  }

  /**
   * Get a list of quotes for the top 10 symbols in a specified list.
   *
   * @see https://iextrading.com/developer/docs/#list
   * @param list The market list to fetch quotes from.
   * @param [displayPercent=false] If set to true, all percentage values will be multiplied by a factor of 100.
   */
  public stockMarketListTopTen(list: StocksAPI.MarketList, displayPercent?: boolean): Promise<StocksAPI.QuoteResponse[]> {
    const queryString = displayPercent ? '?displayPercent=true' : ''
    return this.request(`/stock/market/list/${list}${queryString}`)
  }

  /**
   * Returns an array of quote objects for a given collection type. Currently supported collection types are sector, tag, and list
   *
   * @see https://iextrading.com/developer/docs/#collections
   * @param type Type of collection
   * @param collectionName Name of the sector, tag, or list to return and is case sensitive.
   */
  public stockMarketCollection(type: StocksAPI.Collection, collectionName: string): Promise<StocksAPI.QuoteResponse[]> {
    return this.request(`/stock/market/collection/${type}?collectionName=${encodeURIComponent(collectionName)}`)
  }

  /**
   * Gets an array of effective spread, eligible volume, and price improvement
   * of a stock, by market. Unlike volume-by-venue, this will only return a
   * venue if effective spread is not ‘N/A’. Values are sorted in descending
   * order by effectiveSpread. Lower effectiveSpread and higher priceImprovement
   * values are generally considered optimal.
   *
   * @see https://iextrading.com/developer/docs/#effective-spread
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockEffectiveSpread(stockSymbol: string): Promise<StocksAPI.EffectiveSpread[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/effective-spread`)
  }

  /**
   * Gets 15 minute delayed and 30 day average consolidated volume percentage of
   * a stock, by market. This call will always return 13 values, and will be
   * sorted in ascending order by current day trading volume percentage.
   *
   * @see https://iextrading.com/developer/docs/#volume-by-venue
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockVolumeByVenue(stockSymbol: string): Promise<StocksAPI.VolumeByVenue[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/volume-by-venue`)
  }

  /**
   * Retrieves latest TOPS data for specified symbol
   */
  public tops(stockSymbol: string): Promise<MarketDataAPI.TopsResponse[]> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`tops?symbols=${encodeURIComponent(iexSymbol)}`)
  }

  /**
   * Retrieves latest DEEP data for specified symbol
   */
  public deep(stockSymbol: string): Promise<MarketDataAPI.DeepResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`deep?symbols=${encodeURIComponent(iexSymbol)}`)
  }

  /**
   * Retrieves latest System Event
   */
  public deepSystemEvent(): Promise<MarketDataAPI.SystemEvent> {
    return this.request('deep/system-event')
  }

  /**
   * Retrieves upcoming earnings.
   */
  public upcomingEarnings(
    params: {
      date?: Date,
      year?: number,
      month?: number,
      week?: number,
      startDate?: Date,
      endDate?: Date
    }
  ): Promise<MarketDataAPI.MarketUpcomingEarningsCacheResponse[]> {
    const formattedParams = {
      date: formatDate(params.date),
      startDate: formatDate(params.startDate),
      endDate: formatDate(params.endDate),
      year: params.year,
      month: params.month,
      week: params.week
    }
    const paramSuffix = `&${toParams(formattedParams)}`
    return this.request(`/stock/market/upcoming-events?type=${EVENT_TYPE.UPCOMING_EARNINGS}${paramSuffix}`)
  }

  /**
   * Retrieves market earnings for the current day
   */
  public marketEarnings(): Promise<MarketDataAPI.MarketEarningsResponse> {
    return this.request('/stock/market/today-earnings')
  }

  /**
   * Retrieves sector performance statistics for the current trading day
   */
  public sectorPerformance(): Promise<MarketDataAPI.SectorPerformanceResponse[]> {
    return this.request('/stock/market/sector-performance')
  }
  // TODO: integrate channel specific DEEP endpoints

  /**
   * Retrieves price target data for the stock symbol
   */
  public priceTarget(stockSymbol: string): Promise<MarketDataAPI.PriceTargetResponse> {
    const iexSymbol = toIexSymbol(stockSymbol)
    return this.request(`/stock/${encodeURIComponent(iexSymbol)}/price-target`)
  }
}

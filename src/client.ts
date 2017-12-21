import * as ReferenceDataAPI from './apis/referenceData'
import * as StocksAPI from './apis/stocks'

/**
 * Helper method that composes a query string out of abitrary JS objects.
 *
 * @param params The input object to compose a querystring out of.
 * @return A querystring that corresponds to the inputted params object. If
 *  the input is null/undefined or empty, this returns an empty string.
 */
const paramsToQueryString = (params?: {[key: string]: any}): string => {
  if (!params || Object.keys(params).length === 0) {
    return ''
  }
  return `?${Object.keys(params)
  .map(key => `${key}=${encodeURIComponent(params[key])}`) // tslint:disable-line:no-unsafe-any
  .join('&')}`
}

/**
 * This class handles communication with the IEX API in a type-safe and flexible
 * way. It is usable in Browser, React Native, and NodeJS contexts.
 */
export default class IEXClient {
  private fetchFunction: typeof fetch
  private httpsEndpoint: string

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
   * Gets the quote information of a given stock.
   *
   * @see https://iextrading.com/developer/docs/#quote
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockQuote(stockSymbol: string, params?: StocksAPI.QuoteRequest): Promise<StocksAPI.QuoteResponse> {
    return this.request(`/stock/${stockSymbol}/quote${paramsToQueryString(params)}`)
  }

  /**
   * Gets charting data for a stock in a given range.
   *
   * @see https://iextrading.com/developer/docs/#chart
   * @param stockSymbol The symbol of the stock to fetch data for.
   * @param range The time range to load chart data for.
   */
  public stockChart(stockSymbol: string, range: StocksAPI.ChartRangeOption): Promise<StocksAPI.ChartResponse> {
    return this.request(`/stock/${stockSymbol}/chart/${range}`)
  }

  /**
   * Gets the price and time for the open and close of a stock.
   *
   * @see https://iextrading.com/developer/docs/#open-close
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockOpenClose(stockSymbol: string): Promise<StocksAPI.OpenCloseResponse> {
    return this.request(`/stock/${stockSymbol}/open-close`)
  }

  /**
   * Gets previous day adjusted price data for a single stock, or an object
   * keyed by symbol of price data for the whole market.
   *
   * @see https://iextrading.com/developer/docs/#previous
   * @param stockSymbol The symbol of the stock to fetch data for.
   */
  public stockPrevious(stockSymbol: string): Promise<StocksAPI.PreviousResponse> {
    return this.request(`/stock/${stockSymbol}/previous`)
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
    return this.request(`/stock/${stockSymbol}/price`)
  }
}

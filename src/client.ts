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
}

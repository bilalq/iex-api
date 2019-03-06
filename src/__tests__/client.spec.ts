/* tslint:disable:newline-per-chained-call */
/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-var-requires */
/* tslint:disable:no-require-imports */
/* tslint:disable:no-implicit-dependencies */
import IEXClient from '../client'

const realFetch: typeof fetch = require('fetch-ponyfill')().fetch as typeof fetch // tslint:disable-line:no-unsafe-any
let fetchMock: typeof fetch
let resMock: {
  headers: Map<string, string | null>
  json(): string
  text(): string
}

describe('IEXClient', () => {
  describe('unit tests', () => {
    beforeEach(() => {
      resMock = {
        headers: new Map([['content-type', null]]),
        json: () => 'mocked json',
        text: () => 'mocked text'
      }
      fetchMock = jest.fn(() => Promise.resolve(resMock))
    })

    it('instantiates with a default HTTPS endpoint', () => {
      expect.assertions(2)
      const client = new IEXClient(fetchMock)
      return client.request('testExample').then(res => {
        expect(res).toBe(null)
        expect(fetchMock).toHaveBeenCalledWith('https://api.iextrading.com/1.0/testExample')
      })
    })

    it('can be instantiated with a custom https endpoint', () => {
      expect.assertions(2)
      const client = new IEXClient(fetchMock, 'https://example.com')
      return client.request('testExample').then(res => {
        expect(res).toBe(null)
        expect(fetchMock).toHaveBeenCalledWith('https://example.com/testExample')
      })
    })

    it('supports handling of JSON responses', () => {
      expect.assertions(2)
      resMock.headers.set('content-type', 'application/json; charset=utf-8;')
      const client = new IEXClient(fetchMock, 'https://example.com')
      return client.request('testExample').then(res => {
        expect(res).toBe('mocked json')
        expect(fetchMock).toHaveBeenCalledWith('https://example.com/testExample')
      })
    })

    it('supports handling of text responses', () => {
      expect.assertions(2)
      resMock.headers.set('content-type', 'text/csv; charset=utf-8;')
      const client = new IEXClient(fetchMock, 'https://example.com')
      return client.request('testExample').then(res => {
        expect(res).toBe('mocked text')
        expect(fetchMock).toHaveBeenCalledWith('https://example.com/testExample')
      })
    })
  })

  describe('integration tests', () => {
    let iex: IEXClient

    beforeEach(() => {
      iex = new IEXClient(realFetch)
      expect.hasAssertions()
    })

    it('can make arbitrary queries', async () => {
      const price = await iex.request('/stock/aapl/price')
      expect(price).toEqual(expect.any(Number))
    })

    it('can get a list of all stock symbols', async () => {
      const symbols = await iex.symbols()
      symbols.forEach(stockSym => {
        expect(stockSym.date).toEqual(expect.any(String))
        // This field can be a number now for CryptoCurrencies expect(stockSym.iexId).toEqual(expect.any(String))
        expect(parseInt(stockSym.iexId, 10)).not.toBeNaN()
        expect(typeof stockSym.isEnabled).toEqual('boolean')
        expect(stockSym.name).toEqual(expect.any(String))
        expect(stockSym.symbol).toEqual(expect.any(String))
        expect(stockSym.type).toEqual(expect.any(String))
      })
    })

    it('can get stockPrice', async () => {
      const price = await iex.stockPrice('aapl')
      expect(price).toEqual(expect.any(Number))
    })
  })
})

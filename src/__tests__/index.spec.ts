/* tslint:disable:newline-per-chained-call */
import attribution from '../attribution'
import IEXClient from '../client'
import { Attribution as indexAttribution, IEXClient as indexClient } from '../index'

describe('index', () => {
  it('exposes the IEX Attribution information', () => {
    expect(indexAttribution.citation).toEqual(attribution.citation)
    expect(indexAttribution.link).toEqual(attribution.link)
    expect(indexAttribution.termsOfServiceLink).toEqual(attribution.termsOfServiceLink)
    expect(indexAttribution.topsPriceDataCitation).toEqual(attribution.topsPriceDataCitation)
  })

  it('exposes the IEX Client constructor', () => {
    expect(indexClient).toBe(IEXClient)
  })
})

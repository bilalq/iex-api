import { Attribution as indexAttribution, Client as indexClient } from '../index';
import attribution from '../attribution';
import client from '../client';

describe('index', () => {
  it('exposes the IEX Attribution information', () => {
    expect(indexAttribution.citation).toEqual(attribution.citation);
    expect(indexAttribution.link).toEqual(attribution.link);
    expect(indexAttribution.termsOfServiceLink).toEqual(attribution.termsOfServiceLink);
    expect(indexAttribution.TOPSPriceDataCitation).toEqual(attribution.TOPSPriceDataCitation);
  });

  it('exposes the IEX Client constructor', () => {
    expect(indexClient).toBe(client);
  });
});

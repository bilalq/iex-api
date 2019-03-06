/**
 * /* tslint:disable:newline-per-chained-call
 *
 * @format
 */

import { attribution } from '../attribution';
import {
  attribution as indexAttribution,
  IEXClient as indexClient,
  IEXClient
} from '../index';

describe('index', () => {
  it('exposes the IEX Attribution information', () => {
    expect(indexAttribution.citation).toEqual(attribution.citation);
    expect(indexAttribution.link).toEqual(attribution.link);
    expect(indexAttribution.termsOfServiceLink).toEqual(
      attribution.termsOfServiceLink
    );
    expect(indexAttribution.topsPriceDataCitation).toEqual(
      attribution.topsPriceDataCitation
    );
  });

  it('exposes the IEX Client constructor', () => {
    expect(indexClient).toBe(IEXClient);
  });
});

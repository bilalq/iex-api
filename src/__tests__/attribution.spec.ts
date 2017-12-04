import attribution from '../attribution';

describe('attribution', () => {
  it('has IEX citations and links', () => {
    expect(attribution.citation).toEqual(jasmine.any(String));
    expect(attribution.link).toEqual(jasmine.any(String));
    expect(attribution.termsOfServiceLink).toEqual(jasmine.any(String));
    expect(attribution.TOPSPriceDataCitation).toEqual(jasmine.any(String));
  });
});

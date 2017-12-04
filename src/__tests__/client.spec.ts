import IEXClient from '../client';

let fetchMock: typeof fetch;

describe('client', () => {
  beforeEach(() => {
    fetchMock = jest.fn(path => Promise.resolve(({json: () => path})));
  });

  it('instantiates with a default HTTPS endpoint', () => {
    expect.assertions(2);
    const client = new IEXClient(fetchMock);
    return client.request('testExample').then(res => {
      expect(res).toBe('https://api.iextrading.com/1.0/testExample');
      expect(fetchMock).toHaveBeenCalledWith('https://api.iextrading.com/1.0/testExample')
    });
  });

  it('can be instantiated with a custom https endpoint', () => {
    expect.assertions(2);
    const client = new IEXClient(fetchMock, 'https://example.com');
    return client.request('testExample').then(res => {
      expect(res).toBe('https://example.com/testExample');
      expect(fetchMock).toHaveBeenCalledWith('https://example.com/testExample')
    });
  });
});


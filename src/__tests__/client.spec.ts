import IEXClient from '../client';

let fetchMock: typeof fetch;
let resMock: any;

describe('client', () => {
  beforeEach(() => {
    resMock = {
      headers: new Map([['content-type', null]]),
      json: () => 'mocked json',
      text: () => 'mocked text',
    };
    fetchMock = jest.fn(() => Promise.resolve(resMock));
  });

  it('instantiates with a default HTTPS endpoint', () => {
    expect.assertions(2);
    const client = new IEXClient(fetchMock);
    return client.request('testExample').then(res => {
      expect(res).toBe(null);
      expect(fetchMock).toHaveBeenCalledWith('https://api.iextrading.com/1.0/testExample')
    });
  });

  it('can be instantiated with a custom https endpoint', () => {
    expect.assertions(2);
    const client = new IEXClient(fetchMock, 'https://example.com');
    return client.request('testExample').then(res => {
      expect(res).toBe(null);
      expect(fetchMock).toHaveBeenCalledWith('https://example.com/testExample')
    });
  });

  it('supports handling of JSON responses', () => {
    expect.assertions(2);
    resMock.headers.set('content-type', 'application/json; charset=utf-8;');
    const client = new IEXClient(fetchMock, 'https://example.com');
    return client.request('testExample').then(res => {
      expect(res).toBe('mocked json');
      expect(fetchMock).toHaveBeenCalledWith('https://example.com/testExample')
    });
  });

  it('supports handling of text responses', () => {
    expect.assertions(2);
    resMock.headers.set('content-type', 'text/csv; charset=utf-8;');
    const client = new IEXClient(fetchMock, 'https://example.com');
    return client.request('testExample').then(res => {
      expect(res).toBe('mocked text');
      expect(fetchMock).toHaveBeenCalledWith('https://example.com/testExample')
    });
  });
});


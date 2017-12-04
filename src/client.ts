export default class IEXClient {
  private fetchFunction: typeof fetch;
  private httpsEndpoint: string;

  constructor(fetchFunction: typeof fetch, httpsEndpoint = 'https://api.iextrading.com/1.0') {
    this.fetchFunction = fetchFunction;
    this.httpsEndpoint = httpsEndpoint;
    this.request = this.request.bind(this);
  }

  request(path: string): Promise<any> {
    return this.fetchFunction(`${this.httpsEndpoint}/${path}`)
    .then(res => {
      const contentType = res.headers.get('content-type');
      if (contentType === null) {
        return null;
      } else if (contentType.includes('application/json')) {
        return res.json();
      } else {
        return res.text();
      }
    });
  }
}

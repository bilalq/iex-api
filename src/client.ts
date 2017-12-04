export default class IEXClient {
  private fetchFunction: typeof fetch;
  private httpsEndpoint: string;

  constructor(fetchFunction: typeof fetch, httpsEndpoint = 'https://api.iextrading.com/1.0') {
    this.fetchFunction = fetchFunction;
    this.httpsEndpoint = httpsEndpoint;
    this.request = this.request.bind(this);
  }

  request(path: string) {
    return this.fetchFunction(`${this.httpsEndpoint}/${path}`)
      .then(_ => _.json());
  }
}

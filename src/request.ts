// TODO: Replace usage of isomorphic-fetch with fetch-ponyfill to avoid messing
// with globals
import * as isoFetch from 'isomorphic-fetch';

const endpoint = 'https://api.iextrading.com/1.0'
const request = (path: string) => isoFetch(`${endpoint}/${path}`).then(_ => _.json());

export default request;

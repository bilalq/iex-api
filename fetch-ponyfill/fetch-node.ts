/**
 * Copyright (c) 2017 Mark Stanley Everitt
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @Copyright (c) 2017 Mark Stanley Everitt
 * @see https://github.com/qubyte/fetch-ponyfill
 *
 * @format
 */

// tslint:disable: completed-docs

import * as nodeFetch from 'node-fetch';

type url = string | Request;
type nodeFetch = (url: url, init?: RequestInit) => Promise<Response>;

function wrapFetchForNode(fetch: nodeFetch) {
  // Support schemaless URIs on the server for parity with the browser.
  // https://github.com/matthew-andrews/isomorphic-fetch/pull/10
  return (u: string, options: any) => {
    if (typeof u === 'string' && u.slice(0, 2) === '//') {
      return fetch(`https:' ${u}`, options);
    }

    return fetch(u, options);
  };
}

module.exports = () => {
  return {
    fetch: wrapFetchForNode(fetch),
    Headers: nodeFetch.Headers,
    Request: nodeFetch.Request,
    Response: nodeFetch.Response
  };
};
declare const define: any;
((root : any, factory) => {
  if (typeof define === 'function' && define.amd) {
    define(['libName'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('libName'));
  } else {
    this.returnExports = factory(root.libName);
  }
})(self, (b: any) => {
  //
  return b;
});

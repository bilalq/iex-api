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

const fetch = require('node-fetch');

function wrapFetchForNode(fetch) {
  // Support schemaless URIs on the server for parity with the browser.
  // https://github.com/matthew-andrews/isomorphic-fetch/pull/10
  return function (u, options) {
    if (typeof u === 'string' && u.slice(0, 2) === '//') {
      return fetch('https:' + u, options);
    }

    return fetch(u, options);
  };
}

module.exports = function (context) {
  // This modifies the global `node-fetch` object, which isn't great, since
  // different callers to `fetch-ponyfill` which pass a different Promise
  // implementation would each expect to have their implementation used. But,
  // given the way `node-fetch` is implemented, this is the only way to make
  // it work at all.
  if (context && context.Promise) {
    fetch.Promise = context.Promise;
  }

  return {
    fetch: wrapFetchForNode(fetch),
    Headers: fetch.Headers,
    Request: fetch.Request,
    Response: fetch.Response
  };
};

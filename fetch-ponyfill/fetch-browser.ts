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
 *
 *
 */
// tslint:disable: completed-docs

((self: any) => {
  'use strict';

  function fetchPonyfill(options: any) {
    const Promise = (options && options.Promise) || self.Promise;
    const XMLHttpRequest =
      (options && options.XMLHttpRequest) || self.XMLHttpRequest;
    const global = self;

    return (() => {
      const self = Object.create(global, {
        fetch: {
          value: undefined,
          writable: true
        }
      });

      // {{whatwgFetch}}

      return {
        fetch: self.fetch,
        Headers: self.Headers,
        Request: self.Request,
        Response: self.Response
      };
    })();
  }

  if (define! !== undefined) {
  }
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return fetchPonyfill;
    });
  } else if (typeof exports === 'object') {
    module.exports = fetchPonyfill;
  } else {
    self.fetchPonyfill = fetchPonyfill;
  }
})(
  typeof self !== 'undefined'
    ? self
    : typeof global !== 'undefined'
    ? global
    : this
);

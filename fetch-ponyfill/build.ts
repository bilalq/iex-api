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

function indent(line: any) {
  // tslint:disable-next-line: prefer-template
  return line === '' ? '' : '      ' + line;
}

import fs from 'fs';

// Get the fetch source as a string.
const whatwgFetchSource = fs.readFileSync(
  require.resolve('whatwg-fetch'),
  'utf8'
);

// Get the wrapper source as a string.
const wrapperSource = fs.readFileSync(
  require.resolve('./fetch-browser'),
  'utf8'
);

// Indent and place the fetch source inside the wrapper.
const indented = whatwgFetchSource
  .split('\n')
  .map(indent)
  .join('\n');

const builtSource = wrapperSource.replace('      // {{whatwgFetch}}', indented);

console.log(builtSource); // eslint-disable-line no-console

// const oldPackageJSON={
//   "name": "fetch-ponyfill",
//   "version": "6.0.2",
//   "description": "A ponyfill (doesn't overwrite the native fetch) for the Fetch specification https://fetch.spec.whatwg.org.",
//   "main": "fetch-node.js",
//   "browser": "build/fetch-browser.js",
//   "config": {
//     "web_port": "8088"
//   },
//   "scripts": {
//     "test": "mocha tests/fetch-node.spec.js",
//     "lint": "eslint .",
//     "pretest:browserify": "npm run build && browserify tests/fetch-browser.spec.js --outfile build/browser-test-bundle.js",
//     "test:browserify": "testem",
//     "pretest:webpack": "npm run build && webpack --mode development tests/fetch-browser.spec.js -o build/browser-test-bundle.js",
//     "test:webpack": "testem",
//     "build": "rimraf build && mkdirp build && node build.js > build/fetch-browser.js",
//     "prepublishOnly": "npm run build"
//   },
//   "author": "Mark Stanley Everitt",
//   "repository": {
//     "type": "git",
//     "url": "git://github.com/qubyte/fetch-ponyfill.git"
//   },
//   "license": "MIT",
//   "keywords": [
//     "fetch",
//     "ponyfill"
//   ],
//   "dependencies": {
//     "node-fetch": "~2.3.0"
//   },
//   "devDependencies": {
//     "browserify": "~16.2.0",
//     "eslint-config-qubyte": "~2.0.0",
//     "eslint": "~5.15.0",
//     "mkdirp": "~0.5.1",
//     "mocha": "~6.0.0",
//     "nock": "~10.0.0",
//     "promise": "~8.0.1",
//     "rimraf": "~2.6.2",
//     "sinon": "~7.2.4",
//     "testem": "2.14.0",
//     "webpack": "~4.29.1",
//     "webpack-cli": "~3.2.0",
//     "whatwg-fetch": "~2.0.3"
//   },
//   "files": [
//     "fetch-node.js",
//     "build/fetch-browser.js",
//     "index.d.ts"
//   ]
// }

// Fetch Ponyfill

// WHATWG fetch ponyfill

// This module wraps the github/fetch polyfill in a CommonJS module for browserification, and avoids
//  appending anything to the window, instead returning a setup function when fetch-ponyfill is required. Inspired by object-assign.

// When used in Node, delegates to node-fetch instead.

// Usage
// Browserify
// const {fetch, Request, Response, Headers} = require('fetch-ponyfill')(options);
// Webpack
// import fetchPonyfill from 'fetch-ponyfill';
// const {fetch, Request, Response, Headers} = fetchPonyfill(options);
// Options
// Where options is an object with the following optional properties:

// option	description
// Promise	An A+ Promise implementation. Defaults to window.Promise in the browser, and global.Promise in Node.
// XMLHttpRequest	The XMLHttpRequest constructor. This is useful to feed in when working with Firefox OS. Defaults
//  to window.XMLHttpRequest. Has no effect in Node."

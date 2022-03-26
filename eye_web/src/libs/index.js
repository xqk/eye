/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <eye.icl.site@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import _http from './http';
import _history from './history';

export * from './functools';
export * from './router';
export const http = _http;
export const history = _history;
export const VERSION = 'v3.0.5';

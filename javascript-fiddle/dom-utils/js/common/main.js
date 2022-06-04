// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

import { trmrk as trmrkInstnt } from './core.js';

import { domUtils as domUtilsInstn,
    bsDomUtils as bsDomUtilsInstn,
    vdom as vdomInstance } from './vdom.js';

import { webStorage as webStorageInstnt } from './webStorage.js';

export const trmrk = trmrkInstnt;
export const domUtils = domUtilsInstn;
export const bsDomUtils = bsDomUtilsInstn;
export const vdom = vdomInstance;
export const webStorage = webStorageInstnt;

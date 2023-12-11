var trmrk;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   absUriRegex: () => (/* binding */ absUriRegex),
/* harmony export */   getNewUri: () => (/* binding */ getNewUri),
/* harmony export */   getRelUri: () => (/* binding */ getRelUri)
/* harmony export */ });
/* harmony import */ var trmrk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! trmrk */ "../trmrk/index.ts");

const absUriRegex = /^[\w\-_]+\:\/\/([\w\-_]+\.?)+(\:[0-9]+)?(\/[\w\-\?\.\+_&=#,]*)*$/g;
const getNewUri = (query, hash, path, host, preserveQueryDelim) => {
    const queryStr = query?.toString();
    const partsArr = [host, path].filter((part) => trmrk__WEBPACK_IMPORTED_MODULE_0__.core.isNonEmptyStr(part, true));
    let newUri = partsArr.join("/");
    if (preserveQueryDelim || trmrk__WEBPACK_IMPORTED_MODULE_0__.core.isNonEmptyStr(queryStr, true)) {
        newUri = [newUri, queryStr].join("?");
    }
    if (trmrk__WEBPACK_IMPORTED_MODULE_0__.core.isNonEmptyStr(hash)) {
        newUri += hash;
    }
    return newUri;
};
const getRelUri = (queryParams, queryParamsTransformer, hashTransformer, pathTransformer, preserveQueryDelim) => {
    queryParamsTransformer(queryParams);
    hashTransformer ??= (hash) => hash;
    pathTransformer ??= (path) => {
        if (typeof path === "string") {
            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            if (path.endsWith("/")) {
                path = path.substring(0, path.length - 1);
            }
        }
        return path;
    };
    const hash = hashTransformer(location.hash);
    const path = pathTransformer(location.pathname);
    const newUri = getNewUri(queryParams, hash, path, null, preserveQueryDelim);
    return newUri;
};


/***/ }),

/***/ "./src/indexedDB/core.ts":
/*!*******************************!*\
  !*** ./src/indexedDB/core.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TrmrkIdxedDB: () => (/* binding */ TrmrkIdxedDB),
/* harmony export */   createDBStore: () => (/* binding */ createDBStore),
/* harmony export */   getOrCreateDbStore: () => (/* binding */ getOrCreateDbStore)
/* harmony export */ });
class TrmrkIdxedDB {
    _dbReq = null;
    _db = null;
    dbName;
    version;
    onerror;
    onupgradeneeded;
    onblocked;
    onsuccess;
    init(opts) {
        this.dbName = opts.dbName;
        this.version = opts.dbVersion;
        this.onerror = opts.onIdxedDBerror;
        this.onupgradeneeded = opts.onIdxedDBupgradeneeded;
        this.onblocked = opts.onIdxedDBblocked;
        this.onsuccess = opts.onIdxedDBSuccess;
    }
    getDb() {
        return new Promise((resolve, reject) => {
            const db = this._db;
            if (db) {
                resolve(db);
            }
            else {
                let dbReq = this._dbReq;
                if (!dbReq) {
                }
                else {
                    dbReq = indexedDB.open(this.dbName, this.version);
                    this._dbReq = dbReq;
                    dbReq.onsuccess = (ev) => {
                        const db = ev.target.result;
                        this._db = db;
                        this._dbReq = null;
                        this.onsuccess?.call(this, ev, db);
                        resolve(db);
                    };
                    dbReq.onerror = (ev) => {
                        this._dbReq = null;
                        this.onerror?.call(this, ev);
                        reject(ev);
                    };
                    dbReq.onupgradeneeded = (ev) => {
                        this._dbReq = null;
                        this.onupgradeneeded?.call(this, ev);
                        reject(ev);
                    };
                    dbReq.onblocked = (ev) => {
                        this._dbReq = null;
                        this.onblocked?.call(this, ev);
                        reject(ev);
                    };
                }
            }
        });
    }
    async withDb(action) {
        let resp;
        try {
            var db = await this.getDb();
            resp = action(db);
        }
        catch (err) {
            resp = {
                cacheError: err,
            };
        }
        return resp;
    }
}
const createDBStore = (db, objStName, keyPath, opts) => {
    const objSt = db.createObjectStore(objStName, {
        keyPath: keyPath,
    });
    for (let idx of opts.idxesArr) {
        const paramOpts = idx.dbOpts ?? {};
        paramOpts.unique ??= idx.unique ?? false;
        objSt.createIndex(idx.name, idx.keyPath, paramOpts);
    }
    return objSt;
};
const getOrCreateDbStore = (db, objStNamesArr, objStName, keyPath, opts) => {
    if (!(objStName in objStNamesArr)) {
        createDBStore(db, objStName, keyPath, opts);
    }
};


/***/ }),

/***/ "./src/indexedDB/index.ts":
/*!********************************!*\
  !*** ./src/indexedDB/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   indexedDB: () => (/* binding */ indexedDB)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/indexedDB/core.ts");

const indexedDB = {
    ..._core__WEBPACK_IMPORTED_MODULE_0__,
};


/***/ }),

/***/ "../trmrk/index.ts":
/*!*************************!*\
  !*** ../trmrk/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   core: () => (/* binding */ core)
/* harmony export */ });
/* harmony import */ var _src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/core */ "../trmrk/src/core.ts");

const core = {
    ..._src_core__WEBPACK_IMPORTED_MODULE_0__,
};


/***/ }),

/***/ "../trmrk/src/core.ts":
/*!****************************!*\
  !*** ../trmrk/src/core.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allWsRegex: () => (/* binding */ allWsRegex),
/* harmony export */   any: () => (/* binding */ any),
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   isNonEmptyStr: () => (/* binding */ isNonEmptyStr)
/* harmony export */ });
const allWsRegex = /^\s+$/g;
const isNonEmptyStr = (arg, allWsSameAsEmpty = false) => {
    let retVal = "string" === typeof arg;
    retVal = retVal && arg !== "";
    if (retVal && allWsSameAsEmpty) {
        retVal = !allWsRegex.test(arg);
    }
    return retVal;
};
const forEach = (arr, callback) => {
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr) === false) {
            break;
        }
    }
};
const contains = (arr, item) => arr.indexOf(item) >= 0;
const any = (arr, predicate) => arr.filter(predicate).length >= 0;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   browser: () => (/* binding */ browser)
/* harmony export */ });
/* harmony import */ var _src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/core */ "./src/core.ts");
/* harmony import */ var _src_indexedDB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/indexedDB */ "./src/indexedDB/index.ts");


const browser = {
    ..._src_core__WEBPACK_IMPORTED_MODULE_0__,
    indexedDB: _src_indexedDB__WEBPACK_IMPORTED_MODULE_1__.indexedDB,
};

})();

trmrk = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7OztBQ05tQztBQUVRO0FBRXBDLE1BQU0sT0FBTyxHQUFHO0lBQ3JCLEdBQUcsc0NBQUk7SUFDUCxTQUFTLEVBQUUscURBQWlCO0NBQzdCLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cm1yay8uL3NyYy9jb3JlLnRzIiwid2VicGFjazovL3RybXJrLy4vc3JjL2luZGV4ZWREQi9jb3JlLnRzIiwid2VicGFjazovL3RybXJrLy4vc3JjL2luZGV4ZWREQi9pbmRleC50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9pbmRleC50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RybXJrLy4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29yZSBhcyB0cm1yayB9IGZyb20gXCJ0cm1ya1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFic1VyaVJlZ2V4ID1cclxuICAvXltcXHdcXC1fXStcXDpcXC9cXC8oW1xcd1xcLV9dK1xcLj8pKyhcXDpbMC05XSspPyhcXC9bXFx3XFwtXFw/XFwuXFwrXyY9IyxdKikqJC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldE5ld1VyaSA9IChcclxuICBxdWVyeT86IFVSTFNlYXJjaFBhcmFtcyB8IG51bGwgfCB1bmRlZmluZWQsXHJcbiAgaGFzaD86IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXHJcbiAgcGF0aD86IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXHJcbiAgaG9zdD86IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXHJcbiAgcHJlc2VydmVRdWVyeURlbGltPzogYm9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWRcclxuKSA9PiB7XHJcbiAgY29uc3QgcXVlcnlTdHIgPSBxdWVyeT8udG9TdHJpbmcoKTtcclxuXHJcbiAgY29uc3QgcGFydHNBcnIgPSBbaG9zdCwgcGF0aF0uZmlsdGVyKChwYXJ0KSA9PlxyXG4gICAgdHJtcmsuaXNOb25FbXB0eVN0cihwYXJ0LCB0cnVlKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXdVcmkgPSBwYXJ0c0Fyci5qb2luKFwiL1wiKTtcclxuXHJcbiAgaWYgKHByZXNlcnZlUXVlcnlEZWxpbSB8fCB0cm1yay5pc05vbkVtcHR5U3RyKHF1ZXJ5U3RyLCB0cnVlKSkge1xyXG4gICAgbmV3VXJpID0gW25ld1VyaSwgcXVlcnlTdHJdLmpvaW4oXCI/XCIpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHRybXJrLmlzTm9uRW1wdHlTdHIoaGFzaCkpIHtcclxuICAgIG5ld1VyaSArPSBoYXNoO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ld1VyaTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSZWxVcmkgPSAoXHJcbiAgcXVlcnlQYXJhbXM6IFVSTFNlYXJjaFBhcmFtcyxcclxuICBxdWVyeVBhcmFtc1RyYW5zZm9ybWVyOiAocXVlcnk6IFVSTFNlYXJjaFBhcmFtcykgPT4gdm9pZCxcclxuICBoYXNoVHJhbnNmb3JtZXI/OlxyXG4gICAgfCAoKGhhc2g/OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKSA9PiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKVxyXG4gICAgfCBudWxsXHJcbiAgICB8IHVuZGVmaW5lZCxcclxuICBwYXRoVHJhbnNmb3JtZXI/OlxyXG4gICAgfCAoKGhhc2g/OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKSA9PiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKVxyXG4gICAgfCBudWxsXHJcbiAgICB8IHVuZGVmaW5lZCxcclxuICBwcmVzZXJ2ZVF1ZXJ5RGVsaW0/OiBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZFxyXG4pID0+IHtcclxuICBxdWVyeVBhcmFtc1RyYW5zZm9ybWVyKHF1ZXJ5UGFyYW1zKTtcclxuICBoYXNoVHJhbnNmb3JtZXIgPz89IChoYXNoKSA9PiBoYXNoO1xyXG5cclxuICBwYXRoVHJhbnNmb3JtZXIgPz89IChwYXRoKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgaWYgKHBhdGguc3RhcnRzV2l0aChcIi9cIikpIHtcclxuICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXRoLmVuZHNXaXRoKFwiL1wiKSkge1xyXG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cmluZygwLCBwYXRoLmxlbmd0aCAtIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhdGg7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFzaCA9IGhhc2hUcmFuc2Zvcm1lcihsb2NhdGlvbi5oYXNoKTtcclxuICBjb25zdCBwYXRoID0gcGF0aFRyYW5zZm9ybWVyKGxvY2F0aW9uLnBhdGhuYW1lKTtcclxuXHJcbiAgY29uc3QgbmV3VXJpID0gZ2V0TmV3VXJpKHF1ZXJ5UGFyYW1zLCBoYXNoLCBwYXRoLCBudWxsLCBwcmVzZXJ2ZVF1ZXJ5RGVsaW0pO1xyXG4gIHJldHVybiBuZXdVcmk7XHJcbn07XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgVHJtcmtEQlN0b3JlT2JqSWR4T3B0cyB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGtleVBhdGg6IHN0cmluZyB8IHN0cmluZ1tdO1xyXG4gIHVuaXF1ZT86IGJvb2xlYW47XHJcbiAgZGJPcHRzPzogSURCSW5kZXhQYXJhbWV0ZXJzO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRybXJrREJTdG9yZU9iak9wdHMge1xyXG4gIGlkeGVzQXJyOiBUcm1ya0RCU3RvcmVPYmpJZHhPcHRzW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJtcmtEQlJlc3A8VD4ge1xyXG4gIGRhdGE6IFQ7XHJcbiAgY2FjaGVNYXRjaDogYm9vbGVhbjtcclxuICBjYWNoZUVycm9yOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSWR4ZWREQkluaXRPcHRzIHtcclxuICBkYk5hbWU6IHN0cmluZztcclxuICBkYlZlcnNpb24/OiBudW1iZXI7XHJcbiAgb25JZHhlZERCU3VjY2Vzcz86ICgoZXY6IEV2ZW50LCBkYjogSURCRGF0YWJhc2UpID0+IGFueSkgfCB1bmRlZmluZWQ7XHJcbiAgb25JZHhlZERCZXJyb3I/OiAoKGV2OiBFdmVudCkgPT4gYW55KSB8IHVuZGVmaW5lZDtcclxuICBvbklkeGVkREJ1cGdyYWRlbmVlZGVkPzogKChldjogSURCVmVyc2lvbkNoYW5nZUV2ZW50KSA9PiBhbnkpIHwgdW5kZWZpbmVkO1xyXG4gIG9uSWR4ZWREQmJsb2NrZWQ/OiAoKGV2OiBJREJWZXJzaW9uQ2hhbmdlRXZlbnQpID0+IGFueSkgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcm1ya0lkeGVkREIge1xyXG4gIHByaXZhdGUgX2RiUmVxOiBJREJPcGVuREJSZXF1ZXN0IHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBfZGI6IElEQkRhdGFiYXNlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIGRiTmFtZSE6IHN0cmluZztcclxuICB2ZXJzaW9uPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gIG9uZXJyb3I/OiAoKGV2OiBFdmVudCkgPT4gYW55KSB8IHVuZGVmaW5lZDtcclxuICBvbnVwZ3JhZGVuZWVkZWQ/OiAoKGV2OiBJREJWZXJzaW9uQ2hhbmdlRXZlbnQpID0+IGFueSkgfCB1bmRlZmluZWQ7XHJcbiAgb25ibG9ja2VkPzogKChldjogSURCVmVyc2lvbkNoYW5nZUV2ZW50KSA9PiBhbnkpIHwgdW5kZWZpbmVkO1xyXG4gIG9uc3VjY2Vzcz86ICgoZXY6IEV2ZW50LCBkYjogSURCRGF0YWJhc2UpID0+IGFueSkgfCB1bmRlZmluZWQ7XHJcblxyXG4gIGluaXQob3B0czogSWR4ZWREQkluaXRPcHRzKSB7XHJcbiAgICB0aGlzLmRiTmFtZSA9IG9wdHMuZGJOYW1lO1xyXG4gICAgdGhpcy52ZXJzaW9uID0gb3B0cy5kYlZlcnNpb247XHJcbiAgICB0aGlzLm9uZXJyb3IgPSBvcHRzLm9uSWR4ZWREQmVycm9yO1xyXG4gICAgdGhpcy5vbnVwZ3JhZGVuZWVkZWQgPSBvcHRzLm9uSWR4ZWREQnVwZ3JhZGVuZWVkZWQ7XHJcbiAgICB0aGlzLm9uYmxvY2tlZCA9IG9wdHMub25JZHhlZERCYmxvY2tlZDtcclxuICAgIHRoaXMub25zdWNjZXNzID0gb3B0cy5vbklkeGVkREJTdWNjZXNzO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGIoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8SURCRGF0YWJhc2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYjtcclxuXHJcbiAgICAgIGlmIChkYikge1xyXG4gICAgICAgIHJlc29sdmUoZGIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBkYlJlcSA9IHRoaXMuX2RiUmVxO1xyXG5cclxuICAgICAgICBpZiAoIWRiUmVxKSB7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRiUmVxID0gaW5kZXhlZERCLm9wZW4odGhpcy5kYk5hbWUsIHRoaXMudmVyc2lvbik7XHJcbiAgICAgICAgICB0aGlzLl9kYlJlcSA9IGRiUmVxO1xyXG5cclxuICAgICAgICAgIGRiUmVxLm9uc3VjY2VzcyA9IChldjogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGIgPSAoZXYudGFyZ2V0IGFzIGFueSkucmVzdWx0IGFzIElEQkRhdGFiYXNlO1xyXG4gICAgICAgICAgICB0aGlzLl9kYiA9IGRiO1xyXG4gICAgICAgICAgICB0aGlzLl9kYlJlcSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMub25zdWNjZXNzPy5jYWxsKHRoaXMsIGV2LCBkYik7XHJcbiAgICAgICAgICAgIHJlc29sdmUoZGIpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBkYlJlcS5vbmVycm9yID0gKGV2OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYlJlcSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMub25lcnJvcj8uY2FsbCh0aGlzLCBldik7XHJcbiAgICAgICAgICAgIHJlamVjdChldik7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGRiUmVxLm9udXBncmFkZW5lZWRlZCA9IChldjogSURCVmVyc2lvbkNoYW5nZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiUmVxID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5vbnVwZ3JhZGVuZWVkZWQ/LmNhbGwodGhpcywgZXYpO1xyXG4gICAgICAgICAgICByZWplY3QoZXYpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBkYlJlcS5vbmJsb2NrZWQgPSAoZXY6IElEQlZlcnNpb25DaGFuZ2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kYlJlcSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMub25ibG9ja2VkPy5jYWxsKHRoaXMsIGV2KTtcclxuICAgICAgICAgICAgcmVqZWN0KGV2KTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHdpdGhEYjxUPihhY3Rpb246IChkYjogSURCRGF0YWJhc2UpID0+IFRybXJrREJSZXNwPFQ+KSB7XHJcbiAgICBsZXQgcmVzcDogVHJtcmtEQlJlc3A8VD47XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIGRiID0gYXdhaXQgdGhpcy5nZXREYigpO1xyXG4gICAgICByZXNwID0gYWN0aW9uKGRiKTtcclxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgIHJlc3AgPSB7XHJcbiAgICAgICAgY2FjaGVFcnJvcjogZXJyLFxyXG4gICAgICB9IGFzIFRybXJrREJSZXNwPFQ+O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXNwO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgVHJtcmtJZHhlZERCVHlwZSA9IFRybXJrSWR4ZWREQjtcclxuZXhwb3J0IHR5cGUgVHJtcmtEQlJlc3BUeXBlPFQ+ID0gVHJtcmtEQlJlc3A8VD47XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlREJTdG9yZSA9IChcclxuICBkYjogSURCRGF0YWJhc2UsXHJcbiAgb2JqU3ROYW1lOiBzdHJpbmcsXHJcbiAga2V5UGF0aDogc3RyaW5nLFxyXG4gIG9wdHM6IFRybXJrREJTdG9yZU9iak9wdHNcclxuKSA9PiB7XHJcbiAgY29uc3Qgb2JqU3QgPSBkYi5jcmVhdGVPYmplY3RTdG9yZShvYmpTdE5hbWUsIHtcclxuICAgIGtleVBhdGg6IGtleVBhdGgsXHJcbiAgfSk7XHJcblxyXG4gIGZvciAobGV0IGlkeCBvZiBvcHRzLmlkeGVzQXJyKSB7XHJcbiAgICBjb25zdCBwYXJhbU9wdHMgPSBpZHguZGJPcHRzID8/IHt9O1xyXG4gICAgcGFyYW1PcHRzLnVuaXF1ZSA/Pz0gaWR4LnVuaXF1ZSA/PyBmYWxzZTtcclxuXHJcbiAgICBvYmpTdC5jcmVhdGVJbmRleChpZHgubmFtZSwgaWR4LmtleVBhdGgsIHBhcmFtT3B0cyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2JqU3Q7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0T3JDcmVhdGVEYlN0b3JlID0gKFxyXG4gIGRiOiBJREJEYXRhYmFzZSxcclxuICBvYmpTdE5hbWVzQXJyOiBET01TdHJpbmdMaXN0LFxyXG4gIG9ialN0TmFtZTogc3RyaW5nLFxyXG4gIGtleVBhdGg6IHN0cmluZyxcclxuICBvcHRzOiBUcm1ya0RCU3RvcmVPYmpPcHRzXHJcbikgPT4ge1xyXG4gIGlmICghKG9ialN0TmFtZSBpbiBvYmpTdE5hbWVzQXJyKSkge1xyXG4gICAgY3JlYXRlREJTdG9yZShkYiwgb2JqU3ROYW1lLCBrZXlQYXRoLCBvcHRzKTtcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluZGV4ZWREQiA9IHtcclxuICAuLi5jb3JlLFxyXG59O1xyXG5leHBvcnQgdHlwZSBUcm1ya0lkeGVkREJUeXBlID0gY29yZS5Ucm1ya0lkeGVkREJUeXBlO1xyXG5leHBvcnQgdHlwZSBUcm1ya0RCUmVzcFR5cGU8VD4gPSBjb3JlLlRybXJrREJSZXNwVHlwZTxUPjtcclxuZXhwb3J0IHR5cGUgSWR4ZWREQkluaXRPcHRzID0gY29yZS5JZHhlZERCSW5pdE9wdHM7XHJcbiIsImltcG9ydCAqIGFzIGNvcmVPYmogZnJvbSBcIi4vc3JjL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBjb3JlID0ge1xyXG4gIC4uLmNvcmVPYmosXHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBhbGxXc1JlZ2V4ID0gL15cXHMrJC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzTm9uRW1wdHlTdHIgPSAoYXJnOiBzdHJpbmcgfCBhbnksIGFsbFdzU2FtZUFzRW1wdHkgPSBmYWxzZSkgPT4ge1xyXG4gIGxldCByZXRWYWwgPSBcInN0cmluZ1wiID09PSB0eXBlb2YgYXJnO1xyXG4gIHJldFZhbCA9IHJldFZhbCAmJiBhcmcgIT09IFwiXCI7XHJcblxyXG4gIGlmIChyZXRWYWwgJiYgYWxsV3NTYW1lQXNFbXB0eSkge1xyXG4gICAgcmV0VmFsID0gIWFsbFdzUmVnZXgudGVzdChhcmcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJldFZhbDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBmb3JFYWNoID0gPFQ+KFxyXG4gIGFycjogVFtdLFxyXG4gIGNhbGxiYWNrOiAoaXRlbTogVCwgaWR4OiBudW1iZXIsIGFycjogVFtdKSA9PiBib29sZWFuIHwgdm9pZFxyXG4pID0+IHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGNhbGxiYWNrKGFycltpXSwgaSwgYXJyKSA9PT0gZmFsc2UpIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbnRhaW5zID0gPFQ+KGFycjogVFtdLCBpdGVtOiBUKSA9PiBhcnIuaW5kZXhPZihpdGVtKSA+PSAwO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFueSA9IDxUPihcclxuICBhcnI6IFRbXSxcclxuICBwcmVkaWNhdGU6IChpdGVtOiBULCBpZHg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gYm9vbGVhblxyXG4pID0+IGFyci5maWx0ZXIocHJlZGljYXRlKS5sZW5ndGggPj0gMDtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuL3NyYy9jb3JlXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBpZHhlZERCIGZyb20gXCIuL3NyYy9pbmRleGVkREJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBicm93c2VyID0ge1xyXG4gIC4uLmNvcmUsXHJcbiAgaW5kZXhlZERCOiBpZHhlZERCLmluZGV4ZWREQixcclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIFRybXJrSWR4ZWREQlR5cGUgPSBpZHhlZERCLlRybXJrSWR4ZWREQlR5cGU7XHJcbmV4cG9ydCB0eXBlIFRybXJrREJSZXNwPFQ+ID0gaWR4ZWREQi5Ucm1ya0RCUmVzcFR5cGU8VD47XHJcbmV4cG9ydCB0eXBlIElkeGVkREJJbml0T3B0cyA9IGlkeGVkREIuSWR4ZWREQkluaXRPcHRzO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
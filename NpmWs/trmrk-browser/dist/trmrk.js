var trmrk;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../trmrk-browser-core/index.ts":
/*!**************************************!*\
  !*** ../trmrk-browser-core/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   browser: () => (/* binding */ browser)
/* harmony export */ });
/* harmony import */ var _src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/core */ "../trmrk-browser-core/src/core.ts");
/* harmony import */ var _src_indexedDB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/indexedDB */ "../trmrk-browser-core/src/indexedDB/index.ts");


const browser = {
    ..._src_core__WEBPACK_IMPORTED_MODULE_0__,
    indexedDB: _src_indexedDB__WEBPACK_IMPORTED_MODULE_1__.indexedDB,
};


/***/ }),

/***/ "../trmrk-browser-core/src/core.ts":
/*!*****************************************!*\
  !*** ../trmrk-browser-core/src/core.ts ***!
  \*****************************************/
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

/***/ "../trmrk-browser-core/src/indexedDB/core.ts":
/*!***************************************************!*\
  !*** ../trmrk-browser-core/src/indexedDB/core.ts ***!
  \***************************************************/
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

/***/ "../trmrk-browser-core/src/indexedDB/index.ts":
/*!****************************************************!*\
  !*** ../trmrk-browser-core/src/indexedDB/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   indexedDB: () => (/* binding */ indexedDB)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "../trmrk-browser-core/src/indexedDB/core.ts");

const indexedDB = {
    ..._core__WEBPACK_IMPORTED_MODULE_0__,
};


/***/ }),

/***/ "./src/axiosIdxedDB/core.ts":
/*!**********************************!*\
  !*** ./src/axiosIdxedDB/core.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AxiosIdxedDB: () => (/* binding */ AxiosIdxedDB)
/* harmony export */ });
class AxiosIdxedDB {
    apiSvc;
    idxedDB;
    constructor(apiSvc, idxedDB) {
        this.apiSvc = apiSvc;
        this.idxedDB = idxedDB;
    }
    init(opts) {
        this.apiSvc.init(opts.data, opts.defaultConfigFactory);
        return this.idxedDB.init(opts);
    }
    async req(opts) {
        let resp = (await this.idxedDB.withDb(opts.idxedDBGet));
        if (!(resp.cacheMatch || resp.cacheError)) {
            resp = (await opts.apiCall(this.apiSvc));
            if (resp.isSuccessStatus) {
                await this.idxedDB.withDb((db) => {
                    const setResp = opts.idxedDBSet(db, resp.data);
                    resp.cacheError = setResp.cacheError;
                    return setResp;
                });
            }
        }
        return resp;
    }
}


/***/ }),

/***/ "./src/axiosIdxedDB/index.ts":
/*!***********************************!*\
  !*** ./src/axiosIdxedDB/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   axiosIdxedDB: () => (/* binding */ axiosIdxedDB)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/axiosIdxedDB/core.ts");

const axiosIdxedDB = {
    ..._core__WEBPACK_IMPORTED_MODULE_0__,
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   axiosIdxedDB: () => (/* reexport safe */ _axiosIdxedDB__WEBPACK_IMPORTED_MODULE_0__.axiosIdxedDB)
/* harmony export */ });
/* harmony import */ var _axiosIdxedDB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./axiosIdxedDB */ "./src/axiosIdxedDB/index.ts");



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
/* harmony import */ var trmrk_browser_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! trmrk-browser-core */ "../trmrk-browser-core/index.ts");
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src */ "./src/index.ts");


const browser = {
    axiosIdxedDB: _src__WEBPACK_IMPORTED_MODULE_1__.axiosIdxedDB,
};

})();

trmrk = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7Ozs7Ozs7VUM3QnZDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTm1DO0FBSUU7QUFFOUIsTUFBTSxPQUFPLEdBQUc7SUFDckIsWUFBWTtDQUNiLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay1icm93c2VyLWNvcmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi4vdHJtcmstYnJvd3Nlci1jb3JlL3NyYy9jb3JlLnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrLWJyb3dzZXItY29yZS9zcmMvaW5kZXhlZERCL2NvcmUudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi4vdHJtcmstYnJvd3Nlci1jb3JlL3NyYy9pbmRleGVkREIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi9zcmMvYXhpb3NJZHhlZERCL2NvcmUudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi9zcmMvYXhpb3NJZHhlZERCL2luZGV4LnRzIiwid2VicGFjazovL3RybXJrLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrL2luZGV4LnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrL3NyYy9jb3JlLnRzIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdHJtcmsvLi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuL3NyYy9jb3JlXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBpZHhlZERCIGZyb20gXCIuL3NyYy9pbmRleGVkREJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBicm93c2VyID0ge1xyXG4gIC4uLmNvcmUsXHJcbiAgaW5kZXhlZERCOiBpZHhlZERCLmluZGV4ZWREQixcclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIFRybXJrSWR4ZWREQlR5cGUgPSBpZHhlZERCLlRybXJrSWR4ZWREQlR5cGU7XHJcbmV4cG9ydCB0eXBlIFRybXJrREJSZXNwPFQ+ID0gaWR4ZWREQi5Ucm1ya0RCUmVzcFR5cGU8VD47XHJcbmV4cG9ydCB0eXBlIElkeGVkREJJbml0T3B0cyA9IGlkeGVkREIuSWR4ZWREQkluaXRPcHRzO1xyXG4iLCJpbXBvcnQgeyBjb3JlIGFzIHRybXJrIH0gZnJvbSBcInRybXJrXCI7XHJcblxyXG5leHBvcnQgY29uc3QgYWJzVXJpUmVnZXggPVxyXG4gIC9eW1xcd1xcLV9dK1xcOlxcL1xcLyhbXFx3XFwtX10rXFwuPykrKFxcOlswLTldKyk/KFxcL1tcXHdcXC1cXD9cXC5cXCtfJj0jLF0qKSokL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3VXJpID0gKFxyXG4gIHF1ZXJ5PzogVVJMU2VhcmNoUGFyYW1zIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICBoYXNoPzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICBwYXRoPzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICBob3N0Pzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICBwcmVzZXJ2ZVF1ZXJ5RGVsaW0/OiBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZFxyXG4pID0+IHtcclxuICBjb25zdCBxdWVyeVN0ciA9IHF1ZXJ5Py50b1N0cmluZygpO1xyXG5cclxuICBjb25zdCBwYXJ0c0FyciA9IFtob3N0LCBwYXRoXS5maWx0ZXIoKHBhcnQpID0+XHJcbiAgICB0cm1yay5pc05vbkVtcHR5U3RyKHBhcnQsIHRydWUpXHJcbiAgKTtcclxuXHJcbiAgbGV0IG5ld1VyaSA9IHBhcnRzQXJyLmpvaW4oXCIvXCIpO1xyXG5cclxuICBpZiAocHJlc2VydmVRdWVyeURlbGltIHx8IHRybXJrLmlzTm9uRW1wdHlTdHIocXVlcnlTdHIsIHRydWUpKSB7XHJcbiAgICBuZXdVcmkgPSBbbmV3VXJpLCBxdWVyeVN0cl0uam9pbihcIj9cIik7XHJcbiAgfVxyXG5cclxuICBpZiAodHJtcmsuaXNOb25FbXB0eVN0cihoYXNoKSkge1xyXG4gICAgbmV3VXJpICs9IGhhc2g7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3VXJpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlbFVyaSA9IChcclxuICBxdWVyeVBhcmFtczogVVJMU2VhcmNoUGFyYW1zLFxyXG4gIHF1ZXJ5UGFyYW1zVHJhbnNmb3JtZXI6IChxdWVyeTogVVJMU2VhcmNoUGFyYW1zKSA9PiB2b2lkLFxyXG4gIGhhc2hUcmFuc2Zvcm1lcj86XHJcbiAgICB8ICgoaGFzaD86IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpID0+IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpXHJcbiAgICB8IG51bGxcclxuICAgIHwgdW5kZWZpbmVkLFxyXG4gIHBhdGhUcmFuc2Zvcm1lcj86XHJcbiAgICB8ICgoaGFzaD86IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpID0+IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpXHJcbiAgICB8IG51bGxcclxuICAgIHwgdW5kZWZpbmVkLFxyXG4gIHByZXNlcnZlUXVlcnlEZWxpbT86IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkXHJcbikgPT4ge1xyXG4gIHF1ZXJ5UGFyYW1zVHJhbnNmb3JtZXIocXVlcnlQYXJhbXMpO1xyXG4gIGhhc2hUcmFuc2Zvcm1lciA/Pz0gKGhhc2gpID0+IGhhc2g7XHJcblxyXG4gIHBhdGhUcmFuc2Zvcm1lciA/Pz0gKHBhdGgpID0+IHtcclxuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBpZiAocGF0aC5zdGFydHNXaXRoKFwiL1wiKSkge1xyXG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cmluZygxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhdGguZW5kc1dpdGgoXCIvXCIpKSB7XHJcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDAsIHBhdGgubGVuZ3RoIC0gMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYXNoID0gaGFzaFRyYW5zZm9ybWVyKGxvY2F0aW9uLmhhc2gpO1xyXG4gIGNvbnN0IHBhdGggPSBwYXRoVHJhbnNmb3JtZXIobG9jYXRpb24ucGF0aG5hbWUpO1xyXG5cclxuICBjb25zdCBuZXdVcmkgPSBnZXROZXdVcmkocXVlcnlQYXJhbXMsIGhhc2gsIHBhdGgsIG51bGwsIHByZXNlcnZlUXVlcnlEZWxpbSk7XHJcbiAgcmV0dXJuIG5ld1VyaTtcclxufTtcclxuIiwiZXhwb3J0IGludGVyZmFjZSBUcm1ya0RCU3RvcmVPYmpJZHhPcHRzIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAga2V5UGF0aDogc3RyaW5nIHwgc3RyaW5nW107XHJcbiAgdW5pcXVlPzogYm9vbGVhbjtcclxuICBkYk9wdHM/OiBJREJJbmRleFBhcmFtZXRlcnM7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJtcmtEQlN0b3JlT2JqT3B0cyB7XHJcbiAgaWR4ZXNBcnI6IFRybXJrREJTdG9yZU9iaklkeE9wdHNbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUcm1ya0RCUmVzcDxUPiB7XHJcbiAgZGF0YTogVDtcclxuICBjYWNoZU1hdGNoOiBib29sZWFuO1xyXG4gIGNhY2hlRXJyb3I6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJZHhlZERCSW5pdE9wdHMge1xyXG4gIGRiTmFtZTogc3RyaW5nO1xyXG4gIGRiVmVyc2lvbj86IG51bWJlcjtcclxuICBvbklkeGVkREJTdWNjZXNzPzogKChldjogRXZlbnQsIGRiOiBJREJEYXRhYmFzZSkgPT4gYW55KSB8IHVuZGVmaW5lZDtcclxuICBvbklkeGVkREJlcnJvcj86ICgoZXY6IEV2ZW50KSA9PiBhbnkpIHwgdW5kZWZpbmVkO1xyXG4gIG9uSWR4ZWREQnVwZ3JhZGVuZWVkZWQ/OiAoKGV2OiBJREJWZXJzaW9uQ2hhbmdlRXZlbnQpID0+IGFueSkgfCB1bmRlZmluZWQ7XHJcbiAgb25JZHhlZERCYmxvY2tlZD86ICgoZXY6IElEQlZlcnNpb25DaGFuZ2VFdmVudCkgPT4gYW55KSB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRybXJrSWR4ZWREQiB7XHJcbiAgcHJpdmF0ZSBfZGJSZXE6IElEQk9wZW5EQlJlcXVlc3QgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIF9kYjogSURCRGF0YWJhc2UgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgZGJOYW1lITogc3RyaW5nO1xyXG4gIHZlcnNpb24/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgb25lcnJvcj86ICgoZXY6IEV2ZW50KSA9PiBhbnkpIHwgdW5kZWZpbmVkO1xyXG4gIG9udXBncmFkZW5lZWRlZD86ICgoZXY6IElEQlZlcnNpb25DaGFuZ2VFdmVudCkgPT4gYW55KSB8IHVuZGVmaW5lZDtcclxuICBvbmJsb2NrZWQ/OiAoKGV2OiBJREJWZXJzaW9uQ2hhbmdlRXZlbnQpID0+IGFueSkgfCB1bmRlZmluZWQ7XHJcbiAgb25zdWNjZXNzPzogKChldjogRXZlbnQsIGRiOiBJREJEYXRhYmFzZSkgPT4gYW55KSB8IHVuZGVmaW5lZDtcclxuXHJcbiAgaW5pdChvcHRzOiBJZHhlZERCSW5pdE9wdHMpIHtcclxuICAgIHRoaXMuZGJOYW1lID0gb3B0cy5kYk5hbWU7XHJcbiAgICB0aGlzLnZlcnNpb24gPSBvcHRzLmRiVmVyc2lvbjtcclxuICAgIHRoaXMub25lcnJvciA9IG9wdHMub25JZHhlZERCZXJyb3I7XHJcbiAgICB0aGlzLm9udXBncmFkZW5lZWRlZCA9IG9wdHMub25JZHhlZERCdXBncmFkZW5lZWRlZDtcclxuICAgIHRoaXMub25ibG9ja2VkID0gb3B0cy5vbklkeGVkREJibG9ja2VkO1xyXG4gICAgdGhpcy5vbnN1Y2Nlc3MgPSBvcHRzLm9uSWR4ZWREQlN1Y2Nlc3M7XHJcbiAgfVxyXG5cclxuICBnZXREYigpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxJREJEYXRhYmFzZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBkYiA9IHRoaXMuX2RiO1xyXG5cclxuICAgICAgaWYgKGRiKSB7XHJcbiAgICAgICAgcmVzb2x2ZShkYik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGRiUmVxID0gdGhpcy5fZGJSZXE7XHJcblxyXG4gICAgICAgIGlmICghZGJSZXEpIHtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGJSZXEgPSBpbmRleGVkREIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy52ZXJzaW9uKTtcclxuICAgICAgICAgIHRoaXMuX2RiUmVxID0gZGJSZXE7XHJcblxyXG4gICAgICAgICAgZGJSZXEub25zdWNjZXNzID0gKGV2OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkYiA9IChldi50YXJnZXQgYXMgYW55KS5yZXN1bHQgYXMgSURCRGF0YWJhc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiID0gZGI7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiUmVxID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5vbnN1Y2Nlc3M/LmNhbGwodGhpcywgZXYsIGRiKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShkYik7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGRiUmVxLm9uZXJyb3IgPSAoZXY6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiUmVxID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5vbmVycm9yPy5jYWxsKHRoaXMsIGV2KTtcclxuICAgICAgICAgICAgcmVqZWN0KGV2KTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgZGJSZXEub251cGdyYWRlbmVlZGVkID0gKGV2OiBJREJWZXJzaW9uQ2hhbmdlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGJSZXEgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm9udXBncmFkZW5lZWRlZD8uY2FsbCh0aGlzLCBldik7XHJcbiAgICAgICAgICAgIHJlamVjdChldik7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGRiUmVxLm9uYmxvY2tlZCA9IChldjogSURCVmVyc2lvbkNoYW5nZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RiUmVxID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5vbmJsb2NrZWQ/LmNhbGwodGhpcywgZXYpO1xyXG4gICAgICAgICAgICByZWplY3QoZXYpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgd2l0aERiPFQ+KGFjdGlvbjogKGRiOiBJREJEYXRhYmFzZSkgPT4gVHJtcmtEQlJlc3A8VD4pIHtcclxuICAgIGxldCByZXNwOiBUcm1ya0RCUmVzcDxUPjtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB2YXIgZGIgPSBhd2FpdCB0aGlzLmdldERiKCk7XHJcbiAgICAgIHJlc3AgPSBhY3Rpb24oZGIpO1xyXG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgcmVzcCA9IHtcclxuICAgICAgICBjYWNoZUVycm9yOiBlcnIsXHJcbiAgICAgIH0gYXMgVHJtcmtEQlJlc3A8VD47XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3A7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBUcm1ya0lkeGVkREJUeXBlID0gVHJtcmtJZHhlZERCO1xyXG5leHBvcnQgdHlwZSBUcm1ya0RCUmVzcFR5cGU8VD4gPSBUcm1ya0RCUmVzcDxUPjtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVEQlN0b3JlID0gKFxyXG4gIGRiOiBJREJEYXRhYmFzZSxcclxuICBvYmpTdE5hbWU6IHN0cmluZyxcclxuICBrZXlQYXRoOiBzdHJpbmcsXHJcbiAgb3B0czogVHJtcmtEQlN0b3JlT2JqT3B0c1xyXG4pID0+IHtcclxuICBjb25zdCBvYmpTdCA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKG9ialN0TmFtZSwge1xyXG4gICAga2V5UGF0aDoga2V5UGF0aCxcclxuICB9KTtcclxuXHJcbiAgZm9yIChsZXQgaWR4IG9mIG9wdHMuaWR4ZXNBcnIpIHtcclxuICAgIGNvbnN0IHBhcmFtT3B0cyA9IGlkeC5kYk9wdHMgPz8ge307XHJcbiAgICBwYXJhbU9wdHMudW5pcXVlID8/PSBpZHgudW5pcXVlID8/IGZhbHNlO1xyXG5cclxuICAgIG9ialN0LmNyZWF0ZUluZGV4KGlkeC5uYW1lLCBpZHgua2V5UGF0aCwgcGFyYW1PcHRzKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvYmpTdDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRPckNyZWF0ZURiU3RvcmUgPSAoXHJcbiAgZGI6IElEQkRhdGFiYXNlLFxyXG4gIG9ialN0TmFtZXNBcnI6IERPTVN0cmluZ0xpc3QsXHJcbiAgb2JqU3ROYW1lOiBzdHJpbmcsXHJcbiAga2V5UGF0aDogc3RyaW5nLFxyXG4gIG9wdHM6IFRybXJrREJTdG9yZU9iak9wdHNcclxuKSA9PiB7XHJcbiAgaWYgKCEob2JqU3ROYW1lIGluIG9ialN0TmFtZXNBcnIpKSB7XHJcbiAgICBjcmVhdGVEQlN0b3JlKGRiLCBvYmpTdE5hbWUsIGtleVBhdGgsIG9wdHMpO1xyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgaW5kZXhlZERCID0ge1xyXG4gIC4uLmNvcmUsXHJcbn07XHJcbmV4cG9ydCB0eXBlIFRybXJrSWR4ZWREQlR5cGUgPSBjb3JlLlRybXJrSWR4ZWREQlR5cGU7XHJcbmV4cG9ydCB0eXBlIFRybXJrREJSZXNwVHlwZTxUPiA9IGNvcmUuVHJtcmtEQlJlc3BUeXBlPFQ+O1xyXG5leHBvcnQgdHlwZSBJZHhlZERCSW5pdE9wdHMgPSBjb3JlLklkeGVkREJJbml0T3B0cztcclxuIiwiaW1wb3J0IHsgY29yZSBhcyB0cm1yayB9IGZyb20gXCJ0cm1ya1wiO1xyXG5cclxuaW1wb3J0IHtcclxuICBBcGlDb25maWdEYXRhLFxyXG4gIEFwaVJlc3BvbnNlLFxyXG4gIEF4aW9zUmVzcG9uc2UsXHJcbiAgQXBpU2VydmljZVR5cGUsXHJcbiAgQXhpb3NSZXF1ZXN0Q29uZmlnLFxyXG59IGZyb20gXCJ0cm1yay1heGlvc1wiO1xyXG5cclxuaW1wb3J0IHtcclxuICBicm93c2VyIGFzIHRybXJrQnJvd3NlcixcclxuICBUcm1ya0lkeGVkREJUeXBlLFxyXG4gIFRybXJrREJSZXNwLFxyXG4gIElkeGVkREJJbml0T3B0cyxcclxufSBmcm9tIFwidHJtcmstYnJvd3Nlci1jb3JlXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEF4aW9zSWR4ZWREQkluaXRPcHRzIGV4dGVuZHMgSWR4ZWREQkluaXRPcHRzIHtcclxuICBkYXRhOiBBcGlDb25maWdEYXRhO1xyXG4gIGRlZmF1bHRDb25maWdGYWN0b3J5PzpcclxuICAgIHwgKChkYXRhOiBhbnkpID0+IEF4aW9zUmVxdWVzdENvbmZpZzxhbnk+IHwgdW5kZWZpbmVkKVxyXG4gICAgfCBudWxsXHJcbiAgICB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBeGlvc0lkeGVkREJSZXE8VD4ge1xyXG4gIGlkeGVkREJHZXQ6IChkYjogSURCRGF0YWJhc2UpID0+IFRybXJrREJSZXNwPFQ+O1xyXG4gIGFwaUNhbGw6IChhcGlTdmM6IEFwaVNlcnZpY2VUeXBlKSA9PiBQcm9taXNlPEFwaVJlc3BvbnNlPFQ+PjtcclxuICBpZHhlZERCU2V0OiAoZGI6IElEQkRhdGFiYXNlLCBkYXRhOiBUKSA9PiBUcm1ya0RCUmVzcDxUPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBeGlvc0lkeGVkREJSZXNwPFQ+IGV4dGVuZHMgQXBpUmVzcG9uc2U8VD4sIFRybXJrREJSZXNwPFQ+IHt9XHJcblxyXG5leHBvcnQgY2xhc3MgQXhpb3NJZHhlZERCIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyByZWFkb25seSBhcGlTdmM6IEFwaVNlcnZpY2VUeXBlLFxyXG4gICAgcHVibGljIHJlYWRvbmx5IGlkeGVkREI6IFRybXJrSWR4ZWREQlR5cGVcclxuICApIHt9XHJcblxyXG4gIHB1YmxpYyBpbml0KG9wdHM6IEF4aW9zSWR4ZWREQkluaXRPcHRzKSB7XHJcbiAgICB0aGlzLmFwaVN2Yy5pbml0KG9wdHMuZGF0YSwgb3B0cy5kZWZhdWx0Q29uZmlnRmFjdG9yeSk7XHJcbiAgICByZXR1cm4gdGhpcy5pZHhlZERCLmluaXQob3B0cyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgcmVxPFQ+KG9wdHM6IEF4aW9zSWR4ZWREQlJlcTxUPikge1xyXG4gICAgbGV0IHJlc3AgPSAoYXdhaXQgdGhpcy5pZHhlZERCLndpdGhEYjxUPihcclxuICAgICAgb3B0cy5pZHhlZERCR2V0XHJcbiAgICApKSBhcyBBeGlvc0lkeGVkREJSZXNwPFQ+O1xyXG5cclxuICAgIGlmICghKHJlc3AuY2FjaGVNYXRjaCB8fCByZXNwLmNhY2hlRXJyb3IpKSB7XHJcbiAgICAgIHJlc3AgPSAoYXdhaXQgb3B0cy5hcGlDYWxsKHRoaXMuYXBpU3ZjKSkgYXMgQXhpb3NJZHhlZERCUmVzcDxUPjtcclxuXHJcbiAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc1N0YXR1cykge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuaWR4ZWREQi53aXRoRGI8VD4oKGRiKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBzZXRSZXNwID0gb3B0cy5pZHhlZERCU2V0KGRiLCByZXNwLmRhdGEpO1xyXG4gICAgICAgICAgcmVzcC5jYWNoZUVycm9yID0gc2V0UmVzcC5jYWNoZUVycm9yO1xyXG5cclxuICAgICAgICAgIHJldHVybiBzZXRSZXNwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3A7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBeGlvc0lkeGVkREJUeXBlID0gQXhpb3NJZHhlZERCO1xyXG4iLCJpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBheGlvc0lkeGVkREIgPSB7XHJcbiAgLi4uY29yZSxcclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIEF4aW9zSWR4ZWREQiA9IGNvcmUuQXhpb3NJZHhlZERCO1xyXG5leHBvcnQgdHlwZSBBeGlvc0lkeGVkREJUeXBlID0gY29yZS5BeGlvc0lkeGVkREJUeXBlO1xyXG5leHBvcnQgdHlwZSBBeGlvc0lkeGVkREJJbml0T3B0cyA9IGNvcmUuQXhpb3NJZHhlZERCSW5pdE9wdHM7XHJcbmV4cG9ydCB0eXBlIEF4aW9zSWR4ZWREQlJlcTxUPiA9IGNvcmUuQXhpb3NJZHhlZERCUmVxPFQ+O1xyXG5leHBvcnQgdHlwZSBBeGlvc0lkeGVkREJSZXNwPFQ+ID0gY29yZS5BeGlvc0lkeGVkREJSZXNwPFQ+O1xyXG4iLCJleHBvcnQgKiBmcm9tIFwiLi9heGlvc0lkeGVkREJcIjtcclxuIiwiaW1wb3J0ICogYXMgY29yZU9iaiBmcm9tIFwiLi9zcmMvY29yZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvcmUgPSB7XHJcbiAgLi4uY29yZU9iaixcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IGFsbFdzUmVnZXggPSAvXlxccyskL2c7XHJcblxyXG5leHBvcnQgY29uc3QgaXNOb25FbXB0eVN0ciA9IChhcmc6IHN0cmluZyB8IGFueSwgYWxsV3NTYW1lQXNFbXB0eSA9IGZhbHNlKSA9PiB7XHJcbiAgbGV0IHJldFZhbCA9IFwic3RyaW5nXCIgPT09IHR5cGVvZiBhcmc7XHJcbiAgcmV0VmFsID0gcmV0VmFsICYmIGFyZyAhPT0gXCJcIjtcclxuXHJcbiAgaWYgKHJldFZhbCAmJiBhbGxXc1NhbWVBc0VtcHR5KSB7XHJcbiAgICByZXRWYWwgPSAhYWxsV3NSZWdleC50ZXN0KGFyZyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmV0VmFsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGZvckVhY2ggPSA8VD4oXHJcbiAgYXJyOiBUW10sXHJcbiAgY2FsbGJhY2s6IChpdGVtOiBULCBpZHg6IG51bWJlciwgYXJyOiBUW10pID0+IGJvb2xlYW4gfCB2b2lkXHJcbikgPT4ge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoY2FsbGJhY2soYXJyW2ldLCBpLCBhcnIpID09PSBmYWxzZSkge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29udGFpbnMgPSA8VD4oYXJyOiBUW10sIGl0ZW06IFQpID0+IGFyci5pbmRleE9mKGl0ZW0pID49IDA7XHJcblxyXG5leHBvcnQgY29uc3QgYW55ID0gPFQ+KFxyXG4gIGFycjogVFtdLFxyXG4gIHByZWRpY2F0ZTogKGl0ZW06IFQsIGlkeDogbnVtYmVyLCBhcnJheTogVFtdKSA9PiBib29sZWFuXHJcbikgPT4gYXJyLmZpbHRlcihwcmVkaWNhdGUpLmxlbmd0aCA+PSAwO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCAqIGZyb20gXCJ0cm1yay1icm93c2VyLWNvcmVcIjtcclxuXHJcbmltcG9ydCAqIGFzIHRybXJrQnJvd3NlciBmcm9tIFwiLi9zcmNcIjtcclxuXHJcbmltcG9ydCB7IGF4aW9zSWR4ZWREQiB9IGZyb20gXCIuL3NyY1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSB7XHJcbiAgYXhpb3NJZHhlZERCLFxyXG59O1xyXG5cclxuZXhwb3J0IHR5cGUgQXhpb3NJZHhlZERCID0gdHJtcmtCcm93c2VyLkF4aW9zSWR4ZWREQjtcclxuZXhwb3J0IHR5cGUgQXhpb3NJZHhlZERCVHlwZSA9IHRybXJrQnJvd3Nlci5BeGlvc0lkeGVkREJUeXBlO1xyXG5leHBvcnQgdHlwZSBBeGlvc0lkeGVkREJJbml0T3B0cyA9IHRybXJrQnJvd3Nlci5BeGlvc0lkeGVkREJJbml0T3B0cztcclxuZXhwb3J0IHR5cGUgQXhpb3NJZHhlZERCUmVxPFQ+ID0gdHJtcmtCcm93c2VyLkF4aW9zSWR4ZWREQlJlcTxUPjtcclxuZXhwb3J0IHR5cGUgQXhpb3NJZHhlZERCUmVzcDxUPiA9IHRybXJrQnJvd3Nlci5BeGlvc0lkeGVkREJSZXNwPFQ+O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
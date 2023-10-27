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

const browser = {
    ..._src_core__WEBPACK_IMPORTED_MODULE_0__,
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
/* harmony export */   browser: () => (/* reexport safe */ trmrk_browser_core__WEBPACK_IMPORTED_MODULE_0__.browser)
/* harmony export */ });
/* harmony import */ var trmrk_browser_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! trmrk-browser-core */ "../trmrk-browser-core/index.ts");


})();

trmrk = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LWNvcmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi4vdHJtcmstYnJvd3Nlci1jb3JlL3NyYy9jb3JlLnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrL2luZGV4LnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrL3NyYy9jb3JlLnRzIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdHJtcmsvLi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuL3NyYy9jb3JlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgYnJvd3NlciA9IHtcclxuICAuLi5jb3JlLFxyXG59O1xyXG4iLCJpbXBvcnQgeyBjb3JlIGFzIHRybXJrIH0gZnJvbSBcInRybXJrXCI7XHJcblxyXG5leHBvcnQgY29uc3QgYWJzVXJpUmVnZXggPVxyXG4gIC9eW1xcd1xcLV9dK1xcOlxcL1xcLyhbXFx3XFwtX10rXFwuPykrKFxcOlswLTldKyk/KFxcL1tcXHdcXC1cXD9cXC5cXCtfJj0jLF0qKSokL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0TmV3VXJpID0gKFxyXG4gIHF1ZXJ5PzogVVJMU2VhcmNoUGFyYW1zIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICBoYXNoPzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICBwYXRoPzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICBob3N0Pzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICBwcmVzZXJ2ZVF1ZXJ5RGVsaW0/OiBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZFxyXG4pID0+IHtcclxuICBjb25zdCBxdWVyeVN0ciA9IHF1ZXJ5Py50b1N0cmluZygpO1xyXG5cclxuICBjb25zdCBwYXJ0c0FyciA9IFtob3N0LCBwYXRoXS5maWx0ZXIoKHBhcnQpID0+XHJcbiAgICB0cm1yay5pc05vbkVtcHR5U3RyKHBhcnQsIHRydWUpXHJcbiAgKTtcclxuXHJcbiAgbGV0IG5ld1VyaSA9IHBhcnRzQXJyLmpvaW4oXCIvXCIpO1xyXG5cclxuICBpZiAocHJlc2VydmVRdWVyeURlbGltIHx8IHRybXJrLmlzTm9uRW1wdHlTdHIocXVlcnlTdHIsIHRydWUpKSB7XHJcbiAgICBuZXdVcmkgPSBbbmV3VXJpLCBxdWVyeVN0cl0uam9pbihcIj9cIik7XHJcbiAgfVxyXG5cclxuICBpZiAodHJtcmsuaXNOb25FbXB0eVN0cihoYXNoKSkge1xyXG4gICAgbmV3VXJpICs9IGhhc2g7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3VXJpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlbFVyaSA9IChcclxuICBxdWVyeVBhcmFtczogVVJMU2VhcmNoUGFyYW1zLFxyXG4gIHF1ZXJ5UGFyYW1zVHJhbnNmb3JtZXI6IChxdWVyeTogVVJMU2VhcmNoUGFyYW1zKSA9PiB2b2lkLFxyXG4gIGhhc2hUcmFuc2Zvcm1lcj86XHJcbiAgICB8ICgoaGFzaD86IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpID0+IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpXHJcbiAgICB8IG51bGxcclxuICAgIHwgdW5kZWZpbmVkLFxyXG4gIHBhdGhUcmFuc2Zvcm1lcj86XHJcbiAgICB8ICgoaGFzaD86IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpID0+IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpXHJcbiAgICB8IG51bGxcclxuICAgIHwgdW5kZWZpbmVkLFxyXG4gIHByZXNlcnZlUXVlcnlEZWxpbT86IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkXHJcbikgPT4ge1xyXG4gIHF1ZXJ5UGFyYW1zVHJhbnNmb3JtZXIocXVlcnlQYXJhbXMpO1xyXG4gIGhhc2hUcmFuc2Zvcm1lciA/Pz0gKGhhc2gpID0+IGhhc2g7XHJcblxyXG4gIHBhdGhUcmFuc2Zvcm1lciA/Pz0gKHBhdGgpID0+IHtcclxuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBpZiAocGF0aC5zdGFydHNXaXRoKFwiL1wiKSkge1xyXG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cmluZygxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhdGguZW5kc1dpdGgoXCIvXCIpKSB7XHJcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDAsIHBhdGgubGVuZ3RoIC0gMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYXNoID0gaGFzaFRyYW5zZm9ybWVyKGxvY2F0aW9uLmhhc2gpO1xyXG4gIGNvbnN0IHBhdGggPSBwYXRoVHJhbnNmb3JtZXIobG9jYXRpb24ucGF0aG5hbWUpO1xyXG5cclxuICBjb25zdCBuZXdVcmkgPSBnZXROZXdVcmkocXVlcnlQYXJhbXMsIGhhc2gsIHBhdGgsIG51bGwsIHByZXNlcnZlUXVlcnlEZWxpbSk7XHJcbiAgcmV0dXJuIG5ld1VyaTtcclxufTtcclxuIiwiaW1wb3J0ICogYXMgY29yZU9iaiBmcm9tIFwiLi9zcmMvY29yZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvcmUgPSB7XHJcbiAgLi4uY29yZU9iaixcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IGFsbFdzUmVnZXggPSAvXlxccyskL2c7XHJcblxyXG5leHBvcnQgY29uc3QgaXNOb25FbXB0eVN0ciA9IChhcmc6IHN0cmluZyB8IGFueSwgYWxsV3NTYW1lQXNFbXB0eSA9IGZhbHNlKSA9PiB7XHJcbiAgbGV0IHJldFZhbCA9IFwic3RyaW5nXCIgPT09IHR5cGVvZiBhcmc7XHJcbiAgcmV0VmFsID0gcmV0VmFsICYmIGFyZyAhPT0gXCJcIjtcclxuXHJcbiAgaWYgKHJldFZhbCAmJiBhbGxXc1NhbWVBc0VtcHR5KSB7XHJcbiAgICByZXRWYWwgPSAhYWxsV3NSZWdleC50ZXN0KGFyZyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmV0VmFsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGZvckVhY2ggPSA8VD4oXHJcbiAgYXJyOiBUW10sXHJcbiAgY2FsbGJhY2s6IChpdGVtOiBULCBpZHg6IG51bWJlciwgYXJyOiBUW10pID0+IGJvb2xlYW4gfCB2b2lkXHJcbikgPT4ge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoY2FsbGJhY2soYXJyW2ldLCBpLCBhcnIpID09PSBmYWxzZSkge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29udGFpbnMgPSA8VD4oYXJyOiBUW10sIGl0ZW06IFQpID0+IGFyci5pbmRleE9mKGl0ZW0pID49IDA7XHJcblxyXG5leHBvcnQgY29uc3QgYW55ID0gPFQ+KFxyXG4gIGFycjogVFtdLFxyXG4gIHByZWRpY2F0ZTogKGl0ZW06IFQsIGlkeDogbnVtYmVyLCBhcnJheTogVFtdKSA9PiBib29sZWFuXHJcbikgPT4gYXJyLmZpbHRlcihwcmVkaWNhdGUpLmxlbmd0aCA+PSAwO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCAqIGZyb20gXCJ0cm1yay1icm93c2VyLWNvcmVcIjtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
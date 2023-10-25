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
        retVal = allWsRegex.test(arg);
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
/* harmony export */   core: () => (/* binding */ core)
/* harmony export */ });
/* harmony import */ var _src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/core */ "./src/core.ts");

const core = {
    ..._src_core__WEBPACK_IMPORTED_MODULE_0__,
};

})();

trmrk = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJtcmsuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUU1QixNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQWlCLEVBQUUsZ0JBQWdCLEdBQUcsS0FBSyxFQUFFLEVBQUU7SUFDM0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxLQUFLLE9BQU8sR0FBRyxDQUFDO0lBQ3JDLE1BQU0sR0FBRyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsQ0FBQztJQUU5QixJQUFJLE1BQU0sSUFBSSxnQkFBZ0IsRUFBRTtRQUM5QixNQUFNLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMvQjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVLLE1BQU0sT0FBTyxHQUFHLENBQ3JCLEdBQVEsRUFDUixRQUE0RCxFQUM1RCxFQUFFO0lBQ0YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDdEMsTUFBTTtTQUNQO0tBQ0Y7QUFDSCxDQUFDLENBQUM7QUFFSyxNQUFNLFFBQVEsR0FBRyxDQUFJLEdBQVEsRUFBRSxJQUFPLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWxFLE1BQU0sR0FBRyxHQUFHLENBQ2pCLEdBQVEsRUFDUixTQUF3RCxFQUN4RCxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDOzs7Ozs7O1VDN0J2QztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnNDO0FBRS9CLE1BQU0sSUFBSSxHQUFHO0lBQ2xCLEdBQUcsc0NBQU87Q0FDWCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdHJtcmsvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RybXJrLy4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFsbFdzUmVnZXggPSAvXlxccyskL2c7XHJcblxyXG5leHBvcnQgY29uc3QgaXNOb25FbXB0eVN0ciA9IChhcmc6IHN0cmluZyB8IGFueSwgYWxsV3NTYW1lQXNFbXB0eSA9IGZhbHNlKSA9PiB7XHJcbiAgbGV0IHJldFZhbCA9IFwic3RyaW5nXCIgPT09IHR5cGVvZiBhcmc7XHJcbiAgcmV0VmFsID0gcmV0VmFsICYmIGFyZyAhPT0gXCJcIjtcclxuXHJcbiAgaWYgKHJldFZhbCAmJiBhbGxXc1NhbWVBc0VtcHR5KSB7XHJcbiAgICByZXRWYWwgPSBhbGxXc1JlZ2V4LnRlc3QoYXJnKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXRWYWw7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZm9yRWFjaCA9IDxUPihcclxuICBhcnI6IFRbXSxcclxuICBjYWxsYmFjazogKGl0ZW06IFQsIGlkeDogbnVtYmVyLCBhcnI6IFRbXSkgPT4gYm9vbGVhbiB8IHZvaWRcclxuKSA9PiB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChjYWxsYmFjayhhcnJbaV0sIGksIGFycikgPT09IGZhbHNlKSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb250YWlucyA9IDxUPihhcnI6IFRbXSwgaXRlbTogVCkgPT4gYXJyLmluZGV4T2YoaXRlbSkgPj0gMDtcclxuXHJcbmV4cG9ydCBjb25zdCBhbnkgPSA8VD4oXHJcbiAgYXJyOiBUW10sXHJcbiAgcHJlZGljYXRlOiAoaXRlbTogVCwgaWR4OiBudW1iZXIsIGFycmF5OiBUW10pID0+IGJvb2xlYW5cclxuKSA9PiBhcnIuZmlsdGVyKHByZWRpY2F0ZSkubGVuZ3RoID49IDA7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICogYXMgY29yZU9iaiBmcm9tIFwiLi9zcmMvY29yZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvcmUgPSB7XHJcbiAgLi4uY29yZU9iaixcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
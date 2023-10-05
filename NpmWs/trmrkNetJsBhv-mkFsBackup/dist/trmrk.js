var trmrk;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/FsEntriesRetriever.ts":
/*!***********************************!*\
  !*** ./src/FsEntriesRetriever.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FsEntriesRetriever: () => (/* binding */ FsEntriesRetriever)
/* harmony export */ });
/* harmony import */ var _FsEntry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FsEntry */ "./src/FsEntry.ts");

class FsEntriesRetriever {
    rootParentPath;
    rootDirName;
    dirSepStr;
    folderFsEntriesRetriever;
    fsEntriesRetrieverFunc;
    rootPath;
    constructor(rootParentPath, rootDirName, dirSepStr = "/", folderFsEntriesRetriever, fsEntriesRetrieverFunc) {
        this.rootParentPath = rootParentPath;
        this.rootDirName = rootDirName;
        this.dirSepStr = dirSepStr;
        this.folderFsEntriesRetriever = folderFsEntriesRetriever;
        this.fsEntriesRetrieverFunc = fsEntriesRetrieverFunc;
        this.rootPath = [rootParentPath, rootDirName].join(dirSepStr);
    }
    run() {
        return new Promise((resolve, reject) => {
            const rootFolder = new _FsEntry__WEBPACK_IMPORTED_MODULE_0__.FsEntry(this.rootParentPath, this.rootDirName, this.dirSepStr, this.folderFsEntriesRetriever);
            rootFolder.resolved.push((rootFolder) => {
                resolve(rootFolder);
            });
            this.fsEntriesRetrieverFunc(rootFolder);
        });
    }
}


/***/ }),

/***/ "./src/FsEntry.ts":
/*!************************!*\
  !*** ./src/FsEntry.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FsEntry: () => (/* binding */ FsEntry),
/* harmony export */   retrieveFsEntries: () => (/* binding */ retrieveFsEntries)
/* harmony export */ });
/* harmony import */ var trmrk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! trmrk */ "../trmrk/index.ts");

const retrieveFsEntries = async (parentDirPath, dirSepStr, folderFsEntriesRetriever) => {
    const childEntriesArr = await folderFsEntriesRetriever(parentDirPath, dirSepStr);
    const childNodes = childEntriesArr.map((entry) => new FsEntry(parentDirPath, entry.name, dirSepStr, entry.isFolder ? folderFsEntriesRetriever : null));
    return childNodes;
};
class FsEntry {
    parentDirPath;
    name;
    dirSepStr;
    isFolder;
    childNodes;
    isIncluded = false;
    isExcluded = false;
    isResolved = false;
    resolved = [];
    folderFsEntriesRetriever;
    childrenCount = 0;
    resolvedChildrenCount = 0;
    constructor(parentDirPath, name, dirSepStr = "/", folderFsEntriesRetriever) {
        this.parentDirPath = parentDirPath;
        this.name = name;
        this.dirSepStr = dirSepStr;
        this.isFolder = !!folderFsEntriesRetriever;
        this.childNodes = null;
        this.folderFsEntriesRetriever =
            folderFsEntriesRetriever ??
                (async () => {
                    throw new Error("Calling this method on a file entry is not allowed");
                });
    }
    async forEachChild(callback) {
        await this.assureChildrenRetrieved();
        (0,trmrk__WEBPACK_IMPORTED_MODULE_0__.forEach)(this.childNodes, callback);
    }
    exclude() {
        const wasResolved = this.isResolved;
        this.isExcluded = true;
        this.isIncluded = false;
        this.isResolved = true;
        if (!wasResolved) {
            this.onResolved();
        }
    }
    async include(depth = 0) {
        const wasResolved = this.isResolved;
        this.isIncluded = true;
        this.isExcluded = false;
        if (this.isFolder) {
            if (depth > 0) {
                const nextDepth = depth - 1;
                await this.forEachChild((item) => {
                    item.include(nextDepth);
                });
            }
            else {
                await this.assureChildrenRetrieved();
            }
            if (this.childrenCount === 0) {
                this.isResolved = true;
                this.onResolved();
            }
        }
        else {
            if (!wasResolved) {
                this.isResolved = true;
                this.onResolved();
            }
        }
    }
    async retrieveChildren() {
        const dirPath = [this.parentDirPath, this.name].join(this.dirSepStr);
        const childNodes = await retrieveFsEntries(dirPath, this.dirSepStr, this.folderFsEntriesRetriever);
        (0,trmrk__WEBPACK_IMPORTED_MODULE_0__.forEach)(childNodes, (item) => {
            item.resolved.push(() => {
                let keepIterating = true;
                this.resolvedChildrenCount++;
                if (this.resolvedChildrenCount >= this.childrenCount) {
                    this.onResolved();
                    keepIterating = false;
                }
                return keepIterating;
            });
        });
        return [childNodes, childNodes.length];
    }
    async assureChildrenRetrieved() {
        if (!this.childNodes) {
            const [childNodes, childrenCount] = await this.retrieveChildren();
            this.childNodes = childNodes;
            this.childrenCount = childrenCount;
        }
    }
    onResolved() {
        for (let subscription of this.resolved) {
            subscription(this);
        }
    }
}


/***/ }),

/***/ "../trmrk/index.ts":
/*!*************************!*\
  !*** ../trmrk/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allWsRegex: () => (/* reexport safe */ _src_core__WEBPACK_IMPORTED_MODULE_0__.allWsRegex),
/* harmony export */   forEach: () => (/* reexport safe */ _src_core__WEBPACK_IMPORTED_MODULE_0__.forEach),
/* harmony export */   isNonEmptyStr: () => (/* reexport safe */ _src_core__WEBPACK_IMPORTED_MODULE_0__.isNonEmptyStr)
/* harmony export */ });
/* harmony import */ var _src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/core */ "../trmrk/src/core.ts");



/***/ }),

/***/ "../trmrk/src/core.ts":
/*!****************************!*\
  !*** ../trmrk/src/core.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allWsRegex: () => (/* binding */ allWsRegex),
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
};
const forEach = (arr, callback) => {
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr) === false) {
            break;
        }
    }
};


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
/* harmony export */   FsEntriesRetriever: () => (/* reexport safe */ _src_FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_2__.FsEntriesRetriever),
/* harmony export */   FsEntry: () => (/* reexport safe */ _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__.FsEntry),
/* harmony export */   allWsRegex: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.allWsRegex),
/* harmony export */   forEach: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.forEach),
/* harmony export */   isNonEmptyStr: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.isNonEmptyStr),
/* harmony export */   retrieveFsEntries: () => (/* reexport safe */ _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__.retrieveFsEntries)
/* harmony export */ });
/* harmony import */ var trmrk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! trmrk */ "../trmrk/index.ts");
/* harmony import */ var _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/FsEntry */ "./src/FsEntry.ts");
/* harmony import */ var _src_FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/FsEntriesRetriever */ "./src/FsEntriesRetriever.ts");




})();

trmrk = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05zQjtBQUNRO0FBQ1ciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cm1yay8uL3NyYy9Gc0VudHJpZXNSZXRyaWV2ZXIudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi9zcmMvRnNFbnRyeS50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9pbmRleC50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RybXJrLy4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUZzRW50cnksIEZzRW50cnkgfSBmcm9tIFwiLi9Gc0VudHJ5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRnNFbnRyaWVzUmV0cmlldmVyIHtcclxuICByZWFkb25seSByb290UGF0aDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHJlYWRvbmx5IHJvb3RQYXJlbnRQYXRoOiBzdHJpbmcsXHJcbiAgICByZWFkb25seSByb290RGlyTmFtZTogc3RyaW5nLFxyXG4gICAgcmVhZG9ubHkgZGlyU2VwU3RyID0gXCIvXCIsXHJcbiAgICByZWFkb25seSBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXI6IChcclxuICAgICAgZGlyUGF0aDogc3RyaW5nLFxyXG4gICAgICBkaXJTZXA6IHN0cmluZ1xyXG4gICAgKSA9PiBQcm9taXNlPElGc0VudHJ5W10+LFxyXG4gICAgcmVhZG9ubHkgZnNFbnRyaWVzUmV0cmlldmVyRnVuYzogKHJvb3RGb2xkZXI6IEZzRW50cnkpID0+IHZvaWRcclxuICApIHtcclxuICAgIHRoaXMucm9vdFBhdGggPSBbcm9vdFBhcmVudFBhdGgsIHJvb3REaXJOYW1lXS5qb2luKGRpclNlcFN0cik7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcnVuKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEZzRW50cnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3Qgcm9vdEZvbGRlciA9IG5ldyBGc0VudHJ5KFxyXG4gICAgICAgIHRoaXMucm9vdFBhcmVudFBhdGgsXHJcbiAgICAgICAgdGhpcy5yb290RGlyTmFtZSxcclxuICAgICAgICB0aGlzLmRpclNlcFN0cixcclxuICAgICAgICB0aGlzLmZvbGRlckZzRW50cmllc1JldHJpZXZlclxyXG4gICAgICApO1xyXG5cclxuICAgICAgcm9vdEZvbGRlci5yZXNvbHZlZC5wdXNoKChyb290Rm9sZGVyKSA9PiB7XHJcbiAgICAgICAgcmVzb2x2ZShyb290Rm9sZGVyKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmZzRW50cmllc1JldHJpZXZlckZ1bmMocm9vdEZvbGRlcik7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gXCJ0cm1ya1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRnNFbnRyeSB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGlzRm9sZGVyOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmV0cmlldmVGc0VudHJpZXMgPSBhc3luYyAoXHJcbiAgcGFyZW50RGlyUGF0aDogc3RyaW5nLFxyXG4gIGRpclNlcFN0cjogc3RyaW5nLFxyXG4gIGZvbGRlckZzRW50cmllc1JldHJpZXZlcjogKFxyXG4gICAgZGlyUGF0aDogc3RyaW5nLFxyXG4gICAgZGlyU2VwOiBzdHJpbmdcclxuICApID0+IFByb21pc2U8SUZzRW50cnlbXT5cclxuKSA9PiB7XHJcbiAgY29uc3QgY2hpbGRFbnRyaWVzQXJyID0gYXdhaXQgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyKFxyXG4gICAgcGFyZW50RGlyUGF0aCxcclxuICAgIGRpclNlcFN0clxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGNoaWxkTm9kZXMgPSBjaGlsZEVudHJpZXNBcnIubWFwKFxyXG4gICAgKGVudHJ5KSA9PlxyXG4gICAgICBuZXcgRnNFbnRyeShcclxuICAgICAgICBwYXJlbnREaXJQYXRoLFxyXG4gICAgICAgIGVudHJ5Lm5hbWUsXHJcbiAgICAgICAgZGlyU2VwU3RyLFxyXG4gICAgICAgIGVudHJ5LmlzRm9sZGVyID8gZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyIDogbnVsbFxyXG4gICAgICApXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIGNoaWxkTm9kZXM7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgRnNFbnRyeSBpbXBsZW1lbnRzIElGc0VudHJ5IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNGb2xkZXI6IGJvb2xlYW47XHJcbiAgcHVibGljIGNoaWxkTm9kZXM6IEZzRW50cnlbXSB8IG51bGw7XHJcblxyXG4gIHB1YmxpYyBpc0luY2x1ZGVkID0gZmFsc2U7XHJcbiAgcHVibGljIGlzRXhjbHVkZWQgPSBmYWxzZTtcclxuICBwdWJsaWMgaXNSZXNvbHZlZCA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgcmVzb2x2ZWQ6ICgoZnNFbnRyeTogRnNFbnRyeSkgPT4gdm9pZClbXSA9IFtdO1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IGZvbGRlckZzRW50cmllc1JldHJpZXZlcjogKFxyXG4gICAgZGlyUGF0aDogc3RyaW5nLFxyXG4gICAgZGlyU2VwOiBzdHJpbmdcclxuICApID0+IFByb21pc2U8SUZzRW50cnlbXT47XHJcblxyXG4gIHByaXZhdGUgY2hpbGRyZW5Db3VudCA9IDA7XHJcbiAgcHJpdmF0ZSByZXNvbHZlZENoaWxkcmVuQ291bnQgPSAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBwYXJlbnREaXJQYXRoOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxyXG4gICAgcmVhZG9ubHkgZGlyU2VwU3RyID0gXCIvXCIsXHJcbiAgICBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXI6XHJcbiAgICAgIHwgKChkaXJQYXRoOiBzdHJpbmcsIGRpclNlcDogc3RyaW5nKSA9PiBQcm9taXNlPElGc0VudHJ5W10+KVxyXG4gICAgICB8IG51bGxcclxuICApIHtcclxuICAgIHRoaXMuaXNGb2xkZXIgPSAhIWZvbGRlckZzRW50cmllc1JldHJpZXZlcjtcclxuICAgIHRoaXMuY2hpbGROb2RlcyA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5mb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIgPVxyXG4gICAgICBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIgPz9cclxuICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsaW5nIHRoaXMgbWV0aG9kIG9uIGEgZmlsZSBlbnRyeSBpcyBub3QgYWxsb3dlZFwiKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZm9yRWFjaENoaWxkKFxyXG4gICAgY2FsbGJhY2s6IChpdGVtOiBGc0VudHJ5LCBpZHg6IG51bWJlciwgYXJyOiBGc0VudHJ5W10pID0+IHZvaWRcclxuICApIHtcclxuICAgIGF3YWl0IHRoaXMuYXNzdXJlQ2hpbGRyZW5SZXRyaWV2ZWQoKTtcclxuICAgIGZvckVhY2godGhpcy5jaGlsZE5vZGVzLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXhjbHVkZSgpIHtcclxuICAgIGNvbnN0IHdhc1Jlc29sdmVkID0gdGhpcy5pc1Jlc29sdmVkO1xyXG5cclxuICAgIHRoaXMuaXNFeGNsdWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmlzSW5jbHVkZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNSZXNvbHZlZCA9IHRydWU7XHJcblxyXG4gICAgaWYgKCF3YXNSZXNvbHZlZCkge1xyXG4gICAgICB0aGlzLm9uUmVzb2x2ZWQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBpbmNsdWRlKGRlcHRoID0gMCkge1xyXG4gICAgY29uc3Qgd2FzUmVzb2x2ZWQgPSB0aGlzLmlzUmVzb2x2ZWQ7XHJcblxyXG4gICAgdGhpcy5pc0luY2x1ZGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuaXNFeGNsdWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRm9sZGVyKSB7XHJcbiAgICAgIGlmIChkZXB0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBuZXh0RGVwdGggPSBkZXB0aCAtIDE7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMuZm9yRWFjaENoaWxkKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpdGVtLmluY2x1ZGUobmV4dERlcHRoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhd2FpdCB0aGlzLmFzc3VyZUNoaWxkcmVuUmV0cmlldmVkKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmNoaWxkcmVuQ291bnQgPT09IDApIHtcclxuICAgICAgICB0aGlzLmlzUmVzb2x2ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMub25SZXNvbHZlZCgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXdhc1Jlc29sdmVkKSB7XHJcbiAgICAgICAgdGhpcy5pc1Jlc29sdmVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm9uUmVzb2x2ZWQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyByZXRyaWV2ZUNoaWxkcmVuKCk6IFByb21pc2U8W0ZzRW50cnlbXSwgbnVtYmVyXT4ge1xyXG4gICAgY29uc3QgZGlyUGF0aCA9IFt0aGlzLnBhcmVudERpclBhdGgsIHRoaXMubmFtZV0uam9pbih0aGlzLmRpclNlcFN0cik7XHJcblxyXG4gICAgY29uc3QgY2hpbGROb2RlcyA9IGF3YWl0IHJldHJpZXZlRnNFbnRyaWVzKFxyXG4gICAgICBkaXJQYXRoLFxyXG4gICAgICB0aGlzLmRpclNlcFN0cixcclxuICAgICAgdGhpcy5mb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXJcclxuICAgICk7XHJcblxyXG4gICAgZm9yRWFjaChjaGlsZE5vZGVzLCAoaXRlbSkgPT4ge1xyXG4gICAgICBpdGVtLnJlc29sdmVkLnB1c2goKCkgPT4ge1xyXG4gICAgICAgIGxldCBrZWVwSXRlcmF0aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlc29sdmVkQ2hpbGRyZW5Db3VudCsrO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNvbHZlZENoaWxkcmVuQ291bnQgPj0gdGhpcy5jaGlsZHJlbkNvdW50KSB7XHJcbiAgICAgICAgICB0aGlzLm9uUmVzb2x2ZWQoKTtcclxuICAgICAgICAgIGtlZXBJdGVyYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBrZWVwSXRlcmF0aW5nO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBbY2hpbGROb2RlcywgY2hpbGROb2Rlcy5sZW5ndGhdO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBhc3N1cmVDaGlsZHJlblJldHJpZXZlZCgpIHtcclxuICAgIGlmICghdGhpcy5jaGlsZE5vZGVzKSB7XHJcbiAgICAgIGNvbnN0IFtjaGlsZE5vZGVzLCBjaGlsZHJlbkNvdW50XSA9IGF3YWl0IHRoaXMucmV0cmlldmVDaGlsZHJlbigpO1xyXG5cclxuICAgICAgdGhpcy5jaGlsZE5vZGVzID0gY2hpbGROb2RlcztcclxuICAgICAgdGhpcy5jaGlsZHJlbkNvdW50ID0gY2hpbGRyZW5Db3VudDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25SZXNvbHZlZCgpIHtcclxuICAgIGZvciAobGV0IHN1YnNjcmlwdGlvbiBvZiB0aGlzLnJlc29sdmVkKSB7XHJcbiAgICAgIHN1YnNjcmlwdGlvbih0aGlzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0ICogZnJvbSBcIi4vc3JjL2NvcmVcIjtcclxuIiwiZXhwb3J0IGNvbnN0IGFsbFdzUmVnZXggPSAvXlxccyskL2c7XHJcblxyXG5leHBvcnQgY29uc3QgaXNOb25FbXB0eVN0ciA9IChhcmc6IHN0cmluZyB8IGFueSwgYWxsV3NTYW1lQXNFbXB0eSA9IGZhbHNlKSA9PiB7XHJcbiAgbGV0IHJldFZhbCA9IFwic3RyaW5nXCIgPT09IHR5cGVvZiBhcmc7XHJcbiAgcmV0VmFsID0gcmV0VmFsICYmIGFyZyAhPT0gXCJcIjtcclxuXHJcbiAgaWYgKHJldFZhbCAmJiBhbGxXc1NhbWVBc0VtcHR5KSB7XHJcbiAgICByZXRWYWwgPSBhbGxXc1JlZ2V4LnRlc3QoYXJnKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZm9yRWFjaCA9IDxUPihcclxuICBhcnI6IFRbXSxcclxuICBjYWxsYmFjazogKGl0ZW06IFQsIGlkeDogbnVtYmVyLCBhcnI6IFRbXSkgPT4gYm9vbGVhbiB8IHZvaWRcclxuKSA9PiB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChjYWxsYmFjayhhcnJbaV0sIGksIGFycikgPT09IGZhbHNlKSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgKiBmcm9tIFwidHJtcmtcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vc3JjL0ZzRW50cnlcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vc3JjL0ZzRW50cmllc1JldHJpZXZlclwiO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
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
    forEachChildCallback;
    rootPath;
    constructor(rootParentPath, rootDirName, dirSepStr = "/", folderFsEntriesRetriever, forEachChildCallback) {
        this.rootParentPath = rootParentPath;
        this.rootDirName = rootDirName;
        this.dirSepStr = dirSepStr;
        this.folderFsEntriesRetriever = folderFsEntriesRetriever;
        this.forEachChildCallback = forEachChildCallback;
        this.rootPath = [rootParentPath, rootDirName].join(dirSepStr);
    }
    async run() {
        return new Promise((resolve, reject) => {
            const rootFolder = new _FsEntry__WEBPACK_IMPORTED_MODULE_0__.FsEntry(null, this.rootParentPath, this.rootDirName, this.dirSepStr, this.folderFsEntriesRetriever);
            let resolved = false;
            rootFolder.resolved.push((rootFolder) => {
                if (!resolved) {
                    resolved = true;
                    resolve(rootFolder);
                }
            });
            rootFolder.forEachChild(this.forEachChildCallback).then(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(rootFolder);
                }
            }, (reason) => reject(reason));
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

const retrieveFsEntries = async (parent, parentDirPath, dirSepStr, folderFsEntriesRetriever) => {
    const childEntriesArr = await folderFsEntriesRetriever(parentDirPath, dirSepStr);
    const childNodes = childEntriesArr.map((entry) => new FsEntry(parent, parentDirPath, entry.name, dirSepStr, entry.isFolder ? folderFsEntriesRetriever : null));
    return childNodes;
};
class FsEntry {
    parent;
    parentDirPath;
    name;
    dirSepStr;
    isFolder;
    childNodes;
    isIncluded = false;
    isExcluded = false;
    isResolved = false;
    resolved = [];
    fsPath;
    folderFsEntriesRetriever;
    childrenCount = -1;
    resolvedChildrenCount = -1;
    constructor(parent, parentDirPath, name, dirSepStr = "/", folderFsEntriesRetriever) {
        this.parent = parent;
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
    isRootFolder() {
        const isRootFolder = !this.parent;
        return isRootFolder;
    }
    isRootLevel() {
        const isRootLevel = this.parent.isRootFolder;
        return isRootLevel;
    }
    async forEachChild(callback) {
        await this.assureChildrenRetrieved();
        for (let i = 0; i < this.childNodes.length; i++) {
            await callback(this.childNodes[i], i, this.childNodes);
        }
    }
    async include(depth = 0) {
        this.isIncluded = true;
        this.isExcluded = false;
        let resolve = !this.isFolder;
        if (!resolve) {
            if (depth > 0) {
                const nextDepth = depth - 1;
                await this.forEachChild(async (item) => {
                    await item.include(nextDepth);
                });
            }
            else {
                await this.assureChildrenRetrieved();
            }
            resolve = depth >= 0 && this.childrenCount === 0;
        }
        if (this.parent && !this.parent.isIncluded) {
            this.parent.include(depth);
        }
        if (resolve) {
            this.resolveIfReq();
        }
    }
    exclude() {
        this.isExcluded = true;
        this.isIncluded = false;
        this.resolveIfReq();
    }
    excludeUnresolved() {
        if (!this.isResolved) {
            if (!this.isFolder) {
                this.exclude();
            }
            else {
                if (this.resolvedChildrenCount > 0) {
                    (0,trmrk__WEBPACK_IMPORTED_MODULE_0__.forEach)(this.childNodes, (childItem) => {
                        if (!childItem.isResolved) {
                            childItem.exclude();
                        }
                    });
                }
                else if (!this.isIncluded) {
                    this.exclude();
                }
                else {
                    this.resolveIfReq();
                }
            }
        }
    }
    async retrieveChildren() {
        this.fsPath ??= [this.parentDirPath, this.name].join(this.dirSepStr);
        const childNodes = await retrieveFsEntries(this, this.fsPath, this.dirSepStr, this.folderFsEntriesRetriever);
        (0,trmrk__WEBPACK_IMPORTED_MODULE_0__.forEach)(childNodes, (item) => {
            item.resolved.push(() => {
                this.resolvedChildrenCount++;
                if (this.resolvedChildrenCount >= this.childrenCount) {
                    this.resolveIfReq();
                }
            });
        });
        return [childNodes, childNodes.length];
    }
    async assureChildrenRetrieved() {
        if (!this.childNodes) {
            const [childNodes, childrenCount] = await this.retrieveChildren();
            this.childNodes = childNodes;
            this.childrenCount = childrenCount;
            this.resolvedChildrenCount = 0;
        }
    }
    resolveIfReq() {
        const resolve = !this.isResolved;
        if (resolve) {
            this.resolve();
        }
        return resolve;
    }
    resolve() {
        this.isResolved = true;
        this.onResolved();
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
/* harmony export */   any: () => (/* reexport safe */ _src_core__WEBPACK_IMPORTED_MODULE_0__.any),
/* harmony export */   contains: () => (/* reexport safe */ _src_core__WEBPACK_IMPORTED_MODULE_0__.contains),
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
/* harmony export */   FsEntriesRetriever: () => (/* reexport safe */ _src_FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_2__.FsEntriesRetriever),
/* harmony export */   FsEntry: () => (/* reexport safe */ _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__.FsEntry),
/* harmony export */   allWsRegex: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.allWsRegex),
/* harmony export */   any: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.any),
/* harmony export */   contains: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.contains),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUM7S0FDL0I7QUFDSCxDQUFDLENBQUM7QUFFSyxNQUFNLE9BQU8sR0FBRyxDQUNyQixHQUFRLEVBQ1IsUUFBNEQsRUFDNUQsRUFBRTtJQUNGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ25DLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQ3RDLE1BQU07U0FDUDtLQUNGO0FBQ0gsQ0FBQyxDQUFDO0FBRUssTUFBTSxRQUFRLEdBQUcsQ0FBSSxHQUFRLEVBQUUsSUFBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUVsRSxNQUFNLEdBQUcsR0FBRyxDQUNqQixHQUFRLEVBQ1IsU0FBd0QsRUFDeEQsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQzs7Ozs7OztVQzNCdkM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05zQjtBQUNRO0FBQ1ciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cm1yay8uL3NyYy9Gc0VudHJpZXNSZXRyaWV2ZXIudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi9zcmMvRnNFbnRyeS50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9pbmRleC50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RybXJrLy4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUZzRW50cnksIEZzRW50cnkgfSBmcm9tIFwiLi9Gc0VudHJ5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRnNFbnRyaWVzUmV0cmlldmVyIHtcclxuICByZWFkb25seSByb290UGF0aDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHJlYWRvbmx5IHJvb3RQYXJlbnRQYXRoOiBzdHJpbmcsXHJcbiAgICByZWFkb25seSByb290RGlyTmFtZTogc3RyaW5nLFxyXG4gICAgcmVhZG9ubHkgZGlyU2VwU3RyID0gXCIvXCIsXHJcbiAgICByZWFkb25seSBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXI6IChcclxuICAgICAgZGlyUGF0aDogc3RyaW5nLFxyXG4gICAgICBkaXJTZXA6IHN0cmluZ1xyXG4gICAgKSA9PiBQcm9taXNlPElGc0VudHJ5W10+LFxyXG4gICAgcmVhZG9ubHkgZm9yRWFjaENoaWxkQ2FsbGJhY2s6IChcclxuICAgICAgaXRlbTogRnNFbnRyeSxcclxuICAgICAgaWR4OiBudW1iZXIsXHJcbiAgICAgIGFycjogRnNFbnRyeVtdXHJcbiAgICApID0+IFByb21pc2U8dm9pZD5cclxuICApIHtcclxuICAgIHRoaXMucm9vdFBhdGggPSBbcm9vdFBhcmVudFBhdGgsIHJvb3REaXJOYW1lXS5qb2luKGRpclNlcFN0cik7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgcnVuKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEZzRW50cnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3Qgcm9vdEZvbGRlciA9IG5ldyBGc0VudHJ5KFxyXG4gICAgICAgIG51bGwsXHJcbiAgICAgICAgdGhpcy5yb290UGFyZW50UGF0aCxcclxuICAgICAgICB0aGlzLnJvb3REaXJOYW1lLFxyXG4gICAgICAgIHRoaXMuZGlyU2VwU3RyLFxyXG4gICAgICAgIHRoaXMuZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBsZXQgcmVzb2x2ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgIHJvb3RGb2xkZXIucmVzb2x2ZWQucHVzaCgocm9vdEZvbGRlcikgPT4ge1xyXG4gICAgICAgIGlmICghcmVzb2x2ZWQpIHtcclxuICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcclxuICAgICAgICAgIHJlc29sdmUocm9vdEZvbGRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJvb3RGb2xkZXIuZm9yRWFjaENoaWxkKHRoaXMuZm9yRWFjaENoaWxkQ2FsbGJhY2spLnRoZW4oXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKCFyZXNvbHZlZCkge1xyXG4gICAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHJlc29sdmUocm9vdEZvbGRlcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAocmVhc29uKSA9PiByZWplY3QocmVhc29uKVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGZvckVhY2ggfSBmcm9tIFwidHJtcmtcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUZzRW50cnkge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBpc0ZvbGRlcjogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJldHJpZXZlRnNFbnRyaWVzID0gYXN5bmMgKFxyXG4gIHBhcmVudDogRnNFbnRyeSB8IG51bGwsXHJcbiAgcGFyZW50RGlyUGF0aDogc3RyaW5nLFxyXG4gIGRpclNlcFN0cjogc3RyaW5nLFxyXG4gIGZvbGRlckZzRW50cmllc1JldHJpZXZlcjogKFxyXG4gICAgZGlyUGF0aDogc3RyaW5nLFxyXG4gICAgZGlyU2VwOiBzdHJpbmdcclxuICApID0+IFByb21pc2U8SUZzRW50cnlbXT5cclxuKSA9PiB7XHJcbiAgY29uc3QgY2hpbGRFbnRyaWVzQXJyID0gYXdhaXQgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyKFxyXG4gICAgcGFyZW50RGlyUGF0aCxcclxuICAgIGRpclNlcFN0clxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGNoaWxkTm9kZXMgPSBjaGlsZEVudHJpZXNBcnIubWFwKFxyXG4gICAgKGVudHJ5KSA9PlxyXG4gICAgICBuZXcgRnNFbnRyeShcclxuICAgICAgICBwYXJlbnQsXHJcbiAgICAgICAgcGFyZW50RGlyUGF0aCxcclxuICAgICAgICBlbnRyeS5uYW1lLFxyXG4gICAgICAgIGRpclNlcFN0cixcclxuICAgICAgICBlbnRyeS5pc0ZvbGRlciA/IGZvbGRlckZzRW50cmllc1JldHJpZXZlciA6IG51bGxcclxuICAgICAgKVxyXG4gICk7XHJcblxyXG4gIHJldHVybiBjaGlsZE5vZGVzO1xyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEZzRW50cnkgaW1wbGVtZW50cyBJRnNFbnRyeSB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlzRm9sZGVyOiBib29sZWFuO1xyXG4gIHB1YmxpYyBjaGlsZE5vZGVzOiBGc0VudHJ5W10gfCBudWxsO1xyXG5cclxuICBwdWJsaWMgaXNJbmNsdWRlZCA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc0V4Y2x1ZGVkID0gZmFsc2U7XHJcbiAgcHVibGljIGlzUmVzb2x2ZWQgPSBmYWxzZTtcclxuXHJcbiAgcHVibGljIHJlc29sdmVkOiAoKGZzRW50cnk6IEZzRW50cnkpID0+IHZvaWQpW10gPSBbXTtcclxuXHJcbiAgcHVibGljIGZzUGF0aDogc3RyaW5nIHwgbnVsbDtcclxuXHJcbiAgcHJpdmF0ZSByZWFkb25seSBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXI6IChcclxuICAgIGRpclBhdGg6IHN0cmluZyxcclxuICAgIGRpclNlcDogc3RyaW5nXHJcbiAgKSA9PiBQcm9taXNlPElGc0VudHJ5W10+O1xyXG5cclxuICBwcml2YXRlIGNoaWxkcmVuQ291bnQgPSAtMTtcclxuICBwcml2YXRlIHJlc29sdmVkQ2hpbGRyZW5Db3VudCA9IC0xO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyByZWFkb25seSBwYXJlbnQ6IEZzRW50cnkgfCBudWxsLFxyXG4gICAgcHVibGljIHJlYWRvbmx5IHBhcmVudERpclBhdGg6IHN0cmluZyxcclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGlyU2VwU3RyID0gXCIvXCIsXHJcbiAgICBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXI6XHJcbiAgICAgIHwgKChkaXJQYXRoOiBzdHJpbmcsIGRpclNlcDogc3RyaW5nKSA9PiBQcm9taXNlPElGc0VudHJ5W10+KVxyXG4gICAgICB8IG51bGxcclxuICApIHtcclxuICAgIHRoaXMuaXNGb2xkZXIgPSAhIWZvbGRlckZzRW50cmllc1JldHJpZXZlcjtcclxuICAgIHRoaXMuY2hpbGROb2RlcyA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5mb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIgPVxyXG4gICAgICBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIgPz9cclxuICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsaW5nIHRoaXMgbWV0aG9kIG9uIGEgZmlsZSBlbnRyeSBpcyBub3QgYWxsb3dlZFwiKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNSb290Rm9sZGVyKCkge1xyXG4gICAgY29uc3QgaXNSb290Rm9sZGVyID0gIXRoaXMucGFyZW50O1xyXG4gICAgcmV0dXJuIGlzUm9vdEZvbGRlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc1Jvb3RMZXZlbCgpIHtcclxuICAgIGNvbnN0IGlzUm9vdExldmVsID0gdGhpcy5wYXJlbnQuaXNSb290Rm9sZGVyO1xyXG4gICAgcmV0dXJuIGlzUm9vdExldmVsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGZvckVhY2hDaGlsZChcclxuICAgIGNhbGxiYWNrOiAoaXRlbTogRnNFbnRyeSwgaWR4OiBudW1iZXIsIGFycjogRnNFbnRyeVtdKSA9PiBQcm9taXNlPHZvaWQ+XHJcbiAgKSB7XHJcbiAgICBhd2FpdCB0aGlzLmFzc3VyZUNoaWxkcmVuUmV0cmlldmVkKCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgYXdhaXQgY2FsbGJhY2sodGhpcy5jaGlsZE5vZGVzW2ldLCBpLCB0aGlzLmNoaWxkTm9kZXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGluY2x1ZGUoZGVwdGggPSAwKSB7XHJcbiAgICB0aGlzLmlzSW5jbHVkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5pc0V4Y2x1ZGVkID0gZmFsc2U7XHJcblxyXG4gICAgbGV0IHJlc29sdmUgPSAhdGhpcy5pc0ZvbGRlcjtcclxuXHJcbiAgICBpZiAoIXJlc29sdmUpIHtcclxuICAgICAgaWYgKGRlcHRoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IG5leHREZXB0aCA9IGRlcHRoIC0gMTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5mb3JFYWNoQ2hpbGQoYXN5bmMgKGl0ZW0pID0+IHtcclxuICAgICAgICAgIGF3YWl0IGl0ZW0uaW5jbHVkZShuZXh0RGVwdGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuYXNzdXJlQ2hpbGRyZW5SZXRyaWV2ZWQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVzb2x2ZSA9IGRlcHRoID49IDAgJiYgdGhpcy5jaGlsZHJlbkNvdW50ID09PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBhcmVudCAmJiAhdGhpcy5wYXJlbnQuaXNJbmNsdWRlZCkge1xyXG4gICAgICB0aGlzLnBhcmVudC5pbmNsdWRlKGRlcHRoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzb2x2ZSkge1xyXG4gICAgICB0aGlzLnJlc29sdmVJZlJlcSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGV4Y2x1ZGUoKSB7XHJcbiAgICB0aGlzLmlzRXhjbHVkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5pc0luY2x1ZGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5yZXNvbHZlSWZSZXEoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBleGNsdWRlVW5yZXNvbHZlZCgpIHtcclxuICAgIGlmICghdGhpcy5pc1Jlc29sdmVkKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc0ZvbGRlcikge1xyXG4gICAgICAgIHRoaXMuZXhjbHVkZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVkQ2hpbGRyZW5Db3VudCA+IDApIHtcclxuICAgICAgICAgIGZvckVhY2godGhpcy5jaGlsZE5vZGVzLCAoY2hpbGRJdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY2hpbGRJdGVtLmlzUmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgICBjaGlsZEl0ZW0uZXhjbHVkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmlzSW5jbHVkZWQpIHtcclxuICAgICAgICAgIHRoaXMuZXhjbHVkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnJlc29sdmVJZlJlcSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyByZXRyaWV2ZUNoaWxkcmVuKCk6IFByb21pc2U8W0ZzRW50cnlbXSwgbnVtYmVyXT4ge1xyXG4gICAgdGhpcy5mc1BhdGggPz89IFt0aGlzLnBhcmVudERpclBhdGgsIHRoaXMubmFtZV0uam9pbih0aGlzLmRpclNlcFN0cik7XHJcblxyXG4gICAgY29uc3QgY2hpbGROb2RlcyA9IGF3YWl0IHJldHJpZXZlRnNFbnRyaWVzKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICB0aGlzLmZzUGF0aCxcclxuICAgICAgdGhpcy5kaXJTZXBTdHIsXHJcbiAgICAgIHRoaXMuZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyXHJcbiAgICApO1xyXG5cclxuICAgIGZvckVhY2goY2hpbGROb2RlcywgKGl0ZW0pID0+IHtcclxuICAgICAgaXRlbS5yZXNvbHZlZC5wdXNoKCgpID0+IHtcclxuICAgICAgICB0aGlzLnJlc29sdmVkQ2hpbGRyZW5Db3VudCsrO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZXNvbHZlZENoaWxkcmVuQ291bnQgPj0gdGhpcy5jaGlsZHJlbkNvdW50KSB7XHJcbiAgICAgICAgICB0aGlzLnJlc29sdmVJZlJlcSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gW2NoaWxkTm9kZXMsIGNoaWxkTm9kZXMubGVuZ3RoXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgYXNzdXJlQ2hpbGRyZW5SZXRyaWV2ZWQoKSB7XHJcbiAgICBpZiAoIXRoaXMuY2hpbGROb2Rlcykge1xyXG4gICAgICBjb25zdCBbY2hpbGROb2RlcywgY2hpbGRyZW5Db3VudF0gPSBhd2FpdCB0aGlzLnJldHJpZXZlQ2hpbGRyZW4oKTtcclxuXHJcbiAgICAgIHRoaXMuY2hpbGROb2RlcyA9IGNoaWxkTm9kZXM7XHJcbiAgICAgIHRoaXMuY2hpbGRyZW5Db3VudCA9IGNoaWxkcmVuQ291bnQ7XHJcbiAgICAgIHRoaXMucmVzb2x2ZWRDaGlsZHJlbkNvdW50ID0gMDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVzb2x2ZUlmUmVxKCkge1xyXG4gICAgY29uc3QgcmVzb2x2ZSA9ICF0aGlzLmlzUmVzb2x2ZWQ7XHJcblxyXG4gICAgaWYgKHJlc29sdmUpIHtcclxuICAgICAgdGhpcy5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc29sdmU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlc29sdmUoKSB7XHJcbiAgICB0aGlzLmlzUmVzb2x2ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5vblJlc29sdmVkKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uUmVzb2x2ZWQoKSB7XHJcbiAgICBmb3IgKGxldCBzdWJzY3JpcHRpb24gb2YgdGhpcy5yZXNvbHZlZCkge1xyXG4gICAgICBzdWJzY3JpcHRpb24odGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gXCIuL3NyYy9jb3JlXCI7XHJcbiIsImV4cG9ydCBjb25zdCBhbGxXc1JlZ2V4ID0gL15cXHMrJC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGlzTm9uRW1wdHlTdHIgPSAoYXJnOiBzdHJpbmcgfCBhbnksIGFsbFdzU2FtZUFzRW1wdHkgPSBmYWxzZSkgPT4ge1xyXG4gIGxldCByZXRWYWwgPSBcInN0cmluZ1wiID09PSB0eXBlb2YgYXJnO1xyXG4gIHJldFZhbCA9IHJldFZhbCAmJiBhcmcgIT09IFwiXCI7XHJcblxyXG4gIGlmIChyZXRWYWwgJiYgYWxsV3NTYW1lQXNFbXB0eSkge1xyXG4gICAgcmV0VmFsID0gYWxsV3NSZWdleC50ZXN0KGFyZyk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGZvckVhY2ggPSA8VD4oXHJcbiAgYXJyOiBUW10sXHJcbiAgY2FsbGJhY2s6IChpdGVtOiBULCBpZHg6IG51bWJlciwgYXJyOiBUW10pID0+IGJvb2xlYW4gfCB2b2lkXHJcbikgPT4ge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoY2FsbGJhY2soYXJyW2ldLCBpLCBhcnIpID09PSBmYWxzZSkge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29udGFpbnMgPSA8VD4oYXJyOiBUW10sIGl0ZW06IFQpID0+IGFyci5pbmRleE9mKGl0ZW0pID49IDA7XHJcblxyXG5leHBvcnQgY29uc3QgYW55ID0gPFQ+KFxyXG4gIGFycjogVFtdLFxyXG4gIHByZWRpY2F0ZTogKGl0ZW06IFQsIGlkeDogbnVtYmVyLCBhcnJheTogVFtdKSA9PiBib29sZWFuXHJcbikgPT4gYXJyLmZpbHRlcihwcmVkaWNhdGUpLmxlbmd0aCA+PSAwO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCAqIGZyb20gXCJ0cm1ya1wiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9zcmMvRnNFbnRyeVwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9zcmMvRnNFbnRyaWVzUmV0cmlldmVyXCI7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
var trmrk;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/FsBackup.ts":
/*!*************************!*\
  !*** ./src/FsBackup.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FsBackupsManager: () => (/* binding */ FsBackupsManager),
/* harmony export */   fsBackupsManager: () => (/* binding */ fsBackupsManager)
/* harmony export */ });
/* harmony import */ var _FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FsEntriesRetriever */ "./src/FsEntriesRetriever.ts");

class FsBackupsManager {
    runtimeData;
    constructor() { }
    getFsEntriesRetriever(rootDirPath, forEachChildCallback) {
        this.throwIfPropsNotInitialized();
        const fsEntriesRetriever = new _FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_0__.FsEntriesRetriever(rootDirPath, "", this.runtimeData.dirSepStr, this.runtimeData.folderFsEntriesRetriever, forEachChildCallback);
        return fsEntriesRetriever;
    }
    throwIfPropsNotInitialized() {
        if (!this.runtimeData) {
            throw new Error(`The runtimeData must be set`);
        }
        else if (!this.runtimeData.folderFsEntriesRetriever) {
            throw new Error(`The runtimeData.folderFsEntriesRetriever must be set`);
        }
        else if (!this.runtimeData.dirSepStr) {
            throw new Error(`The runtimeData.dirSepStr must be set`);
        }
    }
}
const fsBackupsManager = new FsBackupsManager();


/***/ }),

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
/* harmony export */   FsBackupsManager: () => (/* reexport safe */ _src_FsBackup__WEBPACK_IMPORTED_MODULE_3__.FsBackupsManager),
/* harmony export */   FsEntriesRetriever: () => (/* reexport safe */ _src_FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_2__.FsEntriesRetriever),
/* harmony export */   FsEntry: () => (/* reexport safe */ _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__.FsEntry),
/* harmony export */   allWsRegex: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.allWsRegex),
/* harmony export */   any: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.any),
/* harmony export */   contains: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.contains),
/* harmony export */   forEach: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.forEach),
/* harmony export */   fsBackupsManager: () => (/* reexport safe */ _src_FsBackup__WEBPACK_IMPORTED_MODULE_3__.fsBackupsManager),
/* harmony export */   isNonEmptyStr: () => (/* reexport safe */ trmrk__WEBPACK_IMPORTED_MODULE_0__.isNonEmptyStr),
/* harmony export */   retrieveFsEntries: () => (/* reexport safe */ _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__.retrieveFsEntries)
/* harmony export */ });
/* harmony import */ var trmrk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! trmrk */ "../trmrk/index.ts");
/* harmony import */ var _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/FsEntry */ "./src/FsEntry.ts");
/* harmony import */ var _src_FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/FsEntriesRetriever */ "./src/FsEntriesRetriever.ts");
/* harmony import */ var _src_FsBackup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/FsBackup */ "./src/FsBackup.ts");





})();

trmrk = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRTtZQUN0QyxNQUFNO1NBQ1A7S0FDRjtBQUNILENBQUMsQ0FBQztBQUVLLE1BQU0sUUFBUSxHQUFHLENBQUksR0FBUSxFQUFFLElBQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFbEUsTUFBTSxHQUFHLEdBQUcsQ0FDakIsR0FBUSxFQUNSLFNBQXdELEVBQ3hELEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7Ozs7Ozs7VUMzQnZDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOc0I7QUFDUTtBQUNXO0FBQ1YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cm1yay8uL3NyYy9Gc0JhY2t1cC50cyIsIndlYnBhY2s6Ly90cm1yay8uL3NyYy9Gc0VudHJpZXNSZXRyaWV2ZXIudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi9zcmMvRnNFbnRyeS50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9pbmRleC50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RybXJrLy4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUZzRW50cnksIEZzRW50cnkgfSBmcm9tIFwiLi9Gc0VudHJ5XCI7XHJcbmltcG9ydCB7IEZzRW50cmllc1JldHJpZXZlciB9IGZyb20gXCIuL0ZzRW50cmllc1JldHJpZXZlclwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUnVudGltZURhdGEge1xyXG4gIGRpclNlcFN0cjogc3RyaW5nO1xyXG4gIGZvbGRlckZzRW50cmllc1JldHJpZXZlcjogKFxyXG4gICAgZGlyUGF0aDogc3RyaW5nLFxyXG4gICAgZGlyU2VwOiBzdHJpbmdcclxuICApID0+IFByb21pc2U8SUZzRW50cnlbXT47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGc0JhY2t1cHNNYW5hZ2VyIHtcclxuICBwdWJsaWMgcnVudGltZURhdGE6IElSdW50aW1lRGF0YSB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgZ2V0RnNFbnRyaWVzUmV0cmlldmVyKFxyXG4gICAgcm9vdERpclBhdGg6IHN0cmluZyxcclxuICAgIGZvckVhY2hDaGlsZENhbGxiYWNrOiAoXHJcbiAgICAgIGl0ZW06IEZzRW50cnksXHJcbiAgICAgIGlkeDogbnVtYmVyLFxyXG4gICAgICBhcnI6IEZzRW50cnlbXVxyXG4gICAgKSA9PiBQcm9taXNlPHZvaWQ+XHJcbiAgKSB7XHJcbiAgICB0aGlzLnRocm93SWZQcm9wc05vdEluaXRpYWxpemVkKCk7XHJcblxyXG4gICAgY29uc3QgZnNFbnRyaWVzUmV0cmlldmVyID0gbmV3IEZzRW50cmllc1JldHJpZXZlcihcclxuICAgICAgcm9vdERpclBhdGgsXHJcbiAgICAgIFwiXCIsXHJcbiAgICAgIHRoaXMucnVudGltZURhdGEuZGlyU2VwU3RyLFxyXG4gICAgICB0aGlzLnJ1bnRpbWVEYXRhLmZvbGRlckZzRW50cmllc1JldHJpZXZlcixcclxuICAgICAgZm9yRWFjaENoaWxkQ2FsbGJhY2tcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGZzRW50cmllc1JldHJpZXZlcjtcclxuICB9XHJcblxyXG4gIHRocm93SWZQcm9wc05vdEluaXRpYWxpemVkKCkge1xyXG4gICAgaWYgKCF0aGlzLnJ1bnRpbWVEYXRhKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHJ1bnRpbWVEYXRhIG11c3QgYmUgc2V0YCk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnJ1bnRpbWVEYXRhLmZvbGRlckZzRW50cmllc1JldHJpZXZlcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBydW50aW1lRGF0YS5mb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIgbXVzdCBiZSBzZXRgKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMucnVudGltZURhdGEuZGlyU2VwU3RyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHJ1bnRpbWVEYXRhLmRpclNlcFN0ciBtdXN0IGJlIHNldGApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZzQmFja3Vwc01hbmFnZXIgPSBuZXcgRnNCYWNrdXBzTWFuYWdlcigpO1xyXG4iLCJpbXBvcnQgeyBJRnNFbnRyeSwgRnNFbnRyeSB9IGZyb20gXCIuL0ZzRW50cnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGc0VudHJpZXNSZXRyaWV2ZXIge1xyXG4gIHJlYWRvbmx5IHJvb3RQYXRoOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcmVhZG9ubHkgcm9vdFBhcmVudFBhdGg6IHN0cmluZyxcclxuICAgIHJlYWRvbmx5IHJvb3REaXJOYW1lOiBzdHJpbmcsXHJcbiAgICByZWFkb25seSBkaXJTZXBTdHIgPSBcIi9cIixcclxuICAgIHJlYWRvbmx5IGZvbGRlckZzRW50cmllc1JldHJpZXZlcjogKFxyXG4gICAgICBkaXJQYXRoOiBzdHJpbmcsXHJcbiAgICAgIGRpclNlcDogc3RyaW5nXHJcbiAgICApID0+IFByb21pc2U8SUZzRW50cnlbXT4sXHJcbiAgICByZWFkb25seSBmb3JFYWNoQ2hpbGRDYWxsYmFjazogKFxyXG4gICAgICBpdGVtOiBGc0VudHJ5LFxyXG4gICAgICBpZHg6IG51bWJlcixcclxuICAgICAgYXJyOiBGc0VudHJ5W11cclxuICAgICkgPT4gUHJvbWlzZTx2b2lkPlxyXG4gICkge1xyXG4gICAgdGhpcy5yb290UGF0aCA9IFtyb290UGFyZW50UGF0aCwgcm9vdERpck5hbWVdLmpvaW4oZGlyU2VwU3RyKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBydW4oKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8RnNFbnRyeT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCByb290Rm9sZGVyID0gbmV3IEZzRW50cnkoXHJcbiAgICAgICAgbnVsbCxcclxuICAgICAgICB0aGlzLnJvb3RQYXJlbnRQYXRoLFxyXG4gICAgICAgIHRoaXMucm9vdERpck5hbWUsXHJcbiAgICAgICAgdGhpcy5kaXJTZXBTdHIsXHJcbiAgICAgICAgdGhpcy5mb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXJcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGxldCByZXNvbHZlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgcm9vdEZvbGRlci5yZXNvbHZlZC5wdXNoKChyb290Rm9sZGVyKSA9PiB7XHJcbiAgICAgICAgaWYgKCFyZXNvbHZlZCkge1xyXG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgcmVzb2x2ZShyb290Rm9sZGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcm9vdEZvbGRlci5mb3JFYWNoQ2hpbGQodGhpcy5mb3JFYWNoQ2hpbGRDYWxsYmFjaykudGhlbihcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmVzb2x2ZShyb290Rm9sZGVyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIChyZWFzb24pID0+IHJlamVjdChyZWFzb24pXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gXCJ0cm1ya1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRnNFbnRyeSB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGlzRm9sZGVyOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmV0cmlldmVGc0VudHJpZXMgPSBhc3luYyAoXHJcbiAgcGFyZW50OiBGc0VudHJ5IHwgbnVsbCxcclxuICBwYXJlbnREaXJQYXRoOiBzdHJpbmcsXHJcbiAgZGlyU2VwU3RyOiBzdHJpbmcsXHJcbiAgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyOiAoXHJcbiAgICBkaXJQYXRoOiBzdHJpbmcsXHJcbiAgICBkaXJTZXA6IHN0cmluZ1xyXG4gICkgPT4gUHJvbWlzZTxJRnNFbnRyeVtdPlxyXG4pID0+IHtcclxuICBjb25zdCBjaGlsZEVudHJpZXNBcnIgPSBhd2FpdCBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIoXHJcbiAgICBwYXJlbnREaXJQYXRoLFxyXG4gICAgZGlyU2VwU3RyXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgY2hpbGROb2RlcyA9IGNoaWxkRW50cmllc0Fyci5tYXAoXHJcbiAgICAoZW50cnkpID0+XHJcbiAgICAgIG5ldyBGc0VudHJ5KFxyXG4gICAgICAgIHBhcmVudCxcclxuICAgICAgICBwYXJlbnREaXJQYXRoLFxyXG4gICAgICAgIGVudHJ5Lm5hbWUsXHJcbiAgICAgICAgZGlyU2VwU3RyLFxyXG4gICAgICAgIGVudHJ5LmlzRm9sZGVyID8gZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyIDogbnVsbFxyXG4gICAgICApXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIGNoaWxkTm9kZXM7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgRnNFbnRyeSBpbXBsZW1lbnRzIElGc0VudHJ5IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNGb2xkZXI6IGJvb2xlYW47XHJcbiAgcHVibGljIGNoaWxkTm9kZXM6IEZzRW50cnlbXSB8IG51bGw7XHJcblxyXG4gIHB1YmxpYyBpc0luY2x1ZGVkID0gZmFsc2U7XHJcbiAgcHVibGljIGlzRXhjbHVkZWQgPSBmYWxzZTtcclxuICBwdWJsaWMgaXNSZXNvbHZlZCA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgcmVzb2x2ZWQ6ICgoZnNFbnRyeTogRnNFbnRyeSkgPT4gdm9pZClbXSA9IFtdO1xyXG5cclxuICBwdWJsaWMgZnNQYXRoOiBzdHJpbmcgfCBudWxsO1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IGZvbGRlckZzRW50cmllc1JldHJpZXZlcjogKFxyXG4gICAgZGlyUGF0aDogc3RyaW5nLFxyXG4gICAgZGlyU2VwOiBzdHJpbmdcclxuICApID0+IFByb21pc2U8SUZzRW50cnlbXT47XHJcblxyXG4gIHByaXZhdGUgY2hpbGRyZW5Db3VudCA9IC0xO1xyXG4gIHByaXZhdGUgcmVzb2x2ZWRDaGlsZHJlbkNvdW50ID0gLTE7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIHJlYWRvbmx5IHBhcmVudDogRnNFbnRyeSB8IG51bGwsXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50RGlyUGF0aDogc3RyaW5nLFxyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcclxuICAgIHB1YmxpYyByZWFkb25seSBkaXJTZXBTdHIgPSBcIi9cIixcclxuICAgIGZvbGRlckZzRW50cmllc1JldHJpZXZlcjpcclxuICAgICAgfCAoKGRpclBhdGg6IHN0cmluZywgZGlyU2VwOiBzdHJpbmcpID0+IFByb21pc2U8SUZzRW50cnlbXT4pXHJcbiAgICAgIHwgbnVsbFxyXG4gICkge1xyXG4gICAgdGhpcy5pc0ZvbGRlciA9ICEhZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyO1xyXG4gICAgdGhpcy5jaGlsZE5vZGVzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmZvbGRlckZzRW50cmllc1JldHJpZXZlciA9XHJcbiAgICAgIGZvbGRlckZzRW50cmllc1JldHJpZXZlciA/P1xyXG4gICAgICAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxpbmcgdGhpcyBtZXRob2Qgb24gYSBmaWxlIGVudHJ5IGlzIG5vdCBhbGxvd2VkXCIpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc1Jvb3RGb2xkZXIoKSB7XHJcbiAgICBjb25zdCBpc1Jvb3RGb2xkZXIgPSAhdGhpcy5wYXJlbnQ7XHJcbiAgICByZXR1cm4gaXNSb290Rm9sZGVyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzUm9vdExldmVsKCkge1xyXG4gICAgY29uc3QgaXNSb290TGV2ZWwgPSB0aGlzLnBhcmVudC5pc1Jvb3RGb2xkZXI7XHJcbiAgICByZXR1cm4gaXNSb290TGV2ZWw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZm9yRWFjaENoaWxkKFxyXG4gICAgY2FsbGJhY2s6IChpdGVtOiBGc0VudHJ5LCBpZHg6IG51bWJlciwgYXJyOiBGc0VudHJ5W10pID0+IFByb21pc2U8dm9pZD5cclxuICApIHtcclxuICAgIGF3YWl0IHRoaXMuYXNzdXJlQ2hpbGRyZW5SZXRyaWV2ZWQoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBhd2FpdCBjYWxsYmFjayh0aGlzLmNoaWxkTm9kZXNbaV0sIGksIHRoaXMuY2hpbGROb2Rlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgaW5jbHVkZShkZXB0aCA9IDApIHtcclxuICAgIHRoaXMuaXNJbmNsdWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmlzRXhjbHVkZWQgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgcmVzb2x2ZSA9ICF0aGlzLmlzRm9sZGVyO1xyXG5cclxuICAgIGlmICghcmVzb2x2ZSkge1xyXG4gICAgICBpZiAoZGVwdGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dERlcHRoID0gZGVwdGggLSAxO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLmZvckVhY2hDaGlsZChhc3luYyAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgYXdhaXQgaXRlbS5pbmNsdWRlKG5leHREZXB0aCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5hc3N1cmVDaGlsZHJlblJldHJpZXZlZCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXNvbHZlID0gZGVwdGggPj0gMCAmJiB0aGlzLmNoaWxkcmVuQ291bnQgPT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGFyZW50ICYmICF0aGlzLnBhcmVudC5pc0luY2x1ZGVkKSB7XHJcbiAgICAgIHRoaXMucGFyZW50LmluY2x1ZGUoZGVwdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXNvbHZlKSB7XHJcbiAgICAgIHRoaXMucmVzb2x2ZUlmUmVxKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXhjbHVkZSgpIHtcclxuICAgIHRoaXMuaXNFeGNsdWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmlzSW5jbHVkZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnJlc29sdmVJZlJlcSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV4Y2x1ZGVVbnJlc29sdmVkKCkge1xyXG4gICAgaWYgKCF0aGlzLmlzUmVzb2x2ZWQpIHtcclxuICAgICAgaWYgKCF0aGlzLmlzRm9sZGVyKSB7XHJcbiAgICAgICAgdGhpcy5leGNsdWRlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZWRDaGlsZHJlbkNvdW50ID4gMCkge1xyXG4gICAgICAgICAgZm9yRWFjaCh0aGlzLmNoaWxkTm9kZXMsIChjaGlsZEl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZEl0ZW0uaXNSZXNvbHZlZCkge1xyXG4gICAgICAgICAgICAgIGNoaWxkSXRlbS5leGNsdWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNJbmNsdWRlZCkge1xyXG4gICAgICAgICAgdGhpcy5leGNsdWRlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVzb2x2ZUlmUmVxKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHJldHJpZXZlQ2hpbGRyZW4oKTogUHJvbWlzZTxbRnNFbnRyeVtdLCBudW1iZXJdPiB7XHJcbiAgICB0aGlzLmZzUGF0aCA/Pz0gW3RoaXMucGFyZW50RGlyUGF0aCwgdGhpcy5uYW1lXS5qb2luKHRoaXMuZGlyU2VwU3RyKTtcclxuXHJcbiAgICBjb25zdCBjaGlsZE5vZGVzID0gYXdhaXQgcmV0cmlldmVGc0VudHJpZXMoXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIHRoaXMuZnNQYXRoLFxyXG4gICAgICB0aGlzLmRpclNlcFN0cixcclxuICAgICAgdGhpcy5mb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXJcclxuICAgICk7XHJcblxyXG4gICAgZm9yRWFjaChjaGlsZE5vZGVzLCAoaXRlbSkgPT4ge1xyXG4gICAgICBpdGVtLnJlc29sdmVkLnB1c2goKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZWRDaGlsZHJlbkNvdW50Kys7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVkQ2hpbGRyZW5Db3VudCA+PSB0aGlzLmNoaWxkcmVuQ291bnQpIHtcclxuICAgICAgICAgIHRoaXMucmVzb2x2ZUlmUmVxKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBbY2hpbGROb2RlcywgY2hpbGROb2Rlcy5sZW5ndGhdO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBhc3N1cmVDaGlsZHJlblJldHJpZXZlZCgpIHtcclxuICAgIGlmICghdGhpcy5jaGlsZE5vZGVzKSB7XHJcbiAgICAgIGNvbnN0IFtjaGlsZE5vZGVzLCBjaGlsZHJlbkNvdW50XSA9IGF3YWl0IHRoaXMucmV0cmlldmVDaGlsZHJlbigpO1xyXG5cclxuICAgICAgdGhpcy5jaGlsZE5vZGVzID0gY2hpbGROb2RlcztcclxuICAgICAgdGhpcy5jaGlsZHJlbkNvdW50ID0gY2hpbGRyZW5Db3VudDtcclxuICAgICAgdGhpcy5yZXNvbHZlZENoaWxkcmVuQ291bnQgPSAwO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZXNvbHZlSWZSZXEoKSB7XHJcbiAgICBjb25zdCByZXNvbHZlID0gIXRoaXMuaXNSZXNvbHZlZDtcclxuXHJcbiAgICBpZiAocmVzb2x2ZSkge1xyXG4gICAgICB0aGlzLnJlc29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzb2x2ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVzb2x2ZSgpIHtcclxuICAgIHRoaXMuaXNSZXNvbHZlZCA9IHRydWU7XHJcbiAgICB0aGlzLm9uUmVzb2x2ZWQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25SZXNvbHZlZCgpIHtcclxuICAgIGZvciAobGV0IHN1YnNjcmlwdGlvbiBvZiB0aGlzLnJlc29sdmVkKSB7XHJcbiAgICAgIHN1YnNjcmlwdGlvbih0aGlzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0ICogZnJvbSBcIi4vc3JjL2NvcmVcIjtcclxuIiwiZXhwb3J0IGNvbnN0IGFsbFdzUmVnZXggPSAvXlxccyskL2c7XHJcblxyXG5leHBvcnQgY29uc3QgaXNOb25FbXB0eVN0ciA9IChhcmc6IHN0cmluZyB8IGFueSwgYWxsV3NTYW1lQXNFbXB0eSA9IGZhbHNlKSA9PiB7XHJcbiAgbGV0IHJldFZhbCA9IFwic3RyaW5nXCIgPT09IHR5cGVvZiBhcmc7XHJcbiAgcmV0VmFsID0gcmV0VmFsICYmIGFyZyAhPT0gXCJcIjtcclxuXHJcbiAgaWYgKHJldFZhbCAmJiBhbGxXc1NhbWVBc0VtcHR5KSB7XHJcbiAgICByZXRWYWwgPSBhbGxXc1JlZ2V4LnRlc3QoYXJnKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZm9yRWFjaCA9IDxUPihcclxuICBhcnI6IFRbXSxcclxuICBjYWxsYmFjazogKGl0ZW06IFQsIGlkeDogbnVtYmVyLCBhcnI6IFRbXSkgPT4gYm9vbGVhbiB8IHZvaWRcclxuKSA9PiB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChjYWxsYmFjayhhcnJbaV0sIGksIGFycikgPT09IGZhbHNlKSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb250YWlucyA9IDxUPihhcnI6IFRbXSwgaXRlbTogVCkgPT4gYXJyLmluZGV4T2YoaXRlbSkgPj0gMDtcclxuXHJcbmV4cG9ydCBjb25zdCBhbnkgPSA8VD4oXHJcbiAgYXJyOiBUW10sXHJcbiAgcHJlZGljYXRlOiAoaXRlbTogVCwgaWR4OiBudW1iZXIsIGFycmF5OiBUW10pID0+IGJvb2xlYW5cclxuKSA9PiBhcnIuZmlsdGVyKHByZWRpY2F0ZSkubGVuZ3RoID49IDA7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZXhwb3J0ICogZnJvbSBcInRybXJrXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL3NyYy9Gc0VudHJ5XCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL3NyYy9Gc0VudHJpZXNSZXRyaWV2ZXJcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vc3JjL0ZzQmFja3VwXCI7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
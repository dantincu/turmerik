var trmrk;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var trmrknetjsbhv_mkfsbackup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! trmrknetjsbhv-mkfsbackup */ "../trmrkNetJsBhv-mkFsBackup/index.ts");



const folderFsEntriesArrRetriever = (fsPath, dirSep) => {
    return new Promise((resolve, reject) => {
        fs__WEBPACK_IMPORTED_MODULE_1__.readdir(fsPath, (err, filesArr) => {
            if (err) {
                reject(err);
            }
            else {
                const entriesCount = filesArr.length;
                const entriesArr = filesArr.map((file) => ({
                    name: file,
                }));
                let resolvedCount = 0;
                filesArr.forEach((entryName, idx) => {
                    const entryPath = [fsPath, entryName].join(dirSep);
                    fs__WEBPACK_IMPORTED_MODULE_1__.stat(entryPath, (err, stats) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            entriesArr[idx] = {
                                name: entryName,
                                isFolder: stats.isDirectory(),
                            };
                            resolvedCount++;
                            const allResolved = resolvedCount >= entriesCount;
                            if (allResolved) {
                                resolve(entriesArr);
                            }
                        }
                    });
                });
            }
        });
    });
};
const dirSep = path__WEBPACK_IMPORTED_MODULE_0__.sep;
const rootPath = path__WEBPACK_IMPORTED_MODULE_0__.resolve(".");
const rootDirName = path__WEBPACK_IMPORTED_MODULE_0__.basename(rootPath);
const rootDirParentPath = path__WEBPACK_IMPORTED_MODULE_0__.dirname(rootPath);
let fsEntriesRetrieverFunc = async (rootFolder) => {
    rootFolder.include(Number.MAX_SAFE_INTEGER);
};
const getRetriever = () => new trmrknetjsbhv_mkfsbackup__WEBPACK_IMPORTED_MODULE_2__.FsEntriesRetriever(rootDirParentPath, rootDirName, dirSep, folderFsEntriesArrRetriever, fsEntriesRetrieverFunc);
let retriever = getRetriever();
let rootFolder = await retriever.run();
console.log(" >>>> all entries >>>> ", rootFolder);
fsEntriesRetrieverFunc = async (rootFolder) => {
    rootFolder.exclude();
};
retriever = getRetriever();
rootFolder = await retriever.run();
console.log(" >>>> no entries >>>> ", rootFolder);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "../trmrkNetJsBhv-mkFsBackup/index.ts":
/*!********************************************!*\
  !*** ../trmrkNetJsBhv-mkFsBackup/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/FsEntry */ "../trmrkNetJsBhv-mkFsBackup/src/FsEntry.ts");
/* harmony import */ var _src_FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/FsEntriesRetriever */ "../trmrkNetJsBhv-mkFsBackup/src/FsEntriesRetriever.ts");





/***/ }),

/***/ "../trmrkNetJsBhv-mkFsBackup/src/FsEntriesRetriever.ts":
/*!*************************************************************!*\
  !*** ../trmrkNetJsBhv-mkFsBackup/src/FsEntriesRetriever.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FsEntriesRetriever: () => (/* binding */ FsEntriesRetriever)
/* harmony export */ });
/* harmony import */ var _FsEntry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FsEntry */ "../trmrkNetJsBhv-mkFsBackup/src/FsEntry.ts");

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

/***/ "../trmrkNetJsBhv-mkFsBackup/src/FsEntry.ts":
/*!**************************************************!*\
  !*** ../trmrkNetJsBhv-mkFsBackup/src/FsEntry.ts ***!
  \**************************************************/
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


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	trmrk = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsQ0FBQztXQUNEO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxzR0FBc0c7V0FDdEc7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBLEVBQUU7V0FDRjtXQUNBOzs7OztXQ2hFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RybXJrLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi4vdHJtcmtOZXRKc0Jodi1ta0ZzQmFja3VwL2luZGV4LnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrTmV0SnNCaHYtbWtGc0JhY2t1cC9zcmMvRnNFbnRyaWVzUmV0cmlldmVyLnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrTmV0SnNCaHYtbWtGc0JhY2t1cC9zcmMvRnNFbnRyeS50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9pbmRleC50cyIsIndlYnBhY2s6Ly90cm1yay8uLi90cm1yay9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly90cm1yay9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly90cm1yay9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svcnVudGltZS9hc3luYyBtb2R1bGUiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcclxuXHJcbmltcG9ydCB7XHJcbiAgSUZzRW50cnksXHJcbiAgRnNFbnRyeSxcclxuICBGc0VudHJpZXNSZXRyaWV2ZXIsXHJcbn0gZnJvbSBcInRybXJrbmV0anNiaHYtbWtmc2JhY2t1cFwiO1xyXG5cclxuY29uc3QgZm9sZGVyRnNFbnRyaWVzQXJyUmV0cmlldmVyID0gKGZzUGF0aDogc3RyaW5nLCBkaXJTZXA6IHN0cmluZykgPT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZTxJRnNFbnRyeVtdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBmcy5yZWFkZGlyKGZzUGF0aCwgKGVyciwgZmlsZXNBcnIpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGVudHJpZXNDb3VudCA9IGZpbGVzQXJyLmxlbmd0aDtcclxuXHJcbiAgICAgICAgY29uc3QgZW50cmllc0FyciA9IGZpbGVzQXJyLm1hcChcclxuICAgICAgICAgIChmaWxlKSA9PlxyXG4gICAgICAgICAgICAoe1xyXG4gICAgICAgICAgICAgIG5hbWU6IGZpbGUsXHJcbiAgICAgICAgICAgIH0gYXMgSUZzRW50cnkpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IHJlc29sdmVkQ291bnQgPSAwO1xyXG5cclxuICAgICAgICBmaWxlc0Fyci5mb3JFYWNoKChlbnRyeU5hbWUsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZW50cnlQYXRoID0gW2ZzUGF0aCwgZW50cnlOYW1lXS5qb2luKGRpclNlcCk7XHJcblxyXG4gICAgICAgICAgZnMuc3RhdChlbnRyeVBhdGgsIChlcnIsIHN0YXRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBlbnRyaWVzQXJyW2lkeF0gPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBlbnRyeU5hbWUsXHJcbiAgICAgICAgICAgICAgICBpc0ZvbGRlcjogc3RhdHMuaXNEaXJlY3RvcnkoKSxcclxuICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICByZXNvbHZlZENvdW50Kys7XHJcbiAgICAgICAgICAgICAgY29uc3QgYWxsUmVzb2x2ZWQgPSByZXNvbHZlZENvdW50ID49IGVudHJpZXNDb3VudDtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGFsbFJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGVudHJpZXNBcnIpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZGlyU2VwID0gcGF0aC5zZXA7XHJcbmNvbnN0IHJvb3RQYXRoID0gcGF0aC5yZXNvbHZlKFwiLlwiKTtcclxuY29uc3Qgcm9vdERpck5hbWUgPSBwYXRoLmJhc2VuYW1lKHJvb3RQYXRoKTtcclxuY29uc3Qgcm9vdERpclBhcmVudFBhdGggPSBwYXRoLmRpcm5hbWUocm9vdFBhdGgpO1xyXG5cclxubGV0IGZzRW50cmllc1JldHJpZXZlckZ1bmMgPSBhc3luYyAocm9vdEZvbGRlcjogRnNFbnRyeSkgPT4ge1xyXG4gIHJvb3RGb2xkZXIuaW5jbHVkZShOdW1iZXIuTUFYX1NBRkVfSU5URUdFUik7XHJcbn07XHJcblxyXG5jb25zdCBnZXRSZXRyaWV2ZXIgPSAoKSA9PlxyXG4gIG5ldyBGc0VudHJpZXNSZXRyaWV2ZXIoXHJcbiAgICByb290RGlyUGFyZW50UGF0aCxcclxuICAgIHJvb3REaXJOYW1lLFxyXG4gICAgZGlyU2VwLFxyXG4gICAgZm9sZGVyRnNFbnRyaWVzQXJyUmV0cmlldmVyLFxyXG4gICAgZnNFbnRyaWVzUmV0cmlldmVyRnVuY1xyXG4gICk7XHJcblxyXG5sZXQgcmV0cmlldmVyID0gZ2V0UmV0cmlldmVyKCk7XHJcbmxldCByb290Rm9sZGVyID0gYXdhaXQgcmV0cmlldmVyLnJ1bigpO1xyXG5jb25zb2xlLmxvZyhcIiA+Pj4+IGFsbCBlbnRyaWVzID4+Pj4gXCIsIHJvb3RGb2xkZXIpO1xyXG5cclxuZnNFbnRyaWVzUmV0cmlldmVyRnVuYyA9IGFzeW5jIChyb290Rm9sZGVyOiBGc0VudHJ5KSA9PiB7XHJcbiAgcm9vdEZvbGRlci5leGNsdWRlKCk7XHJcbn07XHJcblxyXG5yZXRyaWV2ZXIgPSBnZXRSZXRyaWV2ZXIoKTtcclxucm9vdEZvbGRlciA9IGF3YWl0IHJldHJpZXZlci5ydW4oKTtcclxuY29uc29sZS5sb2coXCIgPj4+PiBubyBlbnRyaWVzID4+Pj4gXCIsIHJvb3RGb2xkZXIpO1xyXG4iLCJleHBvcnQgKiBmcm9tIFwidHJtcmtcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vc3JjL0ZzRW50cnlcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vc3JjL0ZzRW50cmllc1JldHJpZXZlclwiO1xyXG4iLCJpbXBvcnQgeyBJRnNFbnRyeSwgRnNFbnRyeSB9IGZyb20gXCIuL0ZzRW50cnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGc0VudHJpZXNSZXRyaWV2ZXIge1xyXG4gIHJlYWRvbmx5IHJvb3RQYXRoOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcmVhZG9ubHkgcm9vdFBhcmVudFBhdGg6IHN0cmluZyxcclxuICAgIHJlYWRvbmx5IHJvb3REaXJOYW1lOiBzdHJpbmcsXHJcbiAgICByZWFkb25seSBkaXJTZXBTdHIgPSBcIi9cIixcclxuICAgIHJlYWRvbmx5IGZvbGRlckZzRW50cmllc1JldHJpZXZlcjogKFxyXG4gICAgICBkaXJQYXRoOiBzdHJpbmcsXHJcbiAgICAgIGRpclNlcDogc3RyaW5nXHJcbiAgICApID0+IFByb21pc2U8SUZzRW50cnlbXT4sXHJcbiAgICByZWFkb25seSBmc0VudHJpZXNSZXRyaWV2ZXJGdW5jOiAocm9vdEZvbGRlcjogRnNFbnRyeSkgPT4gdm9pZFxyXG4gICkge1xyXG4gICAgdGhpcy5yb290UGF0aCA9IFtyb290UGFyZW50UGF0aCwgcm9vdERpck5hbWVdLmpvaW4oZGlyU2VwU3RyKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBydW4oKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8RnNFbnRyeT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCByb290Rm9sZGVyID0gbmV3IEZzRW50cnkoXHJcbiAgICAgICAgdGhpcy5yb290UGFyZW50UGF0aCxcclxuICAgICAgICB0aGlzLnJvb3REaXJOYW1lLFxyXG4gICAgICAgIHRoaXMuZGlyU2VwU3RyLFxyXG4gICAgICAgIHRoaXMuZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyXHJcbiAgICAgICk7XHJcblxyXG4gICAgICByb290Rm9sZGVyLnJlc29sdmVkLnB1c2goKHJvb3RGb2xkZXIpID0+IHtcclxuICAgICAgICByZXNvbHZlKHJvb3RGb2xkZXIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuZnNFbnRyaWVzUmV0cmlldmVyRnVuYyhyb290Rm9sZGVyKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSBcInRybXJrXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElGc0VudHJ5IHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgaXNGb2xkZXI6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZXRyaWV2ZUZzRW50cmllcyA9IGFzeW5jIChcclxuICBwYXJlbnREaXJQYXRoOiBzdHJpbmcsXHJcbiAgZGlyU2VwU3RyOiBzdHJpbmcsXHJcbiAgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyOiAoXHJcbiAgICBkaXJQYXRoOiBzdHJpbmcsXHJcbiAgICBkaXJTZXA6IHN0cmluZ1xyXG4gICkgPT4gUHJvbWlzZTxJRnNFbnRyeVtdPlxyXG4pID0+IHtcclxuICBjb25zdCBjaGlsZEVudHJpZXNBcnIgPSBhd2FpdCBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIoXHJcbiAgICBwYXJlbnREaXJQYXRoLFxyXG4gICAgZGlyU2VwU3RyXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgY2hpbGROb2RlcyA9IGNoaWxkRW50cmllc0Fyci5tYXAoXHJcbiAgICAoZW50cnkpID0+XHJcbiAgICAgIG5ldyBGc0VudHJ5KFxyXG4gICAgICAgIHBhcmVudERpclBhdGgsXHJcbiAgICAgICAgZW50cnkubmFtZSxcclxuICAgICAgICBkaXJTZXBTdHIsXHJcbiAgICAgICAgZW50cnkuaXNGb2xkZXIgPyBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIgOiBudWxsXHJcbiAgICAgIClcclxuICApO1xyXG5cclxuICByZXR1cm4gY2hpbGROb2RlcztcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBGc0VudHJ5IGltcGxlbWVudHMgSUZzRW50cnkge1xyXG4gIHB1YmxpYyByZWFkb25seSBpc0ZvbGRlcjogYm9vbGVhbjtcclxuICBwdWJsaWMgY2hpbGROb2RlczogRnNFbnRyeVtdIHwgbnVsbDtcclxuXHJcbiAgcHVibGljIGlzSW5jbHVkZWQgPSBmYWxzZTtcclxuICBwdWJsaWMgaXNFeGNsdWRlZCA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1Jlc29sdmVkID0gZmFsc2U7XHJcblxyXG4gIHB1YmxpYyByZXNvbHZlZDogKChmc0VudHJ5OiBGc0VudHJ5KSA9PiB2b2lkKVtdID0gW107XHJcblxyXG4gIHByaXZhdGUgcmVhZG9ubHkgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyOiAoXHJcbiAgICBkaXJQYXRoOiBzdHJpbmcsXHJcbiAgICBkaXJTZXA6IHN0cmluZ1xyXG4gICkgPT4gUHJvbWlzZTxJRnNFbnRyeVtdPjtcclxuXHJcbiAgcHJpdmF0ZSBjaGlsZHJlbkNvdW50ID0gMDtcclxuICBwcml2YXRlIHJlc29sdmVkQ2hpbGRyZW5Db3VudCA9IDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIHBhcmVudERpclBhdGg6IHN0cmluZyxcclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsXHJcbiAgICByZWFkb25seSBkaXJTZXBTdHIgPSBcIi9cIixcclxuICAgIGZvbGRlckZzRW50cmllc1JldHJpZXZlcjpcclxuICAgICAgfCAoKGRpclBhdGg6IHN0cmluZywgZGlyU2VwOiBzdHJpbmcpID0+IFByb21pc2U8SUZzRW50cnlbXT4pXHJcbiAgICAgIHwgbnVsbFxyXG4gICkge1xyXG4gICAgdGhpcy5pc0ZvbGRlciA9ICEhZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyO1xyXG4gICAgdGhpcy5jaGlsZE5vZGVzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmZvbGRlckZzRW50cmllc1JldHJpZXZlciA9XHJcbiAgICAgIGZvbGRlckZzRW50cmllc1JldHJpZXZlciA/P1xyXG4gICAgICAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxpbmcgdGhpcyBtZXRob2Qgb24gYSBmaWxlIGVudHJ5IGlzIG5vdCBhbGxvd2VkXCIpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBmb3JFYWNoQ2hpbGQoXHJcbiAgICBjYWxsYmFjazogKGl0ZW06IEZzRW50cnksIGlkeDogbnVtYmVyLCBhcnI6IEZzRW50cnlbXSkgPT4gdm9pZFxyXG4gICkge1xyXG4gICAgYXdhaXQgdGhpcy5hc3N1cmVDaGlsZHJlblJldHJpZXZlZCgpO1xyXG4gICAgZm9yRWFjaCh0aGlzLmNoaWxkTm9kZXMsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBleGNsdWRlKCkge1xyXG4gICAgY29uc3Qgd2FzUmVzb2x2ZWQgPSB0aGlzLmlzUmVzb2x2ZWQ7XHJcblxyXG4gICAgdGhpcy5pc0V4Y2x1ZGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuaXNJbmNsdWRlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5pc1Jlc29sdmVkID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoIXdhc1Jlc29sdmVkKSB7XHJcbiAgICAgIHRoaXMub25SZXNvbHZlZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGluY2x1ZGUoZGVwdGggPSAwKSB7XHJcbiAgICBjb25zdCB3YXNSZXNvbHZlZCA9IHRoaXMuaXNSZXNvbHZlZDtcclxuXHJcbiAgICB0aGlzLmlzSW5jbHVkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5pc0V4Y2x1ZGVkID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNGb2xkZXIpIHtcclxuICAgICAgaWYgKGRlcHRoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IG5leHREZXB0aCA9IGRlcHRoIC0gMTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5mb3JFYWNoQ2hpbGQoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIGl0ZW0uaW5jbHVkZShuZXh0RGVwdGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuYXNzdXJlQ2hpbGRyZW5SZXRyaWV2ZWQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuY2hpbGRyZW5Db3VudCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuaXNSZXNvbHZlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vblJlc29sdmVkKCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghd2FzUmVzb2x2ZWQpIHtcclxuICAgICAgICB0aGlzLmlzUmVzb2x2ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMub25SZXNvbHZlZCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHJldHJpZXZlQ2hpbGRyZW4oKTogUHJvbWlzZTxbRnNFbnRyeVtdLCBudW1iZXJdPiB7XHJcbiAgICBjb25zdCBkaXJQYXRoID0gW3RoaXMucGFyZW50RGlyUGF0aCwgdGhpcy5uYW1lXS5qb2luKHRoaXMuZGlyU2VwU3RyKTtcclxuXHJcbiAgICBjb25zdCBjaGlsZE5vZGVzID0gYXdhaXQgcmV0cmlldmVGc0VudHJpZXMoXHJcbiAgICAgIGRpclBhdGgsXHJcbiAgICAgIHRoaXMuZGlyU2VwU3RyLFxyXG4gICAgICB0aGlzLmZvbGRlckZzRW50cmllc1JldHJpZXZlclxyXG4gICAgKTtcclxuXHJcbiAgICBmb3JFYWNoKGNoaWxkTm9kZXMsIChpdGVtKSA9PiB7XHJcbiAgICAgIGl0ZW0ucmVzb2x2ZWQucHVzaCgoKSA9PiB7XHJcbiAgICAgICAgbGV0IGtlZXBJdGVyYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZWRDaGlsZHJlbkNvdW50Kys7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVkQ2hpbGRyZW5Db3VudCA+PSB0aGlzLmNoaWxkcmVuQ291bnQpIHtcclxuICAgICAgICAgIHRoaXMub25SZXNvbHZlZCgpO1xyXG4gICAgICAgICAga2VlcEl0ZXJhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGtlZXBJdGVyYXRpbmc7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIFtjaGlsZE5vZGVzLCBjaGlsZE5vZGVzLmxlbmd0aF07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGFzc3VyZUNoaWxkcmVuUmV0cmlldmVkKCkge1xyXG4gICAgaWYgKCF0aGlzLmNoaWxkTm9kZXMpIHtcclxuICAgICAgY29uc3QgW2NoaWxkTm9kZXMsIGNoaWxkcmVuQ291bnRdID0gYXdhaXQgdGhpcy5yZXRyaWV2ZUNoaWxkcmVuKCk7XHJcblxyXG4gICAgICB0aGlzLmNoaWxkTm9kZXMgPSBjaGlsZE5vZGVzO1xyXG4gICAgICB0aGlzLmNoaWxkcmVuQ291bnQgPSBjaGlsZHJlbkNvdW50O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvblJlc29sdmVkKCkge1xyXG4gICAgZm9yIChsZXQgc3Vic2NyaXB0aW9uIG9mIHRoaXMucmVzb2x2ZWQpIHtcclxuICAgICAgc3Vic2NyaXB0aW9uKHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgKiBmcm9tIFwiLi9zcmMvY29yZVwiO1xyXG4iLCJleHBvcnQgY29uc3QgYWxsV3NSZWdleCA9IC9eXFxzKyQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5U3RyID0gKGFyZzogc3RyaW5nIHwgYW55LCBhbGxXc1NhbWVBc0VtcHR5ID0gZmFsc2UpID0+IHtcclxuICBsZXQgcmV0VmFsID0gXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGFyZztcclxuICByZXRWYWwgPSByZXRWYWwgJiYgYXJnICE9PSBcIlwiO1xyXG5cclxuICBpZiAocmV0VmFsICYmIGFsbFdzU2FtZUFzRW1wdHkpIHtcclxuICAgIHJldFZhbCA9IGFsbFdzUmVnZXgudGVzdChhcmcpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBmb3JFYWNoID0gPFQ+KFxyXG4gIGFycjogVFtdLFxyXG4gIGNhbGxiYWNrOiAoaXRlbTogVCwgaWR4OiBudW1iZXIsIGFycjogVFtdKSA9PiBib29sZWFuIHwgdm9pZFxyXG4pID0+IHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGNhbGxiYWNrKGFycltpXSwgaSwgYXJyKSA9PT0gZmFsc2UpIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJ2YXIgd2VicGFja1F1ZXVlcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgcXVldWVzXCIpIDogXCJfX3dlYnBhY2tfcXVldWVzX19cIjtcbnZhciB3ZWJwYWNrRXhwb3J0cyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXhwb3J0c1wiKSA6IFwiX193ZWJwYWNrX2V4cG9ydHNfX1wiO1xudmFyIHdlYnBhY2tFcnJvciA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXJyb3JcIikgOiBcIl9fd2VicGFja19lcnJvcl9fXCI7XG52YXIgcmVzb2x2ZVF1ZXVlID0gKHF1ZXVlKSA9PiB7XG5cdGlmKHF1ZXVlICYmIHF1ZXVlLmQgPCAxKSB7XG5cdFx0cXVldWUuZCA9IDE7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0pKTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSA/IGZuLnIrKyA6IGZuKCkpKTtcblx0fVxufVxudmFyIHdyYXBEZXBzID0gKGRlcHMpID0+IChkZXBzLm1hcCgoZGVwKSA9PiB7XG5cdGlmKGRlcCAhPT0gbnVsbCAmJiB0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYoZGVwW3dlYnBhY2tRdWV1ZXNdKSByZXR1cm4gZGVwO1xuXHRcdGlmKGRlcC50aGVuKSB7XG5cdFx0XHR2YXIgcXVldWUgPSBbXTtcblx0XHRcdHF1ZXVlLmQgPSAwO1xuXHRcdFx0ZGVwLnRoZW4oKHIpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFeHBvcnRzXSA9IHI7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9LCAoZSkgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0Vycm9yXSA9IGU7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBvYmogPSB7fTtcblx0XHRcdG9ialt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKGZuKHF1ZXVlKSk7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fVxuXHR2YXIgcmV0ID0ge307XG5cdHJldFt3ZWJwYWNrUXVldWVzXSA9IHggPT4ge307XG5cdHJldFt3ZWJwYWNrRXhwb3J0c10gPSBkZXA7XG5cdHJldHVybiByZXQ7XG59KSk7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmEgPSAobW9kdWxlLCBib2R5LCBoYXNBd2FpdCkgPT4ge1xuXHR2YXIgcXVldWU7XG5cdGhhc0F3YWl0ICYmICgocXVldWUgPSBbXSkuZCA9IC0xKTtcblx0dmFyIGRlcFF1ZXVlcyA9IG5ldyBTZXQoKTtcblx0dmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cztcblx0dmFyIGN1cnJlbnREZXBzO1xuXHR2YXIgb3V0ZXJSZXNvbHZlO1xuXHR2YXIgcmVqZWN0O1xuXHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcblx0XHRyZWplY3QgPSByZWo7XG5cdFx0b3V0ZXJSZXNvbHZlID0gcmVzb2x2ZTtcblx0fSk7XG5cdHByb21pc2Vbd2VicGFja0V4cG9ydHNdID0gZXhwb3J0cztcblx0cHJvbWlzZVt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKHF1ZXVlICYmIGZuKHF1ZXVlKSwgZGVwUXVldWVzLmZvckVhY2goZm4pLCBwcm9taXNlW1wiY2F0Y2hcIl0oeCA9PiB7fSkpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IHByb21pc2U7XG5cdGJvZHkoKGRlcHMpID0+IHtcblx0XHRjdXJyZW50RGVwcyA9IHdyYXBEZXBzKGRlcHMpO1xuXHRcdHZhciBmbjtcblx0XHR2YXIgZ2V0UmVzdWx0ID0gKCkgPT4gKGN1cnJlbnREZXBzLm1hcCgoZCkgPT4ge1xuXHRcdFx0aWYoZFt3ZWJwYWNrRXJyb3JdKSB0aHJvdyBkW3dlYnBhY2tFcnJvcl07XG5cdFx0XHRyZXR1cm4gZFt3ZWJwYWNrRXhwb3J0c107XG5cdFx0fSkpXG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0Zm4gPSAoKSA9PiAocmVzb2x2ZShnZXRSZXN1bHQpKTtcblx0XHRcdGZuLnIgPSAwO1xuXHRcdFx0dmFyIGZuUXVldWUgPSAocSkgPT4gKHEgIT09IHF1ZXVlICYmICFkZXBRdWV1ZXMuaGFzKHEpICYmIChkZXBRdWV1ZXMuYWRkKHEpLCBxICYmICFxLmQgJiYgKGZuLnIrKywgcS5wdXNoKGZuKSkpKTtcblx0XHRcdGN1cnJlbnREZXBzLm1hcCgoZGVwKSA9PiAoZGVwW3dlYnBhY2tRdWV1ZXNdKGZuUXVldWUpKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZuLnIgPyBwcm9taXNlIDogZ2V0UmVzdWx0KCk7XG5cdH0sIChlcnIpID0+ICgoZXJyID8gcmVqZWN0KHByb21pc2Vbd2VicGFja0Vycm9yXSA9IGVycikgOiBvdXRlclJlc29sdmUoZXhwb3J0cykpLCByZXNvbHZlUXVldWUocXVldWUpKSk7XG5cdHF1ZXVlICYmIHF1ZXVlLmQgPCAwICYmIChxdWV1ZS5kID0gMCk7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
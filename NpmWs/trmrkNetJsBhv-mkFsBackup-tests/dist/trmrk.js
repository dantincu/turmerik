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
                if (entriesCount > 0) {
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
                else {
                    resolve([]);
                }
            }
        });
    });
};
const serializeFolderCore = (fsEntry, pathsArr) => {
    const fsPath = [fsEntry.parentDirPath, fsEntry.name].join(fsEntry.dirSepStr);
    if (fsEntry.isIncluded) {
        pathsArr.push(fsPath);
    }
    fsEntry.childNodes?.forEach((childNode) => {
        serializeFolderCore(childNode, pathsArr);
    });
    return pathsArr;
};
const serializeFolder = (fsEntry) => serializeFolderCore(fsEntry, []).join("\n");
const dirSep = path__WEBPACK_IMPORTED_MODULE_0__.sep;
let forEachChildCallback = async (item, idx, arr) => {
    await item.parent.include(Number.MAX_SAFE_INTEGER);
    // await item.parent.include(0);
};
const getRetriever = (rootPath = null) => {
    rootPath ??= ".";
    rootPath = path__WEBPACK_IMPORTED_MODULE_0__.resolve(rootPath);
    const rootDirName = path__WEBPACK_IMPORTED_MODULE_0__.basename(rootPath);
    const rootDirParentPath = path__WEBPACK_IMPORTED_MODULE_0__.dirname(rootPath);
    const retriever = new trmrknetjsbhv_mkfsbackup__WEBPACK_IMPORTED_MODULE_2__.FsEntriesRetriever(rootDirParentPath, rootDirName, dirSep, folderFsEntriesArrRetriever, forEachChildCallback);
    return retriever;
};
let retriever = getRetriever();
// let allEntries = await retriever.run();
// console.log(" >>>> all entries >>>> ", serializeFolder(allEntries));
forEachChildCallback = async (item, idx, arr) => {
    item.parent.exclude();
};
retriever = getRetriever();
const noEntries = await retriever.run();
console.log(" >>>> no entries >>>> ", serializeFolder(noEntries));
forEachChildCallback = async (item, idx, arr) => {
    const entriesToInclude = ["node_modules", "package.json"];
    const namesArr = arr.map((itm) => itm.name);
    const matching = namesArr.filter((name) => entriesToInclude.indexOf(name) >= 0);
    if (matching.length > 0) {
        if (entriesToInclude.indexOf(item.name) >= 0) {
            await item.include(0);
            item.excludeUnresolved();
        }
        else {
            item.exclude();
        }
    }
    else {
        if (item.isFolder) {
            await item.forEachChild(forEachChildCallback);
            item.excludeUnresolved();
        }
        else {
            item.exclude();
        }
    }
};
retriever = getRetriever();
const someEntries = await retriever.run();
console.log(" >>>> some entries >>>> ", serializeFolder(someEntries));
const excludedDirNames = [".git", ".vs", "node_modules"];
const excludedNetDirNames = ["bin", "obj"];
const netCsprojExtn = ".csproj";
forEachChildCallback = async (item, idx, arr) => {
    if (item.isFolder) {
        let exclude = (0,trmrknetjsbhv_mkfsbackup__WEBPACK_IMPORTED_MODULE_2__.contains)(excludedDirNames, item.name) ||
            ((0,trmrknetjsbhv_mkfsbackup__WEBPACK_IMPORTED_MODULE_2__.any)(arr, (sibbling) => sibbling.name.endsWith(netCsprojExtn)) &&
                (0,trmrknetjsbhv_mkfsbackup__WEBPACK_IMPORTED_MODULE_2__.contains)(excludedNetDirNames, item.name));
        if (exclude) {
            item.exclude();
        }
        else {
            await item.include();
            await item.forEachChild(forEachChildCallback);
        }
    }
    else {
        await item.include();
    }
};
try {
    retriever = getRetriever("../");
    const theEntries = await retriever.run();
    console.log(" >>>> the entries >>>> ", serializeFolder(theEntries));
}
catch (err) {
    throw err;
}

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
/* harmony import */ var _src_FsEntry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/FsEntry */ "../trmrkNetJsBhv-mkFsBackup/src/FsEntry.ts");
/* harmony import */ var _src_FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/FsEntriesRetriever */ "../trmrkNetJsBhv-mkFsBackup/src/FsEntriesRetriever.ts");
/* harmony import */ var _src_FsBackup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/FsBackup */ "../trmrkNetJsBhv-mkFsBackup/src/FsBackup.ts");






/***/ }),

/***/ "../trmrkNetJsBhv-mkFsBackup/src/FsBackup.ts":
/*!***************************************************!*\
  !*** ../trmrkNetJsBhv-mkFsBackup/src/FsBackup.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FsBackupsManager: () => (/* binding */ FsBackupsManager),
/* harmony export */   fsBackupsManager: () => (/* binding */ fsBackupsManager)
/* harmony export */ });
/* harmony import */ var _FsEntriesRetriever__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FsEntriesRetriever */ "../trmrkNetJsBhv-mkFsBackup/src/FsEntriesRetriever.ts");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsR0FBRyxDQUNqQixHQUFRLEVBQ1IsU0FBd0QsRUFDeEQsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7QUMzQnZDOzs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsQ0FBQztXQUNEO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxzR0FBc0c7V0FDdEc7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBLEVBQUU7V0FDRjtXQUNBOzs7OztXQ2hFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RybXJrLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi4vdHJtcmtOZXRKc0Jodi1ta0ZzQmFja3VwL2luZGV4LnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrTmV0SnNCaHYtbWtGc0JhY2t1cC9zcmMvRnNCYWNrdXAudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi4vdHJtcmtOZXRKc0Jodi1ta0ZzQmFja3VwL3NyYy9Gc0VudHJpZXNSZXRyaWV2ZXIudHMiLCJ3ZWJwYWNrOi8vdHJtcmsvLi4vdHJtcmtOZXRKc0Jodi1ta0ZzQmFja3VwL3NyYy9Gc0VudHJ5LnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrL2luZGV4LnRzIiwid2VicGFjazovL3RybXJrLy4uL3RybXJrL3NyYy9jb3JlLnRzIiwid2VicGFjazovL3RybXJrL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJmc1wiIiwid2VicGFjazovL3RybXJrL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2FzeW5jIG1vZHVsZSIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90cm1yay93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RybXJrL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdHJtcmsvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3RybXJrL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xyXG5cclxuaW1wb3J0IHtcclxuICBJRnNFbnRyeSxcclxuICBGc0VudHJ5LFxyXG4gIEZzRW50cmllc1JldHJpZXZlcixcclxuICBjb250YWlucyxcclxuICBhbnksXHJcbn0gZnJvbSBcInRybXJrbmV0anNiaHYtbWtmc2JhY2t1cFwiO1xyXG5cclxuY29uc3QgZm9sZGVyRnNFbnRyaWVzQXJyUmV0cmlldmVyID0gKGZzUGF0aDogc3RyaW5nLCBkaXJTZXA6IHN0cmluZykgPT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZTxJRnNFbnRyeVtdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBmcy5yZWFkZGlyKGZzUGF0aCwgKGVyciwgZmlsZXNBcnIpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGVudHJpZXNDb3VudCA9IGZpbGVzQXJyLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKGVudHJpZXNDb3VudCA+IDApIHtcclxuICAgICAgICAgIGNvbnN0IGVudHJpZXNBcnIgPSBmaWxlc0Fyci5tYXAoXHJcbiAgICAgICAgICAgIChmaWxlKSA9PlxyXG4gICAgICAgICAgICAgICh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBmaWxlLFxyXG4gICAgICAgICAgICAgIH0gYXMgSUZzRW50cnkpXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGxldCByZXNvbHZlZENvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICBmaWxlc0Fyci5mb3JFYWNoKChlbnRyeU5hbWUsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBlbnRyeVBhdGggPSBbZnNQYXRoLCBlbnRyeU5hbWVdLmpvaW4oZGlyU2VwKTtcclxuXHJcbiAgICAgICAgICAgIGZzLnN0YXQoZW50cnlQYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyaWVzQXJyW2lkeF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGVudHJ5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgaXNGb2xkZXI6IHN0YXRzLmlzRGlyZWN0b3J5KCksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmVkQ291bnQrKztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFJlc29sdmVkID0gcmVzb2x2ZWRDb3VudCA+PSBlbnRyaWVzQ291bnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFsbFJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoZW50cmllc0Fycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3Qgc2VyaWFsaXplRm9sZGVyQ29yZSA9IChmc0VudHJ5OiBGc0VudHJ5LCBwYXRoc0Fycjogc3RyaW5nW10pID0+IHtcclxuICBjb25zdCBmc1BhdGggPSBbZnNFbnRyeS5wYXJlbnREaXJQYXRoLCBmc0VudHJ5Lm5hbWVdLmpvaW4oZnNFbnRyeS5kaXJTZXBTdHIpO1xyXG5cclxuICBpZiAoZnNFbnRyeS5pc0luY2x1ZGVkKSB7XHJcbiAgICBwYXRoc0Fyci5wdXNoKGZzUGF0aCk7XHJcbiAgfVxyXG5cclxuICBmc0VudHJ5LmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkTm9kZSkgPT4ge1xyXG4gICAgc2VyaWFsaXplRm9sZGVyQ29yZShjaGlsZE5vZGUsIHBhdGhzQXJyKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHBhdGhzQXJyO1xyXG59O1xyXG5cclxuY29uc3Qgc2VyaWFsaXplRm9sZGVyID0gKGZzRW50cnk6IEZzRW50cnkpID0+XHJcbiAgc2VyaWFsaXplRm9sZGVyQ29yZShmc0VudHJ5LCBbXSkuam9pbihcIlxcblwiKTtcclxuXHJcbmNvbnN0IGRpclNlcCA9IHBhdGguc2VwO1xyXG5cclxubGV0IGZvckVhY2hDaGlsZENhbGxiYWNrID0gYXN5bmMgKFxyXG4gIGl0ZW06IEZzRW50cnksXHJcbiAgaWR4OiBudW1iZXIsXHJcbiAgYXJyOiBGc0VudHJ5W11cclxuKSA9PiB7XHJcbiAgYXdhaXQgaXRlbS5wYXJlbnQuaW5jbHVkZShOdW1iZXIuTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgLy8gYXdhaXQgaXRlbS5wYXJlbnQuaW5jbHVkZSgwKTtcclxufTtcclxuXHJcbmNvbnN0IGdldFJldHJpZXZlciA9IChyb290UGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGwpID0+IHtcclxuICByb290UGF0aCA/Pz0gXCIuXCI7XHJcbiAgcm9vdFBhdGggPSBwYXRoLnJlc29sdmUocm9vdFBhdGgpO1xyXG4gIGNvbnN0IHJvb3REaXJOYW1lID0gcGF0aC5iYXNlbmFtZShyb290UGF0aCk7XHJcbiAgY29uc3Qgcm9vdERpclBhcmVudFBhdGggPSBwYXRoLmRpcm5hbWUocm9vdFBhdGgpO1xyXG5cclxuICBjb25zdCByZXRyaWV2ZXIgPSBuZXcgRnNFbnRyaWVzUmV0cmlldmVyKFxyXG4gICAgcm9vdERpclBhcmVudFBhdGgsXHJcbiAgICByb290RGlyTmFtZSxcclxuICAgIGRpclNlcCxcclxuICAgIGZvbGRlckZzRW50cmllc0FyclJldHJpZXZlcixcclxuICAgIGZvckVhY2hDaGlsZENhbGxiYWNrXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHJldHJpZXZlcjtcclxufTtcclxuXHJcbmxldCByZXRyaWV2ZXIgPSBnZXRSZXRyaWV2ZXIoKTtcclxuLy8gbGV0IGFsbEVudHJpZXMgPSBhd2FpdCByZXRyaWV2ZXIucnVuKCk7XHJcbi8vIGNvbnNvbGUubG9nKFwiID4+Pj4gYWxsIGVudHJpZXMgPj4+PiBcIiwgc2VyaWFsaXplRm9sZGVyKGFsbEVudHJpZXMpKTtcclxuXHJcbmZvckVhY2hDaGlsZENhbGxiYWNrID0gYXN5bmMgKGl0ZW06IEZzRW50cnksIGlkeDogbnVtYmVyLCBhcnI6IEZzRW50cnlbXSkgPT4ge1xyXG4gIGl0ZW0ucGFyZW50LmV4Y2x1ZGUoKTtcclxufTtcclxuXHJcbnJldHJpZXZlciA9IGdldFJldHJpZXZlcigpO1xyXG5jb25zdCBub0VudHJpZXMgPSBhd2FpdCByZXRyaWV2ZXIucnVuKCk7XHJcbmNvbnNvbGUubG9nKFwiID4+Pj4gbm8gZW50cmllcyA+Pj4+IFwiLCBzZXJpYWxpemVGb2xkZXIobm9FbnRyaWVzKSk7XHJcblxyXG5mb3JFYWNoQ2hpbGRDYWxsYmFjayA9IGFzeW5jIChpdGVtOiBGc0VudHJ5LCBpZHg6IG51bWJlciwgYXJyOiBGc0VudHJ5W10pID0+IHtcclxuICBjb25zdCBlbnRyaWVzVG9JbmNsdWRlID0gW1wibm9kZV9tb2R1bGVzXCIsIFwicGFja2FnZS5qc29uXCJdO1xyXG4gIGNvbnN0IG5hbWVzQXJyID0gYXJyLm1hcCgoaXRtKSA9PiBpdG0ubmFtZSk7XHJcblxyXG4gIGNvbnN0IG1hdGNoaW5nID0gbmFtZXNBcnIuZmlsdGVyKFxyXG4gICAgKG5hbWUpID0+IGVudHJpZXNUb0luY2x1ZGUuaW5kZXhPZihuYW1lKSA+PSAwXHJcbiAgKTtcclxuXHJcbiAgaWYgKG1hdGNoaW5nLmxlbmd0aCA+IDApIHtcclxuICAgIGlmIChlbnRyaWVzVG9JbmNsdWRlLmluZGV4T2YoaXRlbS5uYW1lKSA+PSAwKSB7XHJcbiAgICAgIGF3YWl0IGl0ZW0uaW5jbHVkZSgwKTtcclxuICAgICAgaXRlbS5leGNsdWRlVW5yZXNvbHZlZCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5leGNsdWRlKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChpdGVtLmlzRm9sZGVyKSB7XHJcbiAgICAgIGF3YWl0IGl0ZW0uZm9yRWFjaENoaWxkKGZvckVhY2hDaGlsZENhbGxiYWNrKTtcclxuICAgICAgaXRlbS5leGNsdWRlVW5yZXNvbHZlZCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5leGNsdWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxucmV0cmlldmVyID0gZ2V0UmV0cmlldmVyKCk7XHJcbmNvbnN0IHNvbWVFbnRyaWVzID0gYXdhaXQgcmV0cmlldmVyLnJ1bigpO1xyXG5jb25zb2xlLmxvZyhcIiA+Pj4+IHNvbWUgZW50cmllcyA+Pj4+IFwiLCBzZXJpYWxpemVGb2xkZXIoc29tZUVudHJpZXMpKTtcclxuXHJcbmNvbnN0IGV4Y2x1ZGVkRGlyTmFtZXMgPSBbXCIuZ2l0XCIsIFwiLnZzXCIsIFwibm9kZV9tb2R1bGVzXCJdO1xyXG5jb25zdCBleGNsdWRlZE5ldERpck5hbWVzID0gW1wiYmluXCIsIFwib2JqXCJdO1xyXG5jb25zdCBuZXRDc3Byb2pFeHRuID0gXCIuY3Nwcm9qXCI7XHJcblxyXG5mb3JFYWNoQ2hpbGRDYWxsYmFjayA9IGFzeW5jIChpdGVtOiBGc0VudHJ5LCBpZHg6IG51bWJlciwgYXJyOiBGc0VudHJ5W10pID0+IHtcclxuICBpZiAoaXRlbS5pc0ZvbGRlcikge1xyXG4gICAgbGV0IGV4Y2x1ZGUgPVxyXG4gICAgICBjb250YWlucyhleGNsdWRlZERpck5hbWVzLCBpdGVtLm5hbWUpIHx8XHJcbiAgICAgIChhbnkoYXJyLCAoc2liYmxpbmcpID0+IHNpYmJsaW5nLm5hbWUuZW5kc1dpdGgobmV0Q3Nwcm9qRXh0bikpICYmXHJcbiAgICAgICAgY29udGFpbnMoZXhjbHVkZWROZXREaXJOYW1lcywgaXRlbS5uYW1lKSk7XHJcblxyXG4gICAgaWYgKGV4Y2x1ZGUpIHtcclxuICAgICAgaXRlbS5leGNsdWRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhd2FpdCBpdGVtLmluY2x1ZGUoKTtcclxuICAgICAgYXdhaXQgaXRlbS5mb3JFYWNoQ2hpbGQoZm9yRWFjaENoaWxkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBhd2FpdCBpdGVtLmluY2x1ZGUoKTtcclxuICB9XHJcbn07XHJcblxyXG50cnkge1xyXG4gIHJldHJpZXZlciA9IGdldFJldHJpZXZlcihcIi4uL1wiKTtcclxuICBjb25zdCB0aGVFbnRyaWVzID0gYXdhaXQgcmV0cmlldmVyLnJ1bigpO1xyXG4gIGNvbnNvbGUubG9nKFwiID4+Pj4gdGhlIGVudHJpZXMgPj4+PiBcIiwgc2VyaWFsaXplRm9sZGVyKHRoZUVudHJpZXMpKTtcclxufSBjYXRjaCAoZXJyKSB7XHJcbiAgdGhyb3cgZXJyO1xyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gXCJ0cm1ya1wiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9zcmMvRnNFbnRyeVwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9zcmMvRnNFbnRyaWVzUmV0cmlldmVyXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL3NyYy9Gc0JhY2t1cFwiO1xyXG4iLCJpbXBvcnQgeyBJRnNFbnRyeSwgRnNFbnRyeSB9IGZyb20gXCIuL0ZzRW50cnlcIjtcclxuaW1wb3J0IHsgRnNFbnRyaWVzUmV0cmlldmVyIH0gZnJvbSBcIi4vRnNFbnRyaWVzUmV0cmlldmVyXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElSdW50aW1lRGF0YSB7XHJcbiAgZGlyU2VwU3RyOiBzdHJpbmc7XHJcbiAgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyOiAoXHJcbiAgICBkaXJQYXRoOiBzdHJpbmcsXHJcbiAgICBkaXJTZXA6IHN0cmluZ1xyXG4gICkgPT4gUHJvbWlzZTxJRnNFbnRyeVtdPjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZzQmFja3Vwc01hbmFnZXIge1xyXG4gIHB1YmxpYyBydW50aW1lRGF0YTogSVJ1bnRpbWVEYXRhIHwgbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBnZXRGc0VudHJpZXNSZXRyaWV2ZXIoXHJcbiAgICByb290RGlyUGF0aDogc3RyaW5nLFxyXG4gICAgZm9yRWFjaENoaWxkQ2FsbGJhY2s6IChcclxuICAgICAgaXRlbTogRnNFbnRyeSxcclxuICAgICAgaWR4OiBudW1iZXIsXHJcbiAgICAgIGFycjogRnNFbnRyeVtdXHJcbiAgICApID0+IFByb21pc2U8dm9pZD5cclxuICApIHtcclxuICAgIHRoaXMudGhyb3dJZlByb3BzTm90SW5pdGlhbGl6ZWQoKTtcclxuXHJcbiAgICBjb25zdCBmc0VudHJpZXNSZXRyaWV2ZXIgPSBuZXcgRnNFbnRyaWVzUmV0cmlldmVyKFxyXG4gICAgICByb290RGlyUGF0aCxcclxuICAgICAgXCJcIixcclxuICAgICAgdGhpcy5ydW50aW1lRGF0YS5kaXJTZXBTdHIsXHJcbiAgICAgIHRoaXMucnVudGltZURhdGEuZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyLFxyXG4gICAgICBmb3JFYWNoQ2hpbGRDYWxsYmFja1xyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZnNFbnRyaWVzUmV0cmlldmVyO1xyXG4gIH1cclxuXHJcbiAgdGhyb3dJZlByb3BzTm90SW5pdGlhbGl6ZWQoKSB7XHJcbiAgICBpZiAoIXRoaXMucnVudGltZURhdGEpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgcnVudGltZURhdGEgbXVzdCBiZSBzZXRgKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMucnVudGltZURhdGEuZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHJ1bnRpbWVEYXRhLmZvbGRlckZzRW50cmllc1JldHJpZXZlciBtdXN0IGJlIHNldGApO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5ydW50aW1lRGF0YS5kaXJTZXBTdHIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgcnVudGltZURhdGEuZGlyU2VwU3RyIG11c3QgYmUgc2V0YCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZnNCYWNrdXBzTWFuYWdlciA9IG5ldyBGc0JhY2t1cHNNYW5hZ2VyKCk7XHJcbiIsImltcG9ydCB7IElGc0VudHJ5LCBGc0VudHJ5IH0gZnJvbSBcIi4vRnNFbnRyeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZzRW50cmllc1JldHJpZXZlciB7XHJcbiAgcmVhZG9ubHkgcm9vdFBhdGg6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICByZWFkb25seSByb290UGFyZW50UGF0aDogc3RyaW5nLFxyXG4gICAgcmVhZG9ubHkgcm9vdERpck5hbWU6IHN0cmluZyxcclxuICAgIHJlYWRvbmx5IGRpclNlcFN0ciA9IFwiL1wiLFxyXG4gICAgcmVhZG9ubHkgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyOiAoXHJcbiAgICAgIGRpclBhdGg6IHN0cmluZyxcclxuICAgICAgZGlyU2VwOiBzdHJpbmdcclxuICAgICkgPT4gUHJvbWlzZTxJRnNFbnRyeVtdPixcclxuICAgIHJlYWRvbmx5IGZvckVhY2hDaGlsZENhbGxiYWNrOiAoXHJcbiAgICAgIGl0ZW06IEZzRW50cnksXHJcbiAgICAgIGlkeDogbnVtYmVyLFxyXG4gICAgICBhcnI6IEZzRW50cnlbXVxyXG4gICAgKSA9PiBQcm9taXNlPHZvaWQ+XHJcbiAgKSB7XHJcbiAgICB0aGlzLnJvb3RQYXRoID0gW3Jvb3RQYXJlbnRQYXRoLCByb290RGlyTmFtZV0uam9pbihkaXJTZXBTdHIpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHJ1bigpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxGc0VudHJ5PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHJvb3RGb2xkZXIgPSBuZXcgRnNFbnRyeShcclxuICAgICAgICBudWxsLFxyXG4gICAgICAgIHRoaXMucm9vdFBhcmVudFBhdGgsXHJcbiAgICAgICAgdGhpcy5yb290RGlyTmFtZSxcclxuICAgICAgICB0aGlzLmRpclNlcFN0cixcclxuICAgICAgICB0aGlzLmZvbGRlckZzRW50cmllc1JldHJpZXZlclxyXG4gICAgICApO1xyXG5cclxuICAgICAgbGV0IHJlc29sdmVkID0gZmFsc2U7XHJcblxyXG4gICAgICByb290Rm9sZGVyLnJlc29sdmVkLnB1c2goKHJvb3RGb2xkZXIpID0+IHtcclxuICAgICAgICBpZiAoIXJlc29sdmVkKSB7XHJcbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XHJcbiAgICAgICAgICByZXNvbHZlKHJvb3RGb2xkZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByb290Rm9sZGVyLmZvckVhY2hDaGlsZCh0aGlzLmZvckVhY2hDaGlsZENhbGxiYWNrKS50aGVuKFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgIGlmICghcmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXNvbHZlKHJvb3RGb2xkZXIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKHJlYXNvbikgPT4gcmVqZWN0KHJlYXNvbilcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSBcInRybXJrXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElGc0VudHJ5IHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgaXNGb2xkZXI6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZXRyaWV2ZUZzRW50cmllcyA9IGFzeW5jIChcclxuICBwYXJlbnQ6IEZzRW50cnkgfCBudWxsLFxyXG4gIHBhcmVudERpclBhdGg6IHN0cmluZyxcclxuICBkaXJTZXBTdHI6IHN0cmluZyxcclxuICBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXI6IChcclxuICAgIGRpclBhdGg6IHN0cmluZyxcclxuICAgIGRpclNlcDogc3RyaW5nXHJcbiAgKSA9PiBQcm9taXNlPElGc0VudHJ5W10+XHJcbikgPT4ge1xyXG4gIGNvbnN0IGNoaWxkRW50cmllc0FyciA9IGF3YWl0IGZvbGRlckZzRW50cmllc1JldHJpZXZlcihcclxuICAgIHBhcmVudERpclBhdGgsXHJcbiAgICBkaXJTZXBTdHJcclxuICApO1xyXG5cclxuICBjb25zdCBjaGlsZE5vZGVzID0gY2hpbGRFbnRyaWVzQXJyLm1hcChcclxuICAgIChlbnRyeSkgPT5cclxuICAgICAgbmV3IEZzRW50cnkoXHJcbiAgICAgICAgcGFyZW50LFxyXG4gICAgICAgIHBhcmVudERpclBhdGgsXHJcbiAgICAgICAgZW50cnkubmFtZSxcclxuICAgICAgICBkaXJTZXBTdHIsXHJcbiAgICAgICAgZW50cnkuaXNGb2xkZXIgPyBmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXIgOiBudWxsXHJcbiAgICAgIClcclxuICApO1xyXG5cclxuICByZXR1cm4gY2hpbGROb2RlcztcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBGc0VudHJ5IGltcGxlbWVudHMgSUZzRW50cnkge1xyXG4gIHB1YmxpYyByZWFkb25seSBpc0ZvbGRlcjogYm9vbGVhbjtcclxuICBwdWJsaWMgY2hpbGROb2RlczogRnNFbnRyeVtdIHwgbnVsbDtcclxuXHJcbiAgcHVibGljIGlzSW5jbHVkZWQgPSBmYWxzZTtcclxuICBwdWJsaWMgaXNFeGNsdWRlZCA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1Jlc29sdmVkID0gZmFsc2U7XHJcblxyXG4gIHB1YmxpYyByZXNvbHZlZDogKChmc0VudHJ5OiBGc0VudHJ5KSA9PiB2b2lkKVtdID0gW107XHJcblxyXG4gIHB1YmxpYyBmc1BhdGg6IHN0cmluZyB8IG51bGw7XHJcblxyXG4gIHByaXZhdGUgcmVhZG9ubHkgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyOiAoXHJcbiAgICBkaXJQYXRoOiBzdHJpbmcsXHJcbiAgICBkaXJTZXA6IHN0cmluZ1xyXG4gICkgPT4gUHJvbWlzZTxJRnNFbnRyeVtdPjtcclxuXHJcbiAgcHJpdmF0ZSBjaGlsZHJlbkNvdW50ID0gLTE7XHJcbiAgcHJpdmF0ZSByZXNvbHZlZENoaWxkcmVuQ291bnQgPSAtMTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50OiBGc0VudHJ5IHwgbnVsbCxcclxuICAgIHB1YmxpYyByZWFkb25seSBwYXJlbnREaXJQYXRoOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxyXG4gICAgcHVibGljIHJlYWRvbmx5IGRpclNlcFN0ciA9IFwiL1wiLFxyXG4gICAgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyOlxyXG4gICAgICB8ICgoZGlyUGF0aDogc3RyaW5nLCBkaXJTZXA6IHN0cmluZykgPT4gUHJvbWlzZTxJRnNFbnRyeVtdPilcclxuICAgICAgfCBudWxsXHJcbiAgKSB7XHJcbiAgICB0aGlzLmlzRm9sZGVyID0gISFmb2xkZXJGc0VudHJpZXNSZXRyaWV2ZXI7XHJcbiAgICB0aGlzLmNoaWxkTm9kZXMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyID1cclxuICAgICAgZm9sZGVyRnNFbnRyaWVzUmV0cmlldmVyID8/XHJcbiAgICAgIChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGluZyB0aGlzIG1ldGhvZCBvbiBhIGZpbGUgZW50cnkgaXMgbm90IGFsbG93ZWRcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzUm9vdEZvbGRlcigpIHtcclxuICAgIGNvbnN0IGlzUm9vdEZvbGRlciA9ICF0aGlzLnBhcmVudDtcclxuICAgIHJldHVybiBpc1Jvb3RGb2xkZXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNSb290TGV2ZWwoKSB7XHJcbiAgICBjb25zdCBpc1Jvb3RMZXZlbCA9IHRoaXMucGFyZW50LmlzUm9vdEZvbGRlcjtcclxuICAgIHJldHVybiBpc1Jvb3RMZXZlbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBmb3JFYWNoQ2hpbGQoXHJcbiAgICBjYWxsYmFjazogKGl0ZW06IEZzRW50cnksIGlkeDogbnVtYmVyLCBhcnI6IEZzRW50cnlbXSkgPT4gUHJvbWlzZTx2b2lkPlxyXG4gICkge1xyXG4gICAgYXdhaXQgdGhpcy5hc3N1cmVDaGlsZHJlblJldHJpZXZlZCgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGF3YWl0IGNhbGxiYWNrKHRoaXMuY2hpbGROb2Rlc1tpXSwgaSwgdGhpcy5jaGlsZE5vZGVzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBpbmNsdWRlKGRlcHRoID0gMCkge1xyXG4gICAgdGhpcy5pc0luY2x1ZGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuaXNFeGNsdWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGxldCByZXNvbHZlID0gIXRoaXMuaXNGb2xkZXI7XHJcblxyXG4gICAgaWYgKCFyZXNvbHZlKSB7XHJcbiAgICAgIGlmIChkZXB0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBuZXh0RGVwdGggPSBkZXB0aCAtIDE7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMuZm9yRWFjaENoaWxkKGFzeW5jIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICBhd2FpdCBpdGVtLmluY2x1ZGUobmV4dERlcHRoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhd2FpdCB0aGlzLmFzc3VyZUNoaWxkcmVuUmV0cmlldmVkKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc29sdmUgPSBkZXB0aCA+PSAwICYmIHRoaXMuY2hpbGRyZW5Db3VudCA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXRoaXMucGFyZW50LmlzSW5jbHVkZWQpIHtcclxuICAgICAgdGhpcy5wYXJlbnQuaW5jbHVkZShkZXB0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc29sdmUpIHtcclxuICAgICAgdGhpcy5yZXNvbHZlSWZSZXEoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBleGNsdWRlKCkge1xyXG4gICAgdGhpcy5pc0V4Y2x1ZGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuaXNJbmNsdWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMucmVzb2x2ZUlmUmVxKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXhjbHVkZVVucmVzb2x2ZWQoKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNSZXNvbHZlZCkge1xyXG4gICAgICBpZiAoIXRoaXMuaXNGb2xkZXIpIHtcclxuICAgICAgICB0aGlzLmV4Y2x1ZGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvbHZlZENoaWxkcmVuQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICBmb3JFYWNoKHRoaXMuY2hpbGROb2RlcywgKGNoaWxkSXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNoaWxkSXRlbS5pc1Jlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgY2hpbGRJdGVtLmV4Y2x1ZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc0luY2x1ZGVkKSB7XHJcbiAgICAgICAgICB0aGlzLmV4Y2x1ZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZXNvbHZlSWZSZXEoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgcmV0cmlldmVDaGlsZHJlbigpOiBQcm9taXNlPFtGc0VudHJ5W10sIG51bWJlcl0+IHtcclxuICAgIHRoaXMuZnNQYXRoID8/PSBbdGhpcy5wYXJlbnREaXJQYXRoLCB0aGlzLm5hbWVdLmpvaW4odGhpcy5kaXJTZXBTdHIpO1xyXG5cclxuICAgIGNvbnN0IGNoaWxkTm9kZXMgPSBhd2FpdCByZXRyaWV2ZUZzRW50cmllcyhcclxuICAgICAgdGhpcyxcclxuICAgICAgdGhpcy5mc1BhdGgsXHJcbiAgICAgIHRoaXMuZGlyU2VwU3RyLFxyXG4gICAgICB0aGlzLmZvbGRlckZzRW50cmllc1JldHJpZXZlclxyXG4gICAgKTtcclxuXHJcbiAgICBmb3JFYWNoKGNoaWxkTm9kZXMsIChpdGVtKSA9PiB7XHJcbiAgICAgIGl0ZW0ucmVzb2x2ZWQucHVzaCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlZENoaWxkcmVuQ291bnQrKztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZWRDaGlsZHJlbkNvdW50ID49IHRoaXMuY2hpbGRyZW5Db3VudCkge1xyXG4gICAgICAgICAgdGhpcy5yZXNvbHZlSWZSZXEoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIFtjaGlsZE5vZGVzLCBjaGlsZE5vZGVzLmxlbmd0aF07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGFzc3VyZUNoaWxkcmVuUmV0cmlldmVkKCkge1xyXG4gICAgaWYgKCF0aGlzLmNoaWxkTm9kZXMpIHtcclxuICAgICAgY29uc3QgW2NoaWxkTm9kZXMsIGNoaWxkcmVuQ291bnRdID0gYXdhaXQgdGhpcy5yZXRyaWV2ZUNoaWxkcmVuKCk7XHJcblxyXG4gICAgICB0aGlzLmNoaWxkTm9kZXMgPSBjaGlsZE5vZGVzO1xyXG4gICAgICB0aGlzLmNoaWxkcmVuQ291bnQgPSBjaGlsZHJlbkNvdW50O1xyXG4gICAgICB0aGlzLnJlc29sdmVkQ2hpbGRyZW5Db3VudCA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlc29sdmVJZlJlcSgpIHtcclxuICAgIGNvbnN0IHJlc29sdmUgPSAhdGhpcy5pc1Jlc29sdmVkO1xyXG5cclxuICAgIGlmIChyZXNvbHZlKSB7XHJcbiAgICAgIHRoaXMucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXNvbHZlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZXNvbHZlKCkge1xyXG4gICAgdGhpcy5pc1Jlc29sdmVkID0gdHJ1ZTtcclxuICAgIHRoaXMub25SZXNvbHZlZCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvblJlc29sdmVkKCkge1xyXG4gICAgZm9yIChsZXQgc3Vic2NyaXB0aW9uIG9mIHRoaXMucmVzb2x2ZWQpIHtcclxuICAgICAgc3Vic2NyaXB0aW9uKHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgKiBmcm9tIFwiLi9zcmMvY29yZVwiO1xyXG4iLCJleHBvcnQgY29uc3QgYWxsV3NSZWdleCA9IC9eXFxzKyQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBpc05vbkVtcHR5U3RyID0gKGFyZzogc3RyaW5nIHwgYW55LCBhbGxXc1NhbWVBc0VtcHR5ID0gZmFsc2UpID0+IHtcclxuICBsZXQgcmV0VmFsID0gXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGFyZztcclxuICByZXRWYWwgPSByZXRWYWwgJiYgYXJnICE9PSBcIlwiO1xyXG5cclxuICBpZiAocmV0VmFsICYmIGFsbFdzU2FtZUFzRW1wdHkpIHtcclxuICAgIHJldFZhbCA9IGFsbFdzUmVnZXgudGVzdChhcmcpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBmb3JFYWNoID0gPFQ+KFxyXG4gIGFycjogVFtdLFxyXG4gIGNhbGxiYWNrOiAoaXRlbTogVCwgaWR4OiBudW1iZXIsIGFycjogVFtdKSA9PiBib29sZWFuIHwgdm9pZFxyXG4pID0+IHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGNhbGxiYWNrKGFycltpXSwgaSwgYXJyKSA9PT0gZmFsc2UpIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbnRhaW5zID0gPFQ+KGFycjogVFtdLCBpdGVtOiBUKSA9PiBhcnIuaW5kZXhPZihpdGVtKSA+PSAwO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFueSA9IDxUPihcclxuICBhcnI6IFRbXSxcclxuICBwcmVkaWNhdGU6IChpdGVtOiBULCBpZHg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gYm9vbGVhblxyXG4pID0+IGFyci5maWx0ZXIocHJlZGljYXRlKS5sZW5ndGggPj0gMDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwidmFyIHdlYnBhY2tRdWV1ZXMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIHF1ZXVlc1wiKSA6IFwiX193ZWJwYWNrX3F1ZXVlc19fXCI7XG52YXIgd2VicGFja0V4cG9ydHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGV4cG9ydHNcIikgOiBcIl9fd2VicGFja19leHBvcnRzX19cIjtcbnZhciB3ZWJwYWNrRXJyb3IgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGVycm9yXCIpIDogXCJfX3dlYnBhY2tfZXJyb3JfX1wiO1xudmFyIHJlc29sdmVRdWV1ZSA9IChxdWV1ZSkgPT4ge1xuXHRpZihxdWV1ZSAmJiBxdWV1ZS5kIDwgMSkge1xuXHRcdHF1ZXVlLmQgPSAxO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tKSk7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0gPyBmbi5yKysgOiBmbigpKSk7XG5cdH1cbn1cbnZhciB3cmFwRGVwcyA9IChkZXBzKSA9PiAoZGVwcy5tYXAoKGRlcCkgPT4ge1xuXHRpZihkZXAgIT09IG51bGwgJiYgdHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmKGRlcFt3ZWJwYWNrUXVldWVzXSkgcmV0dXJuIGRlcDtcblx0XHRpZihkZXAudGhlbikge1xuXHRcdFx0dmFyIHF1ZXVlID0gW107XG5cdFx0XHRxdWV1ZS5kID0gMDtcblx0XHRcdGRlcC50aGVuKChyKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXhwb3J0c10gPSByO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSwgKGUpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFcnJvcl0gPSBlO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgb2JqID0ge307XG5cdFx0XHRvYmpbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChmbihxdWV1ZSkpO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9XG5cdH1cblx0dmFyIHJldCA9IHt9O1xuXHRyZXRbd2VicGFja1F1ZXVlc10gPSB4ID0+IHt9O1xuXHRyZXRbd2VicGFja0V4cG9ydHNdID0gZGVwO1xuXHRyZXR1cm4gcmV0O1xufSkpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5hID0gKG1vZHVsZSwgYm9keSwgaGFzQXdhaXQpID0+IHtcblx0dmFyIHF1ZXVlO1xuXHRoYXNBd2FpdCAmJiAoKHF1ZXVlID0gW10pLmQgPSAtMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiBxdWV1ZS5kIDwgMCAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
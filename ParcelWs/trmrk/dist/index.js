
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $8a29e9b0d3dc349c$exports = {};

$parcel$export($8a29e9b0d3dc349c$exports, "allWsRegex", () => $8a29e9b0d3dc349c$export$13fee8e9430c8208);
$parcel$export($8a29e9b0d3dc349c$exports, "isNonEmptyStr", () => $8a29e9b0d3dc349c$export$3030f957b72eb0a);
$parcel$export($8a29e9b0d3dc349c$exports, "findKvp", () => $8a29e9b0d3dc349c$export$3c98c05de17f0b14);
$parcel$export($8a29e9b0d3dc349c$exports, "forEach", () => $8a29e9b0d3dc349c$export$4b80e395e36b5a56);
$parcel$export($8a29e9b0d3dc349c$exports, "contains", () => $8a29e9b0d3dc349c$export$2344b14b097df817);
$parcel$export($8a29e9b0d3dc349c$exports, "any", () => $8a29e9b0d3dc349c$export$4154a199d7d90455);
$parcel$export($8a29e9b0d3dc349c$exports, "containsAnyOfArr", () => $8a29e9b0d3dc349c$export$f91dc717b0dd7bf0);
$parcel$export($8a29e9b0d3dc349c$exports, "containsAnyOfMx", () => $8a29e9b0d3dc349c$export$b474669d74d71e4a);
const $8a29e9b0d3dc349c$export$13fee8e9430c8208 = /^\s+$/g;
const $8a29e9b0d3dc349c$export$3030f957b72eb0a = (arg, allWsSameAsEmpty = false)=>{
    let retVal = "string" === typeof arg;
    retVal = retVal && arg !== "";
    if (retVal && allWsSameAsEmpty) retVal = !$8a29e9b0d3dc349c$export$13fee8e9430c8208.test(arg);
    return retVal;
};
const $8a29e9b0d3dc349c$export$3c98c05de17f0b14 = (arr, predicate)=>{
    let retIdx = -1;
    let retVal = null;
    for(let i = 0; i < arr.length; i++){
        const val = arr[i];
        if (predicate(val, i, arr)) {
            retIdx = i;
            retVal = val;
            break;
        }
    }
    const retKvp = {
        key: retIdx,
        value: retVal
    };
    return retKvp;
};
const $8a29e9b0d3dc349c$export$4b80e395e36b5a56 = (arr, callback)=>{
    for(let i = 0; i < arr.length; i++){
        if (callback(arr[i], i, arr) === false) break;
    }
};
const $8a29e9b0d3dc349c$export$2344b14b097df817 = (arr, item)=>arr.indexOf(item) >= 0;
const $8a29e9b0d3dc349c$export$4154a199d7d90455 = (arr, predicate)=>arr.filter(predicate).length >= 0;
const $8a29e9b0d3dc349c$export$f91dc717b0dd7bf0 = (inStr, strArr, matching)=>{
    matching ??= {
        value: {
            key: -1,
            value: null
        }
    };
    const kvp = $8a29e9b0d3dc349c$export$3c98c05de17f0b14(strArr, (chr)=>inStr.indexOf(chr) >= 0);
    const retVal = kvp.key >= 0;
    if (retVal) matching.value = kvp;
    return retVal;
};
const $8a29e9b0d3dc349c$export$b474669d74d71e4a = (inStr, strMx, matching)=>{
    matching ??= {
        value: {
            key: -1,
            value: {
                key: -1,
                value: null
            }
        }
    };
    const innerMatching = {};
    const kvp = $8a29e9b0d3dc349c$export$3c98c05de17f0b14(strMx, (strArr)=>$8a29e9b0d3dc349c$export$f91dc717b0dd7bf0(inStr, strArr, innerMatching));
    const retVal = kvp.key >= 0;
    if (retVal) matching.value = {
        key: kvp.key,
        value: innerMatching.value
    };
    return retVal;
};


var $a882c2048fe78c44$exports = {};

$parcel$export($a882c2048fe78c44$exports, "FileType", () => $a882c2048fe78c44$export$c5ae10d7c88c4d3e);
$parcel$export($a882c2048fe78c44$exports, "OfficeLikeFileType", () => $a882c2048fe78c44$export$2e910997dedc30fc);
var $a882c2048fe78c44$export$c5ae10d7c88c4d3e;
(function(FileType) {
    FileType[FileType["plainText"] = 1] = "plainText";
    FileType[FileType["document"] = 2] = "document";
    FileType[FileType["image"] = 3] = "image";
    FileType[FileType["audio"] = 4] = "audio";
    FileType[FileType["video"] = 5] = "video";
    FileType[FileType["code"] = 6] = "code";
    FileType[FileType["binary"] = 7] = "binary";
    FileType[FileType["zippedFolder"] = 8] = "zippedFolder";
})($a882c2048fe78c44$export$c5ae10d7c88c4d3e || ($a882c2048fe78c44$export$c5ae10d7c88c4d3e = {}));
var $a882c2048fe78c44$export$2e910997dedc30fc;
(function(OfficeLikeFileType) {
    OfficeLikeFileType[OfficeLikeFileType["word"] = 1] = "word";
    OfficeLikeFileType[OfficeLikeFileType["excel"] = 2] = "excel";
    OfficeLikeFileType[OfficeLikeFileType["powerPoint"] = 3] = "powerPoint";
})($a882c2048fe78c44$export$2e910997dedc30fc || ($a882c2048fe78c44$export$2e910997dedc30fc = {}));


var $9d7b85785d6def69$exports = {};

$parcel$export($9d7b85785d6def69$exports, "CmdCommand", () => $9d7b85785d6def69$export$a143f2d68edec972);
$parcel$export($9d7b85785d6def69$exports, "getCommand", () => $9d7b85785d6def69$export$36c020ba2f6f2a3b);
$parcel$export($9d7b85785d6def69$exports, "getCmd", () => $9d7b85785d6def69$export$7d06496ff280727a);
var $9d7b85785d6def69$export$a143f2d68edec972;
(function(CmdCommand) {
    CmdCommand[CmdCommand["Help"] = 1] = "Help";
    CmdCommand[CmdCommand["ListNotes"] = 2] = "ListNotes";
    CmdCommand[CmdCommand["CreateNoteBook"] = 3] = "CreateNoteBook";
    CmdCommand[CmdCommand["CreateNoteBookInternal"] = 4] = "CreateNoteBookInternal";
    CmdCommand[CmdCommand["CreateNote"] = 5] = "CreateNote";
    CmdCommand[CmdCommand["CreateNoteInternal"] = 6] = "CreateNoteInternal";
    CmdCommand[CmdCommand["CopyNotes"] = 7] = "CopyNotes";
    CmdCommand[CmdCommand["DeleteNotes"] = 8] = "DeleteNotes";
    CmdCommand[CmdCommand["MoveNotes"] = 9] = "MoveNotes";
    CmdCommand[CmdCommand["RenameNote"] = 10] = "RenameNote";
    CmdCommand[CmdCommand["UpdateNote"] = 11] = "UpdateNote";
    CmdCommand[CmdCommand["ReorderNotes"] = 12] = "ReorderNotes";
    CmdCommand[CmdCommand["NormalizeNote"] = 13] = "NormalizeNote";
    CmdCommand[CmdCommand["NormalizeNoteIdxes"] = 14] = "NormalizeNoteIdxes";
    CmdCommand[CmdCommand["NormalizeNotesHcy"] = 15] = "NormalizeNotesHcy";
})($9d7b85785d6def69$export$a143f2d68edec972 || ($9d7b85785d6def69$export$a143f2d68edec972 = {}));
const $9d7b85785d6def69$export$36c020ba2f6f2a3b = (commandsMap, cmd)=>{
    const cmdName = $9d7b85785d6def69$export$a143f2d68edec972[cmd];
    const cmdVal = commandsMap[cmdName];
    return cmdVal;
};
const $9d7b85785d6def69$export$7d06496ff280727a = (noteDirPairs, cmd)=>$9d7b85785d6def69$export$36c020ba2f6f2a3b(noteDirPairs.argOpts.commandsMap, cmd);


var $b461adad17b0f1dc$exports = {};

$parcel$export($b461adad17b0f1dc$exports, "DirType", () => $b461adad17b0f1dc$export$eff09ab3cc9d4cbf);
$parcel$export($b461adad17b0f1dc$exports, "DirCategory", () => $b461adad17b0f1dc$export$9433409b6bb670dd);
$parcel$export($b461adad17b0f1dc$exports, "InternalDir", () => $b461adad17b0f1dc$export$fa201a2b0068b111);
var $b461adad17b0f1dc$export$eff09ab3cc9d4cbf;
(function(DirType) {
    DirType[DirType["shortName"] = 0] = "shortName";
    DirType[DirType["fullName"] = 1] = "fullName";
})($b461adad17b0f1dc$export$eff09ab3cc9d4cbf || ($b461adad17b0f1dc$export$eff09ab3cc9d4cbf = {}));
var $b461adad17b0f1dc$export$9433409b6bb670dd;
(function(DirCategory) {
    DirCategory[DirCategory["item"] = 0] = "item";
    DirCategory[DirCategory["internals"] = 1] = "internals";
})($b461adad17b0f1dc$export$9433409b6bb670dd || ($b461adad17b0f1dc$export$9433409b6bb670dd = {}));
var $b461adad17b0f1dc$export$fa201a2b0068b111;
(function(InternalDir) {
    InternalDir[InternalDir["root"] = 1] = "root";
    InternalDir[InternalDir["internals"] = 2] = "internals";
    InternalDir[InternalDir["files"] = 3] = "files";
})($b461adad17b0f1dc$export$fa201a2b0068b111 || ($b461adad17b0f1dc$export$fa201a2b0068b111 = {}));


var $da4a5bceb28a75f4$exports = {};

$parcel$export($da4a5bceb28a75f4$exports, "trmrkPathSep", () => $da4a5bceb28a75f4$export$ddce135627aa7407);
$parcel$export($da4a5bceb28a75f4$exports, "trmrkPathStartTkn", () => $da4a5bceb28a75f4$export$b6d8eb2eccdcbac2);
$parcel$export($da4a5bceb28a75f4$exports, "trmrkHomePathTkn", () => $da4a5bceb28a75f4$export$55931b541cf741a5);
$parcel$export($da4a5bceb28a75f4$exports, "trmrkHomePathStr", () => $da4a5bceb28a75f4$export$467a08a4d688caf8);
$parcel$export($da4a5bceb28a75f4$exports, "trmrkHomePathStartStr", () => $da4a5bceb28a75f4$export$d6e2f80be5df35b5);
$parcel$export($da4a5bceb28a75f4$exports, "getPath", () => $da4a5bceb28a75f4$export$2aa3fd96c49a84a8);
$parcel$export($da4a5bceb28a75f4$exports, "PathValidationErrCode", () => $da4a5bceb28a75f4$export$b49b0bc5eb3b1a33);
$parcel$export($da4a5bceb28a75f4$exports, "dfPathValidationResult", () => $da4a5bceb28a75f4$export$d46c69ed7af495dc);
$parcel$export($da4a5bceb28a75f4$exports, "createInvalidSeqncs", () => $da4a5bceb28a75f4$export$80dbc49a898ba48a);
$parcel$export($da4a5bceb28a75f4$exports, "baseInvalidSeqncs", () => $da4a5bceb28a75f4$export$d9302570008d1766);
$parcel$export($da4a5bceb28a75f4$exports, "winInvalidSeqncs", () => $da4a5bceb28a75f4$export$1ff14a36e55f78e6);
$parcel$export($da4a5bceb28a75f4$exports, "unixInvalidSeqncs", () => $da4a5bceb28a75f4$export$4ffbc2eea9e3ffc8);
$parcel$export($da4a5bceb28a75f4$exports, "getInvalidSeqncs", () => $da4a5bceb28a75f4$export$e7713dfd0e597612);
$parcel$export($da4a5bceb28a75f4$exports, "normalizeIfNetworkPath", () => $da4a5bceb28a75f4$export$81a72685d2c34c90);
$parcel$export($da4a5bceb28a75f4$exports, "normalizeIfRelPath", () => $da4a5bceb28a75f4$export$cd87191c1e1c7eb2);
$parcel$export($da4a5bceb28a75f4$exports, "checkPathNotContainsInvalidChars", () => $da4a5bceb28a75f4$export$c642c38e375a18d0);
$parcel$export($da4a5bceb28a75f4$exports, "isValidRootedPathCore", () => $da4a5bceb28a75f4$export$918bf71becaac866);
$parcel$export($da4a5bceb28a75f4$exports, "isValidRootedPath", () => $da4a5bceb28a75f4$export$6cf6c0d5db218816);
$parcel$export($da4a5bceb28a75f4$exports, "isValidRootedFsPath", () => $da4a5bceb28a75f4$export$c826ebdf7fe7b4cf);
$parcel$export($da4a5bceb28a75f4$exports, "isValidPath", () => $da4a5bceb28a75f4$export$a678af82bf766611);
$parcel$export($da4a5bceb28a75f4$exports, "isValidFsPath", () => $da4a5bceb28a75f4$export$efa466c206370b95);

const $da4a5bceb28a75f4$export$ddce135627aa7407 = "/";
const $da4a5bceb28a75f4$export$b6d8eb2eccdcbac2 = "<";
const $da4a5bceb28a75f4$export$55931b541cf741a5 = "~";
const $da4a5bceb28a75f4$export$467a08a4d688caf8 = [
    $da4a5bceb28a75f4$export$b6d8eb2eccdcbac2,
    $da4a5bceb28a75f4$export$55931b541cf741a5
].join("");
const $da4a5bceb28a75f4$export$d6e2f80be5df35b5 = [
    $da4a5bceb28a75f4$export$467a08a4d688caf8,
    $da4a5bceb28a75f4$export$ddce135627aa7407
].join("");
const $da4a5bceb28a75f4$export$2aa3fd96c49a84a8 = (pathParts, relToTrmrkHome = null)=>{
    const partsArr = [
        ...pathParts
    ];
    if (typeof relToTrmrkHome === "boolean") {
        if ((0, $8a29e9b0d3dc349c$export$3030f957b72eb0a)(partsArr[0])) partsArr.splice(0, 0, "");
        if (relToTrmrkHome === true) partsArr[0] = $da4a5bceb28a75f4$export$467a08a4d688caf8;
    }
    const path = partsArr.join($da4a5bceb28a75f4$export$ddce135627aa7407);
    return path;
};
var $da4a5bceb28a75f4$export$b49b0bc5eb3b1a33;
(function(PathValidationErrCode) {
    PathValidationErrCode[PathValidationErrCode["None"] = 0] = "None";
    PathValidationErrCode[PathValidationErrCode["NullOrEmpty"] = 1] = "NullOrEmpty";
    PathValidationErrCode[PathValidationErrCode["InvalidPathChars"] = 2] = "InvalidPathChars";
    PathValidationErrCode[PathValidationErrCode["IsNotRooted"] = 3] = "IsNotRooted";
})($da4a5bceb28a75f4$export$b49b0bc5eb3b1a33 || ($da4a5bceb28a75f4$export$b49b0bc5eb3b1a33 = {}));
const $da4a5bceb28a75f4$export$d46c69ed7af495dc = ()=>({
        isValid: false,
        errCode: 0,
        invalidChar: {
            key: -1,
            value: null
        }
    });
const $da4a5bceb28a75f4$export$80dbc49a898ba48a = (sep, opSep)=>[
        opSep,
        sep + sep,
        sep + " ",
        " " + sep,
        sep + ".",
        "." + sep
    ];
const $da4a5bceb28a75f4$export$d9302570008d1766 = Object.freeze([
    "  ",
    " .",
    "..",
    ". "
]);
const $da4a5bceb28a75f4$export$1ff14a36e55f78e6 = Object.freeze($da4a5bceb28a75f4$export$80dbc49a898ba48a("\\", "/"));
const $da4a5bceb28a75f4$export$4ffbc2eea9e3ffc8 = Object.freeze($da4a5bceb28a75f4$export$80dbc49a898ba48a("/", "\\"));
const $da4a5bceb28a75f4$export$e7713dfd0e597612 = (isWinOs)=>isWinOs ? $da4a5bceb28a75f4$export$1ff14a36e55f78e6 : $da4a5bceb28a75f4$export$4ffbc2eea9e3ffc8;
const $da4a5bceb28a75f4$export$81a72685d2c34c90 = (path, sep, allowNetworkPath)=>{
    if (allowNetworkPath) {
        const dblSep = sep + sep;
        if (path.startsWith(dblSep)) path = path.substring(1);
    }
    return path;
};
const $da4a5bceb28a75f4$export$cd87191c1e1c7eb2 = (path, sep)=>{
    if (path.startsWith(".." + sep)) path = path.substring(2);
    else if (path.startsWith("." + sep)) path = path.substring(1);
    return path;
};
const $da4a5bceb28a75f4$export$c642c38e375a18d0 = (path, result, invalidStrMx)=>{
    let matching = {};
    if (!(result.isValid = !(0, $8a29e9b0d3dc349c$export$b474669d74d71e4a)(path, invalidStrMx, matching))) {
        result.errCode = 2;
        result.invalidChar = matching.value.value;
    }
    return result.isValid;
};
const $da4a5bceb28a75f4$export$918bf71becaac866 = (cfg, path, result)=>{
    if (!(result.isValid = (0, $8a29e9b0d3dc349c$export$3030f957b72eb0a)(path, true))) result.errCode = 1;
    else $da4a5bceb28a75f4$export$c642c38e375a18d0(path, result, [
        cfg.invalidFileNameChars,
        $da4a5bceb28a75f4$export$d9302570008d1766
    ]);
    return result.isValid;
};
const $da4a5bceb28a75f4$export$6cf6c0d5db218816 = (cfg, path, result = null, allowNetworkPath = true)=>{
    result ??= $da4a5bceb28a75f4$export$d46c69ed7af495dc();
    result.isValid = $da4a5bceb28a75f4$export$918bf71becaac866(cfg, path, result);
    if (result.isValid) {
        path = $da4a5bceb28a75f4$export$81a72685d2c34c90(path, cfg.pathSep, allowNetworkPath);
        if (!(result.isValid = path.startsWith("/") || path.startsWith($da4a5bceb28a75f4$export$d6e2f80be5df35b5))) result.errCode = 3;
    }
    if (result.isValid) $da4a5bceb28a75f4$export$c642c38e375a18d0(path, result, [
        $da4a5bceb28a75f4$export$4ffbc2eea9e3ffc8
    ]);
    return result.isValid;
};
const $da4a5bceb28a75f4$export$c826ebdf7fe7b4cf = (cfg, path, result = null, allowNetworkPath = true)=>{
    result ??= $da4a5bceb28a75f4$export$d46c69ed7af495dc();
    if (cfg.isWinOS) {
        if (result.isValid = /^[a-zA-Z]\:/.test(path)) path = path.substring(2);
        else result.isValid = path.startsWith("\\");
    } else result.isValid = path.startsWith("/");
    if (result.isValid) {
        path = $da4a5bceb28a75f4$export$81a72685d2c34c90(path, cfg.pathSep, allowNetworkPath);
        result.isValid = $da4a5bceb28a75f4$export$c642c38e375a18d0(path, result, [
            cfg.invalidFileNameChars,
            $da4a5bceb28a75f4$export$d9302570008d1766
        ]);
    } else result.errCode = 3;
    result.isValid = result.isValid && $da4a5bceb28a75f4$export$c642c38e375a18d0(path, result, [
        $da4a5bceb28a75f4$export$e7713dfd0e597612(cfg.isWinOS)
    ]);
    return result.isValid;
};
const $da4a5bceb28a75f4$export$a678af82bf766611 = (cfg, path, result = null, allowNetworkPath = true)=>{
    result ??= $da4a5bceb28a75f4$export$d46c69ed7af495dc();
    path = $da4a5bceb28a75f4$export$cd87191c1e1c7eb2(path, cfg.pathSep);
    result.isValid = $da4a5bceb28a75f4$export$6cf6c0d5db218816(cfg, path, result, allowNetworkPath);
    return result.isValid;
};
const $da4a5bceb28a75f4$export$efa466c206370b95 = (cfg, path, result = null, allowNetworkPath = true)=>{
    result ??= $da4a5bceb28a75f4$export$d46c69ed7af495dc();
    path = $da4a5bceb28a75f4$export$cd87191c1e1c7eb2(path, cfg.pathSep);
    result.isValid = $da4a5bceb28a75f4$export$c826ebdf7fe7b4cf(cfg, path, result, allowNetworkPath);
    return result.isValid;
};


var $f8f60f4f52a43c0a$exports = {};

$parcel$export($f8f60f4f52a43c0a$exports, "getBaseLocation", () => $f8f60f4f52a43c0a$export$523cb06ae22ee463);
const $f8f60f4f52a43c0a$export$523cb06ae22ee463 = ()=>{
    let baseLocation = [
        window.location.protocol,
        window.location.host
    ].join("//");
    return baseLocation;
};


class $e88c575431cecf47$export$f30ecd94ca77877e {
    static #_ = this.dfVal = BigInt(0);
    static #_1 = this.incVal = BigInt(1);
    constructor(dfTimeout){
        this.syncRoot = new BigInt64Array(1);
        this.dfTimeout = dfTimeout ?? undefined;
    }
    run(action, timeout) {
        return new Promise((resolve, reject)=>{
            if (Atomics.add(this.syncRoot, 0, $e88c575431cecf47$export$f30ecd94ca77877e.incVal) === $e88c575431cecf47$export$f30ecd94ca77877e.dfVal || Atomics.wait(this.syncRoot, 0, $e88c575431cecf47$export$f30ecd94ca77877e.dfVal, timeout ?? this.dfTimeout) !== "timed-out") action().then(()=>{
                Atomics.sub(this.syncRoot, 0, $e88c575431cecf47$export$f30ecd94ca77877e.incVal);
                resolve();
            }, (reason)=>{
                Atomics.sub(this.syncRoot, 0, $e88c575431cecf47$export$f30ecd94ca77877e.incVal);
                reject(reason);
            });
            else reject(new Error("While waiting for previously enqueued actions to finish their execution, more than the specified timeout has elapsed"));
        });
    }
    get(action) {
        return new Promise((resolve, reject)=>{
            let retVal = null;
            this.run(()=>new Promise((rslv, rjct)=>{
                    action().then((value)=>{
                        retVal = value;
                        rslv();
                    }, rjct);
                })).then(()=>{
                resolve(retVal);
            }, reject);
        });
    }
}


const $149c1bd638913645$export$b75f8c4f8f3fbd14 = {
    ...$8a29e9b0d3dc349c$exports,
    driveItem: $a882c2048fe78c44$exports,
    notesAppConfig: $9d7b85785d6def69$exports,
    notesItem: $b461adad17b0f1dc$exports,
    notesPath: $da4a5bceb28a75f4$exports,
    url: $f8f60f4f52a43c0a$exports
};
const $149c1bd638913645$export$f30ecd94ca77877e = (0, $e88c575431cecf47$export$f30ecd94ca77877e); // export type SyncLock = SyncLockT;


export {$149c1bd638913645$export$b75f8c4f8f3fbd14 as core, $149c1bd638913645$export$f30ecd94ca77877e as SyncLock};
//# sourceMappingURL=index.js.map

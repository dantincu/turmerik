(() => {

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
var $c9fa8fa2ea083dbf$exports = {};

$parcel$export($c9fa8fa2ea083dbf$exports, "allWsRegex", () => $c9fa8fa2ea083dbf$export$13fee8e9430c8208);
$parcel$export($c9fa8fa2ea083dbf$exports, "jsonBool", () => $c9fa8fa2ea083dbf$export$c0392ddaf39f4c0f);
$parcel$export($c9fa8fa2ea083dbf$exports, "getJsonBool", () => $c9fa8fa2ea083dbf$export$d34b50c22cf045a9);
$parcel$export($c9fa8fa2ea083dbf$exports, "isNotNullObj", () => $c9fa8fa2ea083dbf$export$f3866741a0567798);
$parcel$export($c9fa8fa2ea083dbf$exports, "isNonEmptyStr", () => $c9fa8fa2ea083dbf$export$3030f957b72eb0a);
$parcel$export($c9fa8fa2ea083dbf$exports, "findKvp", () => $c9fa8fa2ea083dbf$export$3c98c05de17f0b14);
$parcel$export($c9fa8fa2ea083dbf$exports, "forEach", () => $c9fa8fa2ea083dbf$export$4b80e395e36b5a56);
$parcel$export($c9fa8fa2ea083dbf$exports, "contains", () => $c9fa8fa2ea083dbf$export$2344b14b097df817);
$parcel$export($c9fa8fa2ea083dbf$exports, "any", () => $c9fa8fa2ea083dbf$export$4154a199d7d90455);
$parcel$export($c9fa8fa2ea083dbf$exports, "containsAnyOfArr", () => $c9fa8fa2ea083dbf$export$f91dc717b0dd7bf0);
$parcel$export($c9fa8fa2ea083dbf$exports, "containsAnyOfMx", () => $c9fa8fa2ea083dbf$export$b474669d74d71e4a);
$parcel$export($c9fa8fa2ea083dbf$exports, "forEachProp", () => $c9fa8fa2ea083dbf$export$5cde20adf95f713);
$parcel$export($c9fa8fa2ea083dbf$exports, "merge", () => $c9fa8fa2ea083dbf$export$4950aa0f605343fb);
$parcel$export($c9fa8fa2ea083dbf$exports, "filterAsync", () => $c9fa8fa2ea083dbf$export$30ee5c6810ce1ce2);
$parcel$export($c9fa8fa2ea083dbf$exports, "mapAsync", () => $c9fa8fa2ea083dbf$export$a939ddd3409bd57a);
$parcel$export($c9fa8fa2ea083dbf$exports, "findIdxAsync", () => $c9fa8fa2ea083dbf$export$69f2a614aa1972b7);
$parcel$export($c9fa8fa2ea083dbf$exports, "findAsync", () => $c9fa8fa2ea083dbf$export$4650fa2d799cbf63);
$parcel$export($c9fa8fa2ea083dbf$exports, "withVal", () => $c9fa8fa2ea083dbf$export$5b60df21e72b9cdb);
$parcel$export($c9fa8fa2ea083dbf$exports, "subStr", () => $c9fa8fa2ea083dbf$export$2ca8acdb52d6facf);
$parcel$export($c9fa8fa2ea083dbf$exports, "trimStr", () => $c9fa8fa2ea083dbf$export$457d92f283ecacb0);
$parcel$export($c9fa8fa2ea083dbf$exports, "capitalizeFirstLetter", () => $c9fa8fa2ea083dbf$export$d07f57595c356899);
const $c9fa8fa2ea083dbf$export$13fee8e9430c8208 = /^\s+$/g;
const $c9fa8fa2ea083dbf$export$c0392ddaf39f4c0f = Object.freeze({
    false: JSON.stringify(false),
    true: JSON.stringify(true)
});
const $c9fa8fa2ea083dbf$export$d34b50c22cf045a9 = (value)=>value ? $c9fa8fa2ea083dbf$export$c0392ddaf39f4c0f.true : $c9fa8fa2ea083dbf$export$c0392ddaf39f4c0f.false;
const $c9fa8fa2ea083dbf$export$f3866741a0567798 = (arg)=>{
    let retVal = "object" === typeof arg;
    retVal = retVal && arg !== null;
    return retVal;
};
const $c9fa8fa2ea083dbf$export$3030f957b72eb0a = (arg, allWsSameAsEmpty = false)=>{
    let retVal = "string" === typeof arg;
    retVal = retVal && arg !== "";
    if (retVal && allWsSameAsEmpty) retVal = !$c9fa8fa2ea083dbf$export$13fee8e9430c8208.test(arg);
    return retVal;
};
const $c9fa8fa2ea083dbf$export$3c98c05de17f0b14 = (arr, predicate)=>{
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
const $c9fa8fa2ea083dbf$export$4b80e395e36b5a56 = (arr, callback)=>{
    for(let i = 0; i < arr.length; i++){
        if (callback(arr[i], i, arr) === false) break;
    }
};
const $c9fa8fa2ea083dbf$export$2344b14b097df817 = (arr, item)=>arr.indexOf(item) >= 0;
const $c9fa8fa2ea083dbf$export$4154a199d7d90455 = (arr, predicate)=>arr.filter(predicate).length >= 0;
const $c9fa8fa2ea083dbf$export$f91dc717b0dd7bf0 = (inStr, strArr, matching)=>{
    matching ??= {
        value: {
            key: -1,
            value: null
        }
    };
    const kvp = $c9fa8fa2ea083dbf$export$3c98c05de17f0b14(strArr, (chr)=>inStr.indexOf(chr) >= 0);
    const retVal = kvp.key >= 0;
    if (retVal) matching.value = kvp;
    return retVal;
};
const $c9fa8fa2ea083dbf$export$b474669d74d71e4a = (inStr, strMx, matching)=>{
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
    const kvp = $c9fa8fa2ea083dbf$export$3c98c05de17f0b14(strMx, (strArr)=>$c9fa8fa2ea083dbf$export$f91dc717b0dd7bf0(inStr, strArr, innerMatching));
    const retVal = kvp.key >= 0;
    if (retVal) matching.value = {
        key: kvp.key,
        value: innerMatching.value
    };
    return retVal;
};
const $c9fa8fa2ea083dbf$export$5cde20adf95f713 = (obj, callback)=>{
    const objMap = obj;
    const objPropNames = Object.getOwnPropertyNames(obj);
    for (let propName of objPropNames){
        const propVal = objMap[propName];
        callback(propVal, propName, objMap, objPropNames, obj);
    }
};
const $c9fa8fa2ea083dbf$export$4950aa0f605343fb = (trgObj, srcObjsArr, depth = 0)=>{
    const trgObjMap = trgObj;
    for (let srcObj of srcObjsArr){
        const srcObjMap = srcObj;
        for (let propName of Object.getOwnPropertyNames(srcObj)){
            const srcPropVal = srcObjMap[propName];
            if (srcPropVal ?? false) {
                if (!(trgObjMap[propName] ?? false) ?? false) trgObjMap[propName] = srcPropVal;
                else if (depth > 0) $c9fa8fa2ea083dbf$export$4950aa0f605343fb(trgObj, [
                    srcObj
                ], depth - 1);
            }
        }
    }
    return trgObj;
};
const $c9fa8fa2ea083dbf$export$30ee5c6810ce1ce2 = async (inArr, predicate)=>{
    const outArr = [];
    const syncLock = new Uint32Array(new SharedArrayBuffer(32));
    for(let i = 0; i < inArr.length; i++){
        const iVal = i;
        if (await predicate(inArr[iVal], iVal, inArr)) {
            const idx = Atomics.add(syncLock, 0, 1);
            outArr[idx] = inArr[iVal];
        }
    }
};
const $c9fa8fa2ea083dbf$export$a939ddd3409bd57a = async (inArr, factory)=>{
    const outArr = [];
    for(let i = 0; i < inArr.length; i++)outArr[i] = await factory(inArr[i], i, inArr);
    return outArr;
};
const $c9fa8fa2ea083dbf$export$69f2a614aa1972b7 = async (inArr, predicate)=>{
    let idx = -1;
    for(let i = 0; i < inArr.length; i++){
        const iVal = i;
        if (await predicate(inArr[iVal], iVal, inArr)) {
            idx = iVal;
            break;
        }
    }
    return idx;
};
const $c9fa8fa2ea083dbf$export$4650fa2d799cbf63 = async (inArr, predicate)=>{
    const idx = await $c9fa8fa2ea083dbf$export$69f2a614aa1972b7(inArr, predicate);
    let retVal = null;
    if (idx >= 0) retVal = inArr[idx];
    return retVal;
};
const $c9fa8fa2ea083dbf$export$5b60df21e72b9cdb = (inVal, convertor)=>convertor(inVal);
const $c9fa8fa2ea083dbf$export$2ca8acdb52d6facf = (str, opts)=>{
    opts ??= {};
    const stIdx = opts.stIdx ?? 0;
    let endIdx = opts.endIdx ?? -1;
    if (endIdx < 0) endIdx = str.length + endIdx + 1 - stIdx;
    const retStr = str.substring(stIdx, endIdx);
    return retStr;
};
const $c9fa8fa2ea083dbf$export$457d92f283ecacb0 = (str, trimOpts)=>{
    trimOpts ??= {
        trimStr: " "
    };
    let trimStr = trimOpts.trimStr;
    if (!$c9fa8fa2ea083dbf$export$3030f957b72eb0a(trimStr)) trimStr = " ";
    trimStr.length;
    if (trimOpts.fullTrim || trimOpts.trimStart) while(str.startsWith(trimStr))str = str.substring(trimStr.length);
    if (trimOpts.fullTrim || trimOpts.trimEnd) while(str.endsWith(trimStr))str = str.substring(0, str.length - trimStr.length);
    return str;
};
const $c9fa8fa2ea083dbf$export$d07f57595c356899 = (str)=>{
    let firstLetter = str[0];
    if (firstLetter) {
        const cappFirstLetter = firstLetter.toUpperCase();
        if (firstLetter !== cappFirstLetter) str = cappFirstLetter + str.substring(1);
    }
    return str;
};


var $f14b22a3a15ffba0$exports = {};

$parcel$export($f14b22a3a15ffba0$exports, "FileType", () => $f14b22a3a15ffba0$export$c5ae10d7c88c4d3e);
$parcel$export($f14b22a3a15ffba0$exports, "OfficeFileType", () => $f14b22a3a15ffba0$export$38cf3801cde292ad);
var $f14b22a3a15ffba0$export$c5ae10d7c88c4d3e;
(function(FileType) {
    FileType[FileType["plainText"] = 1] = "plainText";
    FileType[FileType["document"] = 2] = "document";
    FileType[FileType["image"] = 3] = "image";
    FileType[FileType["audio"] = 4] = "audio";
    FileType[FileType["video"] = 5] = "video";
    FileType[FileType["code"] = 6] = "code";
    FileType[FileType["binary"] = 7] = "binary";
    FileType[FileType["zippedFolder"] = 8] = "zippedFolder";
})($f14b22a3a15ffba0$export$c5ae10d7c88c4d3e || ($f14b22a3a15ffba0$export$c5ae10d7c88c4d3e = {}));
var $f14b22a3a15ffba0$export$38cf3801cde292ad;
(function(OfficeFileType) {
    OfficeFileType[OfficeFileType["word"] = 1] = "word";
    OfficeFileType[OfficeFileType["excel"] = 2] = "excel";
    OfficeFileType[OfficeFileType["powerPoint"] = 3] = "powerPoint";
})($f14b22a3a15ffba0$export$38cf3801cde292ad || ($f14b22a3a15ffba0$export$38cf3801cde292ad = {}));


var $c420491be9bcac09$exports = {};

$parcel$export($c420491be9bcac09$exports, "CmdCommand", () => $c420491be9bcac09$export$a143f2d68edec972);
$parcel$export($c420491be9bcac09$exports, "getCommand", () => $c420491be9bcac09$export$36c020ba2f6f2a3b);
$parcel$export($c420491be9bcac09$exports, "getCmd", () => $c420491be9bcac09$export$7d06496ff280727a);
var $c420491be9bcac09$export$a143f2d68edec972;
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
})($c420491be9bcac09$export$a143f2d68edec972 || ($c420491be9bcac09$export$a143f2d68edec972 = {}));
const $c420491be9bcac09$export$36c020ba2f6f2a3b = (commandsMap, cmd)=>{
    const cmdName = $c420491be9bcac09$export$a143f2d68edec972[cmd];
    const cmdVal = commandsMap[cmdName];
    return cmdVal;
};
const $c420491be9bcac09$export$7d06496ff280727a = (noteDirPairs, cmd)=>$c420491be9bcac09$export$36c020ba2f6f2a3b(noteDirPairs.argOpts.commandsMap, cmd);


var $18cc6316adee9978$exports = {};

$parcel$export($18cc6316adee9978$exports, "DirType", () => $18cc6316adee9978$export$eff09ab3cc9d4cbf);
$parcel$export($18cc6316adee9978$exports, "DirCategory", () => $18cc6316adee9978$export$9433409b6bb670dd);
$parcel$export($18cc6316adee9978$exports, "InternalDir", () => $18cc6316adee9978$export$fa201a2b0068b111);
var $18cc6316adee9978$export$eff09ab3cc9d4cbf;
(function(DirType) {
    DirType[DirType["shortName"] = 0] = "shortName";
    DirType[DirType["fullName"] = 1] = "fullName";
})($18cc6316adee9978$export$eff09ab3cc9d4cbf || ($18cc6316adee9978$export$eff09ab3cc9d4cbf = {}));
var $18cc6316adee9978$export$9433409b6bb670dd;
(function(DirCategory) {
    DirCategory[DirCategory["item"] = 0] = "item";
    DirCategory[DirCategory["internals"] = 1] = "internals";
})($18cc6316adee9978$export$9433409b6bb670dd || ($18cc6316adee9978$export$9433409b6bb670dd = {}));
var $18cc6316adee9978$export$fa201a2b0068b111;
(function(InternalDir) {
    InternalDir[InternalDir["root"] = 1] = "root";
    InternalDir[InternalDir["internals"] = 2] = "internals";
    InternalDir[InternalDir["files"] = 3] = "files";
})($18cc6316adee9978$export$fa201a2b0068b111 || ($18cc6316adee9978$export$fa201a2b0068b111 = {}));


var $9872f0ab099bbafa$exports = {};

$parcel$export($9872f0ab099bbafa$exports, "trmrkPathSep", () => $9872f0ab099bbafa$export$ddce135627aa7407);
$parcel$export($9872f0ab099bbafa$exports, "trmrkPathStartTkn", () => $9872f0ab099bbafa$export$b6d8eb2eccdcbac2);
$parcel$export($9872f0ab099bbafa$exports, "trmrkHomePathTkn", () => $9872f0ab099bbafa$export$55931b541cf741a5);
$parcel$export($9872f0ab099bbafa$exports, "trmrkHomePathStr", () => $9872f0ab099bbafa$export$467a08a4d688caf8);
$parcel$export($9872f0ab099bbafa$exports, "trmrkHomePathStartStr", () => $9872f0ab099bbafa$export$d6e2f80be5df35b5);
$parcel$export($9872f0ab099bbafa$exports, "getPath", () => $9872f0ab099bbafa$export$2aa3fd96c49a84a8);
$parcel$export($9872f0ab099bbafa$exports, "PathValidationErrCode", () => $9872f0ab099bbafa$export$b49b0bc5eb3b1a33);
$parcel$export($9872f0ab099bbafa$exports, "dfPathValidationResult", () => $9872f0ab099bbafa$export$d46c69ed7af495dc);
$parcel$export($9872f0ab099bbafa$exports, "createInvalidSeqncs", () => $9872f0ab099bbafa$export$80dbc49a898ba48a);
$parcel$export($9872f0ab099bbafa$exports, "baseInvalidSeqncs", () => $9872f0ab099bbafa$export$d9302570008d1766);
$parcel$export($9872f0ab099bbafa$exports, "winInvalidSeqncs", () => $9872f0ab099bbafa$export$1ff14a36e55f78e6);
$parcel$export($9872f0ab099bbafa$exports, "unixInvalidSeqncs", () => $9872f0ab099bbafa$export$4ffbc2eea9e3ffc8);
$parcel$export($9872f0ab099bbafa$exports, "getInvalidSeqncs", () => $9872f0ab099bbafa$export$e7713dfd0e597612);
$parcel$export($9872f0ab099bbafa$exports, "normalizeIfNetworkPath", () => $9872f0ab099bbafa$export$81a72685d2c34c90);
$parcel$export($9872f0ab099bbafa$exports, "normalizeIfRelPath", () => $9872f0ab099bbafa$export$cd87191c1e1c7eb2);
$parcel$export($9872f0ab099bbafa$exports, "checkPathNotContainsInvalidChars", () => $9872f0ab099bbafa$export$c642c38e375a18d0);
$parcel$export($9872f0ab099bbafa$exports, "isValidRootedPathCore", () => $9872f0ab099bbafa$export$918bf71becaac866);
$parcel$export($9872f0ab099bbafa$exports, "isValidRootedPath", () => $9872f0ab099bbafa$export$6cf6c0d5db218816);
$parcel$export($9872f0ab099bbafa$exports, "isValidRootedFsPath", () => $9872f0ab099bbafa$export$c826ebdf7fe7b4cf);
$parcel$export($9872f0ab099bbafa$exports, "isValidPath", () => $9872f0ab099bbafa$export$a678af82bf766611);
$parcel$export($9872f0ab099bbafa$exports, "isValidFsPath", () => $9872f0ab099bbafa$export$efa466c206370b95);

const $9872f0ab099bbafa$export$ddce135627aa7407 = "/";
const $9872f0ab099bbafa$export$b6d8eb2eccdcbac2 = "<";
const $9872f0ab099bbafa$export$55931b541cf741a5 = "~";
const $9872f0ab099bbafa$export$467a08a4d688caf8 = [
    $9872f0ab099bbafa$export$b6d8eb2eccdcbac2,
    $9872f0ab099bbafa$export$55931b541cf741a5
].join("");
const $9872f0ab099bbafa$export$d6e2f80be5df35b5 = [
    $9872f0ab099bbafa$export$467a08a4d688caf8,
    $9872f0ab099bbafa$export$ddce135627aa7407
].join("");
const $9872f0ab099bbafa$export$2aa3fd96c49a84a8 = (pathParts, relToTrmrkHome = null)=>{
    const partsArr = [
        ...pathParts
    ];
    if (typeof relToTrmrkHome === "boolean") {
        if ((0, $c9fa8fa2ea083dbf$export$3030f957b72eb0a)(partsArr[0])) partsArr.splice(0, 0, "");
        if (relToTrmrkHome === true) partsArr[0] = $9872f0ab099bbafa$export$467a08a4d688caf8;
    }
    const path = partsArr.join($9872f0ab099bbafa$export$ddce135627aa7407);
    return path;
};
var $9872f0ab099bbafa$export$b49b0bc5eb3b1a33;
(function(PathValidationErrCode) {
    PathValidationErrCode[PathValidationErrCode["None"] = 0] = "None";
    PathValidationErrCode[PathValidationErrCode["NullOrEmpty"] = 1] = "NullOrEmpty";
    PathValidationErrCode[PathValidationErrCode["InvalidPathChars"] = 2] = "InvalidPathChars";
    PathValidationErrCode[PathValidationErrCode["IsNotRooted"] = 3] = "IsNotRooted";
})($9872f0ab099bbafa$export$b49b0bc5eb3b1a33 || ($9872f0ab099bbafa$export$b49b0bc5eb3b1a33 = {}));
const $9872f0ab099bbafa$export$d46c69ed7af495dc = ()=>({
        isValid: false,
        errCode: 0,
        invalidChar: {
            key: -1,
            value: null
        }
    });
const $9872f0ab099bbafa$export$80dbc49a898ba48a = (sep, opSep)=>[
        opSep,
        sep + sep,
        sep + " ",
        " " + sep,
        sep + ".",
        "." + sep
    ];
const $9872f0ab099bbafa$export$d9302570008d1766 = Object.freeze([
    "  ",
    " .",
    "..",
    ". "
]);
const $9872f0ab099bbafa$export$1ff14a36e55f78e6 = Object.freeze($9872f0ab099bbafa$export$80dbc49a898ba48a("\\", "/"));
const $9872f0ab099bbafa$export$4ffbc2eea9e3ffc8 = Object.freeze($9872f0ab099bbafa$export$80dbc49a898ba48a("/", "\\"));
const $9872f0ab099bbafa$export$e7713dfd0e597612 = (isWinOs)=>isWinOs ? $9872f0ab099bbafa$export$1ff14a36e55f78e6 : $9872f0ab099bbafa$export$4ffbc2eea9e3ffc8;
const $9872f0ab099bbafa$export$81a72685d2c34c90 = (path, sep, allowNetworkPath)=>{
    if (allowNetworkPath) {
        const dblSep = sep + sep;
        if (path.startsWith(dblSep)) path = path.substring(1);
    }
    return path;
};
const $9872f0ab099bbafa$export$cd87191c1e1c7eb2 = (path, sep)=>{
    if (path.startsWith(".." + sep)) path = path.substring(2);
    else if (path.startsWith("." + sep)) path = path.substring(1);
    return path;
};
const $9872f0ab099bbafa$export$c642c38e375a18d0 = (path, result, invalidStrMx)=>{
    let matching = {};
    if (!(result.isValid = !(0, $c9fa8fa2ea083dbf$export$b474669d74d71e4a)(path, invalidStrMx, matching))) {
        result.errCode = 2;
        result.invalidChar = matching.value.value;
    }
    return result.isValid;
};
const $9872f0ab099bbafa$export$918bf71becaac866 = (cfg, path, result)=>{
    if (!(result.isValid = (0, $c9fa8fa2ea083dbf$export$3030f957b72eb0a)(path, true))) result.errCode = 1;
    else $9872f0ab099bbafa$export$c642c38e375a18d0(path, result, [
        cfg.invalidFileNameChars,
        $9872f0ab099bbafa$export$d9302570008d1766
    ]);
    return result.isValid;
};
const $9872f0ab099bbafa$export$6cf6c0d5db218816 = (cfg, path, result = null, allowNetworkPath = true)=>{
    result ??= $9872f0ab099bbafa$export$d46c69ed7af495dc();
    result.isValid = $9872f0ab099bbafa$export$918bf71becaac866(cfg, path, result);
    if (result.isValid) {
        path = $9872f0ab099bbafa$export$81a72685d2c34c90(path, cfg.pathSep, allowNetworkPath);
        if (!(result.isValid = path.startsWith("/") || path.startsWith($9872f0ab099bbafa$export$d6e2f80be5df35b5))) result.errCode = 3;
    }
    if (result.isValid) $9872f0ab099bbafa$export$c642c38e375a18d0(path, result, [
        $9872f0ab099bbafa$export$4ffbc2eea9e3ffc8
    ]);
    return result.isValid;
};
const $9872f0ab099bbafa$export$c826ebdf7fe7b4cf = (cfg, path, result = null, allowNetworkPath = true)=>{
    result ??= $9872f0ab099bbafa$export$d46c69ed7af495dc();
    if (cfg.isWinOS) {
        if (result.isValid = /^[a-zA-Z]\:/.test(path)) path = path.substring(2);
        else result.isValid = path.startsWith("\\");
    } else result.isValid = path.startsWith("/");
    if (result.isValid) {
        path = $9872f0ab099bbafa$export$81a72685d2c34c90(path, cfg.pathSep, allowNetworkPath);
        result.isValid = $9872f0ab099bbafa$export$c642c38e375a18d0(path, result, [
            cfg.invalidFileNameChars,
            $9872f0ab099bbafa$export$d9302570008d1766
        ]);
    } else result.errCode = 3;
    result.isValid = result.isValid && $9872f0ab099bbafa$export$c642c38e375a18d0(path, result, [
        $9872f0ab099bbafa$export$e7713dfd0e597612(cfg.isWinOS)
    ]);
    return result.isValid;
};
const $9872f0ab099bbafa$export$a678af82bf766611 = (cfg, path, result = null, allowNetworkPath = true)=>{
    result ??= $9872f0ab099bbafa$export$d46c69ed7af495dc();
    path = $9872f0ab099bbafa$export$cd87191c1e1c7eb2(path, cfg.pathSep);
    result.isValid = $9872f0ab099bbafa$export$6cf6c0d5db218816(cfg, path, result, allowNetworkPath);
    return result.isValid;
};
const $9872f0ab099bbafa$export$efa466c206370b95 = (cfg, path, result = null, allowNetworkPath = true)=>{
    result ??= $9872f0ab099bbafa$export$d46c69ed7af495dc();
    path = $9872f0ab099bbafa$export$cd87191c1e1c7eb2(path, cfg.pathSep);
    result.isValid = $9872f0ab099bbafa$export$c826ebdf7fe7b4cf(cfg, path, result, allowNetworkPath);
    return result.isValid;
};


var $7e2affc52143d77e$exports = {};

$parcel$export($7e2affc52143d77e$exports, "getBaseLocation", () => $7e2affc52143d77e$export$523cb06ae22ee463);
const $7e2affc52143d77e$export$523cb06ae22ee463 = ()=>{
    let baseLocation = [
        window.location.protocol,
        window.location.host
    ].join("//");
    return baseLocation;
};


var $7129c7196d7b9602$exports = {};

$parcel$export($7129c7196d7b9602$exports, "SyncLock", () => $7129c7196d7b9602$export$f30ecd94ca77877e);
class $7129c7196d7b9602$export$f30ecd94ca77877e {
    static dfVal = BigInt(0);
    static incVal = BigInt(1);
    dfTimeout;
    syncRoot = new BigInt64Array(1);
    constructor(dfTimeout){
        this.dfTimeout = dfTimeout ?? undefined;
    }
    run(action, timeout) {
        return new Promise((resolve, reject)=>{
            if (Atomics.add(this.syncRoot, 0, $7129c7196d7b9602$export$f30ecd94ca77877e.incVal) === $7129c7196d7b9602$export$f30ecd94ca77877e.dfVal || Atomics.wait(this.syncRoot, 0, $7129c7196d7b9602$export$f30ecd94ca77877e.dfVal, timeout ?? this.dfTimeout) !== "timed-out") action().then(()=>{
                Atomics.sub(this.syncRoot, 0, $7129c7196d7b9602$export$f30ecd94ca77877e.incVal);
                resolve();
            }, (reason)=>{
                Atomics.sub(this.syncRoot, 0, $7129c7196d7b9602$export$f30ecd94ca77877e.incVal);
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


var $dbbd0fee6d8c1fac$exports = {};

$parcel$export($dbbd0fee6d8c1fac$exports, "ArrayAdapterBase", () => $dbbd0fee6d8c1fac$export$48789547488e4aae);
$parcel$export($dbbd0fee6d8c1fac$exports, "ArrayAdapter", () => $dbbd0fee6d8c1fac$export$8f17a7be0d395bf7);
$parcel$export($dbbd0fee6d8c1fac$exports, "ReadonlyArrayAdapter", () => $dbbd0fee6d8c1fac$export$9230d4504dfe5655);
class $dbbd0fee6d8c1fac$export$48789547488e4aae {
    array;
    constructor(array){
        this.array = array;
    }
    contains(item) {
        const retVal = this.array.indexOf(item) >= 0;
        return retVal;
    }
    containsAny(predicate) {
        const retVal = this.array.findIndex(predicate);
        return !!retVal;
    }
    containsAnyOf(items) {
        const retVal = items.findIndex((item)=>this.contains(item));
        return !!retVal;
    }
    except(items) {
        const retArr = this.array.filter((item)=>items.indexOf(item) < 0);
        return retArr;
    }
    exceptAll(itemsMx) {
        let retArr = this.except(itemsMx[0]);
        for(let i = 1; i < itemsMx.length; i++){
            const items = itemsMx[i];
            retArr = retArr.filter((item)=>items.indexOf(item) < 0);
        }
        return retArr;
    }
}
class $dbbd0fee6d8c1fac$export$8f17a7be0d395bf7 extends $dbbd0fee6d8c1fac$export$48789547488e4aae {
}
class $dbbd0fee6d8c1fac$export$9230d4504dfe5655 extends $dbbd0fee6d8c1fac$export$48789547488e4aae {
    constructor(array){
        super(Object.isFrozen(array) ? array : Object.freeze(array));
    }
}


var $54f31e68b15a6d07$exports = {};

$parcel$export($54f31e68b15a6d07$exports, "FactoryRef", () => $54f31e68b15a6d07$export$20b0295cf0129fcc);
$parcel$export($54f31e68b15a6d07$exports, "ValueRetriever", () => $54f31e68b15a6d07$export$3b1693ecd4c0c635);
class $54f31e68b15a6d07$export$20b0295cf0129fcc {
    _factory;
    constructor(){
        this._factory = null;
    }
    get factory() {
        if (!this._factory) throw new Error("There is no factory registered");
        return this._factory;
    }
    get isRegistered() {
        return !!this.factory;
    }
    register(factory) {
        this._factory = factory;
    }
    unregister() {
        this._factory = null;
    }
}
class $54f31e68b15a6d07$export$3b1693ecd4c0c635 {
    inputVal;
    factoryRef;
    constructor(inputVal){
        this.inputVal = inputVal;
        this.factoryRef = new $54f31e68b15a6d07$export$20b0295cf0129fcc();
    }
    get value() {
        const retVal = this.factoryRef.factory();
        return retVal;
    }
}


var $f2e9a18c4f35c3aa$exports = {};

$parcel$defineInteropFlag($f2e9a18c4f35c3aa$exports);

$parcel$export($f2e9a18c4f35c3aa$exports, "default", () => $f2e9a18c4f35c3aa$export$2e2bcd8739ae039);
var $1bbfd2b625946ce7$exports = {};

$parcel$export($1bbfd2b625946ce7$exports, "DriveItemNodeCore", () => $1bbfd2b625946ce7$export$766f5ba2c8dfc011);
$parcel$export($1bbfd2b625946ce7$exports, "DriveExplorerApiBase", () => $1bbfd2b625946ce7$export$968a466e85e0c2c);
$parcel$export($1bbfd2b625946ce7$exports, "getRootedPathSegments", () => $1bbfd2b625946ce7$export$4b2d80db5e71d399);
$parcel$export($1bbfd2b625946ce7$exports, "dirPointers", () => $1bbfd2b625946ce7$export$f120450215b8a535);

class $1bbfd2b625946ce7$export$766f5ba2c8dfc011 {
    _item;
    _name;
    _isFolder;
    _subFolders;
    _folderFiles;
    constructor(item){
        this._item = item;
        this._name = this._item.name;
        this._isFolder = this._item.isFolder ?? false;
    }
    get item() {
        return this._item;
    }
    get name() {
        return this._name;
    }
    get isFolder() {
        return this._isFolder;
    }
    get subFolders() {
        return this._subFolders;
    }
    set subFolders(value) {
        this._subFolders = value;
    }
    get folderFiles() {
        return this._folderFiles;
    }
    set folderFiles(value) {
        this._folderFiles = value;
    }
}
class $1bbfd2b625946ce7$export$968a466e85e0c2c {
    async GetItem(pathArgs, parentRefreshDepth) {
        const pathSegs = this.getPathSegments(pathArgs);
        let retNode = await this.getNode(pathSegs, null, parentRefreshDepth);
        return retNode?.item ?? null;
    }
    async GetFolder(pathArgs, depth, parentRefreshDepth) {
        const pathSegs = this.getPathSegments(pathArgs);
        let retNode = await this.getNode(pathSegs, true, parentRefreshDepth);
        let subFolders = retNode?.subFolders;
        depth ??= -1;
        if (depth > 0 && subFolders) {
            const tempSubFolders = [
                ...subFolders
            ];
            for(let i = 0; i < tempSubFolders.length; i++){
                let subFolder = tempSubFolders[i];
                subFolder = await this.getNode([
                    ...pathSegs,
                    subFolder.name
                ], true, depth - 1);
                if (!subFolder) throw new Error("One of the sub folders could not be refreshed");
                else tempSubFolders[i] = subFolder;
            }
            for(let i = 0; i < subFolders.length; i++)subFolders[i] = tempSubFolders[i];
        }
        const folder = retNode?.item ?? null;
        return folder;
    }
    async ItemExists(pathArgs) {
        let retItem = await this.GetItem(pathArgs);
        return !!retItem;
    }
    async FolderExists(pathArgs) {
        let retItem = await this.GetFolder(pathArgs);
        return !!retItem;
    }
    async FileExists(pathArgs) {
        let retItem = await this.GetItem(pathArgs);
        const retVal = !!retItem && retItem.isFolder !== true;
        return retVal;
    }
    async GetDriveFolderWebUrl(idnf) {
        throw new Error("Method GetDriveFolderWebUrl is not supported");
    }
    async GetDriveFileWebUrl(idnf) {
        throw new Error("Method GetDriveFileWebUrl is not supported");
    }
    async RenameFolder(pathArgs, newFolderName) {
        const pathSegs = this.getPathSegments(pathArgs);
        const retNode = await this.copyOrMoveFolder(pathSegs, true, null, newFolderName);
        return retNode;
    }
    async CopyFolder(pathArgs, newPrPathArgs, newFolderName = null) {
        const pathSegs = this.getPathSegments(pathArgs);
        const newPrPathSegs = this.getPathSegments(newPrPathArgs);
        const retNode = await this.copyOrMoveFolder(pathSegs, false, newPrPathSegs, newFolderName);
        return retNode;
    }
    async MoveFolder(pathArgs, newPrPathArgs, newFolderName = null) {
        const pathSegs = this.getPathSegments(pathArgs);
        const newPrPathSegs = this.getPathSegments(newPrPathArgs);
        const retNode = await this.copyOrMoveFolder(pathSegs, true, newPrPathSegs, newFolderName);
        return retNode;
    }
    async CreateOfficeLikeFile(prPathArgs, newFileName, officeLikeFileType) {
        const retItem = await this.CreateTextFile(prPathArgs, newFileName, "");
        return retItem;
    }
    async RenameFile(pathArgs, newFileName) {
        const pathSegs = this.getPathSegments(pathArgs);
        const retItem = await this.copyOrMoveFile(pathSegs, false, null, newFileName);
        return retItem;
    }
    async CopyFile(pathArgs, newPrPathArgs, newFileName = null) {
        const pathSegs = this.getPathSegments(pathArgs);
        const newPrPathSegs = this.getPathSegments(newPrPathArgs);
        const retItem = await this.copyOrMoveFile(pathSegs, false, newPrPathSegs, newFileName);
        return retItem;
    }
    async MoveFile(pathArgs, newPrPathArgs, newFileName = null) {
        const pathSegs = this.getPathSegments(pathArgs);
        const newPrPathSegs = this.getPathSegments(newPrPathArgs);
        const retItem = await this.copyOrMoveFile(pathSegs, true, newPrPathSegs, newFileName);
        return retItem;
    }
    async getNode(pathSegs, isFolder = null, parentRefreshDepth = null) {
        let retItem = null;
        if (pathSegs.length > 0) {
            const parentFolder = await this.getParentFolder(pathSegs, null, null, parentRefreshDepth);
            if (parentFolder) {
                const name = pathSegs.slice(-1)[0];
                if (isFolder) retItem = this.getSubFolder(parentFolder, name) ?? null;
                else if (isFolder === false) retItem = this.getFolderFile(parentFolder, name) ?? null;
                else retItem = this.getSubFolder(parentFolder, name) ?? this.getFolderFile(parentFolder, name) ?? null;
            }
        } else if (isFolder) {
            retItem = this.rootDirNode;
            await this.assureFolderHasDescendants(retItem);
        }
        return retItem ?? null;
    }
    async getParentFolder(pathSegs, parent = null, level = null, parentRefreshDepth = null) {
        let retParent = null;
        level ??= -1;
        parentRefreshDepth ??= -1;
        if (!parent) {
            if (pathSegs.length > 1) {
                parent = this.rootDirNode;
                retParent = await this.getParentFolder(pathSegs, parent, level + 1, parentRefreshDepth);
            } else retParent = this.rootDirNode;
        } else {
            await this.assureFolderHasDescendants(parent);
            if (pathSegs.length - level > 1) {
                const dirName = pathSegs[level];
                let node = parent.subFolders.find((folder)=>folder.name === dirName);
                if (node) retParent = await this.getParentFolder(pathSegs, node, level + 1, parentRefreshDepth);
            } else retParent = parent;
        }
        if (retParent) await this.assureFolderHasDescendants(retParent, level + parentRefreshDepth - pathSegs.length >= 0);
        return retParent;
    }
    getSubFolder(parentFolder, folderName) {
        const folderNode = parentFolder.subFolders.find((node)=>node.name === folderName);
        return folderNode;
    }
    async assureFolderHasDescendants(folder, refresh = null) {
        if (refresh || !folder.subFolders || !folder.folderFiles) {
            await this.fillFolderDescendants(folder);
            folder.item.subFolders = folder.subFolders.map((node)=>node.item);
            folder.item.folderFiles = folder.folderFiles.map((node)=>node.item);
        }
    }
    getFolderFile(parentFolder, fileName) {
        const fileNode = parentFolder.folderFiles.find((node)=>node.name === fileName);
        return fileNode;
    }
    sortItems(itemsArr) {
        itemsArr.sort((a, b)=>a.name.localeCompare(b.name));
    }
    throwIfFolderAlreadyContainsItemName(folder, itemName) {
        if (folder.subFolders) this.throwIfContainsItemName(folder.subFolders, itemName);
        if (folder.folderFiles) this.throwIfContainsItemName(folder.folderFiles, itemName);
    }
    addItem(itemsArr, newItem) {
        const name = newItem.name;
        let idx = itemsArr.findIndex((item)=>item.name.localeCompare(name) > 0);
        if (idx >= 0) {
            idx++;
            itemsArr.splice(idx, 0, newItem);
        } else {
            itemsArr.push(newItem);
            idx = itemsArr.length;
        }
        return idx;
    }
    throwIfContainsItemName(itemsArr, itemName, errMsg = null) {
        if (this.containsItemName(itemsArr, itemName)) {
            errMsg ??= "An item with the same name already exists at this location";
            throw new Error(errMsg);
        }
    }
    containsItemName(itemsArr, itemName) {
        const idx = itemsArr.findIndex((item)=>item.name == itemName);
        return idx >= 0;
    }
    getPathSegments(args) {
        const segments = $1bbfd2b625946ce7$export$4b2d80db5e71d399(args);
        return segments;
    }
}
const $1bbfd2b625946ce7$export$f120450215b8a535 = Object.freeze([
    ".",
    ".."
]);
const $1bbfd2b625946ce7$export$4b2d80db5e71d399 = (args)=>{
    const segments = args.path.split("/").filter((seg)=>(0, $058d7906f4bc6ba6$export$2e2bcd8739ae039).isNonEmptyStr(seg, true));
    if (args.path.startsWith(".")) {
        if (args.basePathSegs) {
            let sIdx = 0;
            let seg = segments[sIdx];
            let bsIdx = args.basePathSegs.length - 1;
            let $keepLoop = bsIdx >= 0;
            while($keepLoop){
                switch(seg){
                    case ".":
                        break;
                    case "..":
                        bsIdx--;
                        break;
                    default:
                        $keepLoop = false;
                        break;
                }
                sIdx++;
                seg = segments[sIdx];
            }
            const baseSegsToAdd = args.basePathSegs.slice(0, bsIdx);
            segments.splice(0, sIdx, ...baseSegsToAdd);
        } else throw new Error("Relative paths are only allowed if base path segments are also provided");
    } else if (args.homePathSegs && args.path.startsWith("~/")) {
        const homePathSegsCount = args.homePathSegs.length;
        let idx = 1;
        while(idx <= homePathSegsCount && segments[idx] === "..")idx++;
        const pointedHomePathSegs = args.homePathSegs.slice(homePathSegsCount - idx, homePathSegsCount);
        segments.splice(0, idx, ...pointedHomePathSegs);
    }
    for (let seg of segments){
        if (seg.trim() != seg || seg.endsWith(".")) throw new Error("Rooted path segments are not allowed to end with the dot symbol or start or end with whitespace");
        else {
            const chars = [
                ...seg
            ];
            if (chars.filter((ch)=>/\s/.test(ch) && ch != " ")) throw new Error("Paths are not allowed to contain any other type of whitespace than the space char");
            else if (seg.indexOf("  ") >= 0) throw new Error("Paths are not allowed to contain 2 or more spaces one after the other");
        }
    }
    return segments;
};


var $f2e9a18c4f35c3aa$export$2e2bcd8739ae039 = {
    ...$1bbfd2b625946ce7$exports
};


var $058d7906f4bc6ba6$export$2e2bcd8739ae039 = {
    ...$c9fa8fa2ea083dbf$exports,
    ...$f14b22a3a15ffba0$exports,
    ...$18cc6316adee9978$exports,
    ...$7129c7196d7b9602$exports,
    notesAppConfig: $c420491be9bcac09$exports,
    notesPath: $9872f0ab099bbafa$exports,
    url: $7e2affc52143d77e$exports,
    ...$dbbd0fee6d8c1fac$exports,
    ...$54f31e68b15a6d07$exports,
    ...$f2e9a18c4f35c3aa$exports
};


class $8eb34e2ca2a1a4f9$export$fe330a9df595e087 {
    data = null;
    init(initData) {
        if (typeof initData === "string") initData = JSON.parse(initData);
        this.data = initData;
    }
}


window.trmrk = (0, $058d7906f4bc6ba6$export$2e2bcd8739ae039);
const $60fb29786a51d6b7$export$e7d7a4aa4a6e95f1 = new (0, $8eb34e2ca2a1a4f9$export$fe330a9df595e087)();
window.trmrkApp = $60fb29786a51d6b7$export$e7d7a4aa4a6e95f1;
const $60fb29786a51d6b7$export$69b554e0c3f6c520 = (0, $058d7906f4bc6ba6$export$2e2bcd8739ae039);
var $60fb29786a51d6b7$export$2e2bcd8739ae039 = {
    trmrk: $60fb29786a51d6b7$export$69b554e0c3f6c520,
    trmrkApp: $60fb29786a51d6b7$export$e7d7a4aa4a6e95f1
};

})();
//# sourceMappingURL=index.js.map

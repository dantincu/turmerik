import {core as $hgUW1$core} from "trmrk";


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $8a29e9b0d3dc349c$exports = {};

$parcel$export($8a29e9b0d3dc349c$exports, "absUriRegex", () => $8a29e9b0d3dc349c$export$ed01c7b5cbb7da30);
$parcel$export($8a29e9b0d3dc349c$exports, "getNewUri", () => $8a29e9b0d3dc349c$export$c4dc95a7fd9235ea);
$parcel$export($8a29e9b0d3dc349c$exports, "getRelUri", () => $8a29e9b0d3dc349c$export$b6551c57acf17daf);

const $8a29e9b0d3dc349c$export$ed01c7b5cbb7da30 = /^[\w\-_]+\:\/\/([\w\-_]+\.?)+(\:[0-9]+)?(\/[\w\-\?\.\+_&=#,]*)*$/g;
const $8a29e9b0d3dc349c$export$c4dc95a7fd9235ea = (query, hash, path, host, preserveQueryDelim)=>{
    const queryStr = query?.toString();
    const partsArr = [
        host,
        path
    ].filter((part)=>(0, $hgUW1$core).isNonEmptyStr(part, true));
    let newUri = partsArr.join("/");
    if (preserveQueryDelim || (0, $hgUW1$core).isNonEmptyStr(queryStr, true)) newUri = [
        newUri,
        queryStr
    ].join("?");
    if ((0, $hgUW1$core).isNonEmptyStr(hash)) newUri += hash;
    return newUri;
};
const $8a29e9b0d3dc349c$export$b6551c57acf17daf = (queryParams, queryParamsTransformer, hashTransformer, pathTransformer, preserveQueryDelim)=>{
    queryParamsTransformer(queryParams);
    hashTransformer ??= (hash)=>hash;
    pathTransformer ??= (path)=>{
        if (typeof path === "string") {
            if (path.startsWith("/")) path = path.substring(1);
            if (path.endsWith("/")) path = path.substring(0, path.length - 1);
        }
        return path;
    };
    const hash = hashTransformer(location.hash);
    const path = pathTransformer(location.pathname);
    const newUri = $8a29e9b0d3dc349c$export$c4dc95a7fd9235ea(queryParams, hash, path, null, preserveQueryDelim);
    return newUri;
};


var $164e082ca02a4afc$exports = {};


const $5b3b70ff7e227d24$export$ff8c88762cce97a1 = {
    ...$164e082ca02a4afc$exports
};


const $149c1bd638913645$export$3f2684e5d7cb1006 = {
    ...$8a29e9b0d3dc349c$exports,
    indexedDB: $5b3b70ff7e227d24$export$ff8c88762cce97a1
};


export {$149c1bd638913645$export$3f2684e5d7cb1006 as browser};
//# sourceMappingURL=index.js.map

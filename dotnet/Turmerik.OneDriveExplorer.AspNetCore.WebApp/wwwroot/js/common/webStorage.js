import { trmrk } from './core.js';

export class WebStorage {
    cacheKeyBasePrefix = trmrk.core.trmrkPrefix;
    bigItems = {};

    clear(storage) {
        storage = this.getStorage(storage);
        storage.clear();
    }

    containsKey(key, storage) {
        storage = this.getStorage(storage);

        let len = storage.length;
        let retVal = false;

        for (let i = 0; i < len; i++) {
            let candKey = storage.key(i);

            if (candKey === key) {
                retVal = true;
                break;
            }
        }

        return retVal;
    }

    keys(storage) {
        storage = this.getStorage(storage);

        let len = storage.length;
        let keysArr = [];

        for (let i = 0; i < len; i++) {
            let key = storage.key(i);
            keysArr.push(key);
        }

        return keysArr;
    }

    getItem(key, storage) {
        storage = this.getStorage(storage);
        let retVal = storage.getItem(key);

        return retVal;
    }

    setItem(key, value, storage) {
        storage = this.getStorage(storage);
        storage.setItem(key, value);
    }

    removeItem(key, storage) {
        storage = this.getStorage(storage);
        storage.removeItem(key);
    }

    removeItems(keysArr, storage) {
        storage = this.getStorage(storage);
        let len = keysArr.length;

        for (let i = 0; i < len; i++) {
            let key = keysArr[i];
            storage.removeItem(key);
        }
    }

    getStorage(storage) {
        if (!trmrk.core.isNotNullObj(storage)) {
            if (storage) { // storage becomes parameter "isPersistent"
                storage = localStorage;
            } else {
                storage = sessionStorage;
            }
        }

        return storage;
    }

    textToLines (text, maxLineLen) {
        let lines = [];
        let textLen = text.length;

        let linesCount = Math.ceil(textLen / maxLineLen);

        let stIdx = 0;
        let endIdx = maxLineLen - 1;

        for (let i = 0; i < linesCount; i++) {
            lines[i] = text.substring(stIdx, endIdx);

            stIdx = endIdx;
            endIdx += maxLineLen;
        }

        return lines;
    }

    getBigItemChunksCount(key, guidStr, maxChunkLength, isPersistent) {
        let text = this.getItem(key, isPersistent);

        if (typeof (text) !== "string") {
            text = "";
        }

        let lines = this.textToLines(text, maxChunkLength);
        this.bigItems[guidStr] = lines;

        let chunksCount = lines.length;
        return chunksCount;
    }

    getBigItemChunk(guidStr, idx) {
        let textChunk = this.bigItems[guidStr][idx];
        return textChunk;
    }

    clearBigItemChunks(guidStr) {
        delete this.bigItems[guidStr];
    }

    getCacheKey(keyName, id, username) {
        let idStr = trmrk.core.getNonEmptyStrValOrEmpty(id, val => "|" + val);
        let usernameStr = trmrk.core.getNonEmptyStrValOrEmpty(username, val => "|" + val + "|");

        let cacheKey = this.cacheKeyBasePrefix + usernameStr + keyName + idStr;
        return cacheKey;
    }
}

trmrk.types["WebStorage"] = WebStorage;
const webStorageInstn = new WebStorage();

trmrk.webStorage = webStorageInstn;
export const webStorage = webStorageInstn;

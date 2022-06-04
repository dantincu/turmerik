import { trmrk as trmrk } from './core.js';

export class WebStorage {
    bigItems = {};

    clear(isPersistent) {
        let storage = this.getStorage(isPersistent);
        storage.clear();
    }

    containsKey(key, isPersistent) {
        let storage = this.getStorage(isPersistent);

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

    keys(isPersistent) {
        let storage = this.getStorage(isPersistent);

        let len = storage.length;
        let keysArr = [];

        for (let i = 0; i < len; i++) {
            let key = storage.key(i);
            keysArr.push(key);
        }

        return keysArr;
    }

    getItem(key, isPersistent) {
        let storage = this.getStorage(isPersistent);
        let retVal = storage.getItem(key);

        return retVal;
    }

    setItem(key, value, isPersistent) {
        let storage = this.getStorage(isPersistent);
        storage.setItem(key, value);
    }

    removeItem(key, isPersistent) {
        let storage = this.getStorage(isPersistent);
        storage.removeItem(key);
    }

    removeItems(keysArr, isPersistent) {
        let storage = this.getStorage(isPersistent);
        let len = keysArr.length;

        for (let i = 0; i < len; i++) {
            let key = keysArr[i];
            storage.removeItem(key);
        }
    }

    getStorage(isPersistent) {
        let storage;

        if (isPersistent) {
            storage = localStorage;
        } else {
            storage = sessionStorage;
        }

        return storage;
    }

    getBigItemChunksCount(key, guidStr, maxChunkLength, isPersistent) {
        let text = this.getItem(key, isPersistent);

        if (typeof (text) !== "string") {
            text = "";
        }

        let lines = trmrk.core.textToLines(text, maxChunkLength);
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
}

trmrk.types["WebStorage"] = WebStorage;
const webStorageInstn = new WebStorage();

trmrk.webStorage = webStorageInstn;
export const webStorage = webStorageInstn;

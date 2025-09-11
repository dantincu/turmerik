import { Kvp, NullOrUndef } from './core';

export class IndexedCollection<T> {
  private _map: { [key: number]: T } = {};
  private _keysArr: number[] = [];
  private _lastId: number = 0;

  public get lastId() {
    return this._lastId;
  }

  public get getKeys() {
    const keysArr = [...this._keysArr];
    return keysArr;
  }

  public containsKey(key: number) {
    const contains = this._keysArr.indexOf(key) >= 0;
    return contains;
  }

  public add(item: T) {
    const id = ++this._lastId;
    this._keysArr.push(id);
    this._map[id] = item;
    return id;
  }

  public get(key: number, throwIfNotExists = true) {
    const retKvp = this.getCore(key, throwIfNotExists);
    return retKvp;
  }

  public remove(key: number, throwIfNotExists = true) {
    const retKvp = this.getCore(key, throwIfNotExists, (keyVal) => {
      delete this._map[keyVal];
    });

    return retKvp;
  }

  public findKvp(
    predicate: (value: T, key: number) => boolean,
    throwIfNotFound = false
  ) {
    let retKvp: Kvp<number, T | null> = {
      key: -1,
      value: null,
    };

    for (let key of this._keysArr) {
      const value = this._map[key];

      if (predicate(value, key)) {
        retKvp.key = key;
        retKvp.value = value;
        break;
      }
    }

    if (throwIfNotFound && retKvp.key < 0) {
      throw new Error(`No matching element found`);
    }

    return retKvp;
  }

  public findAll(predicate: (value: T, key: number) => boolean) {
    const retArr: Kvp<number, T>[] = [];

    for (let key of this._keysArr) {
      const value = this._map[key];

      if (predicate(value, key))
        retArr.push({
          key: key,
          value,
        });
    }

    return retArr;
  }

  public slice(predicate: (value: T, key: number) => boolean) {
    const retMap: { [key: number]: T } = {};

    for (let key of this._keysArr) {
      const value = this._map[key];

      if (predicate(value, key)) retMap[key] = value;
    }

    return retMap;
  }

  private getCore(
    key: number,
    throwIfNotExists: boolean,
    foundCallback:
      | ((key: number, keyIdx: number, found: boolean, item: T | null) => void)
      | NullOrUndef = null
  ) {
    const keyIdx = this._keysArr.indexOf(key);
    let item: T | null = null;
    let found = keyIdx >= 0;

    if (found) {
      item = this._map[key];
      foundCallback ??= () => {};
      foundCallback(key, keyIdx, found, item);
    } else if (throwIfNotExists) {
      throw new Error(`Key ${key} is not pressent in the dictionary`);
    }

    const retKvp = this.getKvp(found, item);
    return retKvp;
  }

  private getKvp(found: boolean, item: T | null) {
    const retKvp: Kvp<boolean, T | null> = {
      key: found,
      value: item,
    };

    return retKvp;
  }
}

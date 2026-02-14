import { atom, getDefaultStore } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import { IntKeyedNodesMap, IntKeyedNode } from "../components/defs/common";
import { JotaiStore } from "./jotai/core";
import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

export class IntKeyedComponentsMapManager<
  TNode = React.ReactNode,
  TData = any,
> {
  readonly keysAtom = atom<number[]>([]);
  readonly currentKeyAtom = atom<number | null>(null);
  readonly updateAtom = atom<number>(0);

  readonly keyedMap: IntKeyedNodesMap<TNode, TData> = {
    map: {},
  };

  private readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    this.store = store ?? getDefaultStore();
  }

  getKeys() {
    const keys = this.store.get(this.keysAtom);
    return keys;
  }

  getCurrentKey() {
    const currentKey = this.store.get(this.currentKeyAtom);
    return currentKey;
  }

  register(
    component: TNode,
    typeName?: string | NullOrUndef,
    key?: number | NullOrUndef,
    data?: TData,
  ) {
    key ??= defaultComponentIdService.value.getNextId();

    const retObj: IntKeyedNode<TNode, TData> = (this.keyedMap.map[key] = {
      key,
      node: component,
      typeName,
      nodeData: data,
    });

    this.store.set(this.keysAtom, (prev) =>
      prev.indexOf(key) < 0 ? [...prev, key] : prev,
    );

    this.store.set(this.currentKeyAtom, () => key);
    return retObj;
  }

  unregister(key: number, setCurrentToPrev?: boolean | NullOrUndef) {
    let component: IntKeyedNode<TNode, TData> | null = null;

    if ((key ?? null) !== null) {
      let isCurrent = false;
      let prevKey: number | null = null;

      this.store.set(this.keysAtom, (arr) => {
        const idx = arr.indexOf(key);

        if (idx >= 0) {
          isCurrent = true;
          arr = [...arr];
          arr.splice(idx, 1);
          prevKey = arr[arr.length - 1] ?? null;
        }

        return arr;
      });

      if (isCurrent) {
        if (setCurrentToPrev) {
          this.store.set(this.currentKeyAtom, () => prevKey);
        } else {
          this.store.set(this.currentKeyAtom, () => null);
        }
      }

      component = this.keyedMap.map[key] ?? null;
      delete this.keyedMap.map[key];
    }

    return component;
  }

  replaceSome(
    extract: (currentKeys: number[]) => number[],
    map: { [key: number]: IntKeyedNode<TNode, TData> },
  ) {
    const currentKey = this.getCurrentKey();
    const currentKeysArr = this.getKeys();
    const extractedKeysArr = extract(currentKeysArr);

    const remainingKeys = currentKeysArr.filter(
      (key) => extractedKeysArr.indexOf(key) < 0,
    );

    const extractedArr = extractedKeysArr.map((key) => this.keyedMap.map[key]);
    const addedKeysArr = Object.keys(map).map((key) => map[parseInt(key)].key);
    remainingKeys.push(...addedKeysArr);
    this.store.set(this.keysAtom, remainingKeys);

    if (
      (currentKey ?? null) !== null &&
      remainingKeys.indexOf(currentKey!) < 0
    ) {
      this.store.set(this.currentKeyAtom, null);
    }

    for (let extractedKey of extractedKeysArr) {
      delete this.keyedMap.map[extractedKey];
    }

    for (let addedKey of addedKeysArr) {
      this.keyedMap.map[addedKey] = map[addedKey];
    }

    return extractedArr;
  }

  replaceAll(map: { [key: number]: IntKeyedNode<TNode, TData> }) {
    const prevMap = this.keyedMap.map;
    this.keyedMap.map = map;

    this.store.set(this.keysAtom, () =>
      Object.keys(map).map((key) => map[parseInt(key)].key),
    );

    this.store.set(this.currentKeyAtom, null);
    return prevMap;
  }
}

export const createIntKeyedComponentsMapManager = <
  TNode = React.ReactNode,
  TData = any,
>() => new IntKeyedComponentsMapManager<TNode, TData>();

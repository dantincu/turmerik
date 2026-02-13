import { atom, getDefaultStore } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import {
  IntKeyedReactNodesMap,
  IntKeyedReactNode,
} from "../components/defs/common";
import { JotaiStore } from "./jotai/core";

export class IntKeyedComponentsMapManager<
  TNode = React.ReactNode,
  TData = any,
> {
  readonly currentKeysAtom = atom<number[]>([]);

  readonly keyedMap: IntKeyedReactNodesMap<TNode, TData> = {
    map: {},
  };

  private readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    this.store = store ?? getDefaultStore();
  }

  getCurrentKeys() {
    const currentKeys = this.store.get(this.currentKeysAtom);
    return currentKeys;
  }

  refreshKeys() {
    const currentKeys = this.store.get(this.currentKeysAtom);
    this.store.set(this.currentKeysAtom, [...currentKeys]);
    return currentKeys;
  }

  register(
    key: number,
    component: TNode,
    typeName?: string | NullOrUndef,
    data?: TData,
  ) {
    this.keyedMap.map[key] = {
      key,
      node: component,
      typeName,
      data,
    };

    this.store.set(this.currentKeysAtom, (prev) =>
      prev.indexOf(key) < 0 ? [...prev, key] : prev,
    );

    return key;
  }

  unregister(key: number) {
    let component: IntKeyedReactNode<TNode, TData> | null = null;

    if ((key ?? null) !== null) {
      this.store.set(this.currentKeysAtom, (arr) => {
        const idx = arr.indexOf(key);

        if (idx >= 0) {
          arr = [...arr];
          arr.splice(idx, 1);
        }

        return arr;
      });

      component = this.keyedMap.map[key] ?? null;
      delete this.keyedMap.map[key];
    }

    return component;
  }

  replaceSome(
    extract: (currentKeys: number[]) => number[],
    map: { [key: number]: IntKeyedReactNode<TNode, TData> },
  ) {
    const currentKeysArr = this.getCurrentKeys();
    const extractedKeysArr = extract(currentKeysArr);

    const remainingKeys = currentKeysArr.filter(
      (key) => extractedKeysArr.indexOf(key) < 0,
    );

    const extractedArr = extractedKeysArr.map((key) => this.keyedMap.map[key]);
    const addedKeysArr = Object.keys(map).map((key) => map[parseInt(key)].key);
    remainingKeys.push(...addedKeysArr);
    this.store.set(this.currentKeysAtom, remainingKeys);

    for (let extractedKey of extractedKeysArr) {
      delete this.keyedMap.map[extractedKey];
    }

    for (let addedKey of addedKeysArr) {
      this.keyedMap.map[addedKey] = map[addedKey];
    }

    return extractedArr;
  }

  replaceAll(map: { [key: number]: IntKeyedReactNode<TNode, TData> }) {
    const prevMap = this.keyedMap.map;
    this.keyedMap.map = map;

    this.store.set(this.currentKeysAtom, () =>
      Object.keys(map).map((key) => map[parseInt(key)].key),
    );

    return prevMap;
  }
}

export const createIntKeyedComponentsMapManager = <
  TNode = React.ReactNode,
  TData = any,
>() => new IntKeyedComponentsMapManager<TNode, TData>();

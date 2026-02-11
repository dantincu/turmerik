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
  public readonly currentKeysAtom = atom<number[]>([]);

  public readonly keyedMap: IntKeyedReactNodesMap<TNode, TData> = {
    map: {},
  };

  private readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    this.store = store ?? getDefaultStore();
  }

  public register(
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

  public unregister(key: number) {
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

  replaceAll(map: { [key: number]: IntKeyedReactNode<TNode, TData> }) {
    const prevMap = this.keyedMap.map;
    this.keyedMap.map = map;

    this.store.set(this.currentKeysAtom, () =>
      Object.keys(map).map((key) => map[parseInt(key)].key),
    );

    return prevMap;
  }

  getCurrentKeys() {
    const currentKeys = this.store.get(this.currentKeysAtom);
    return currentKeys;
  }
}

export const createIntKeyedComponentsMapManager = <
  TNode = React.ReactNode,
  TData = any,
>() => new IntKeyedComponentsMapManager<TNode, TData>();

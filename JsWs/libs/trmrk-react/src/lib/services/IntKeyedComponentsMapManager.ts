import { atom, getDefaultStore } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import { IntKeyedReactNodesMap } from "../components/defs/common";
import { JotaiStore } from "./types";

export class IntKeyedComponentsMapManager {
  public readonly currentKeysAtom = atom<number[]>([]);

  public readonly keyedMap: IntKeyedReactNodesMap = {
    map: {},
  };

  private readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    this.store = store ?? getDefaultStore();
  }

  public register(key: number, component: React.ReactNode) {
    this.keyedMap.map[key] = {
      key,
      node: component,
    };

    this.store.set(this.currentKeysAtom, (prev) =>
      prev.indexOf(key) < 0 ? [...prev, key] : prev,
    );

    return key;
  }

  public unregister(key: number) {
    this.store.set(this.currentKeysAtom, (prev) =>
      prev.filter((trgKey) => trgKey !== key),
    );

    const component = this.keyedMap.map[key];
    delete this.keyedMap.map[key];
    return component;
  }
}

export const createIntKeyedComponentsMapManager = () =>
  new IntKeyedComponentsMapManager();

import { createStore, SetStateAction, Atom, useAtom } from "jotai";

export type JotaiStore = ReturnType<typeof createStore>;
export type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result;

export type UseSetAtom<Value> = SetAtom<[SetStateAction<Value>], void>;
export type UseAtom<Value> = [Value, UseSetAtom<Value>];

export interface TrmrkUseAtom<Value> {
  value: Value;
  set: UseSetAtom<Value>;
}

export const trmrkUseAtom = <Value>(atom: Atom<Value>) => {
  const [value, set] = useAtom(atom);

  const retObj: TrmrkUseAtom<Value> = {
    value,
    set,
  };

  return retObj;
};

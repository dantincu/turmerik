import { createStore } from "jotai";

export type JotaiStore = ReturnType<typeof createStore>;
export type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result;

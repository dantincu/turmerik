import { Slice, PayloadAction } from "@reduxjs/toolkit";

import {
  SliceSelectors,
  SliceCaseReducers,
  CaseReducerActions,
} from "@reduxjs/toolkit/dist/createSlice";

import { CaseReducer } from "@reduxjs/toolkit/dist/createReducer";

import { Id } from "@reduxjs/toolkit/dist/tsHelpers";

/* Start Extracted from Redux source maps */
type Distribute<T> = T extends T ? T : never;

type IfNever<T, TypeIfNever, TypeIfNotNever> = [T] extends [never]
  ? TypeIfNever
  : TypeIfNotNever;

type FallbackIfNever<T, FallbackTo> = IfNever<T, FallbackTo, T>;
type Selector<
  State = any,
  Result = unknown,
  Params extends readonly any[] = any[]
> = Distribute<
  /**
   * A function that takes a state and returns data that is based on that state.
   *
   * @param state - The first argument, often a Redux root state object.
   * @param params - All additional arguments passed into the selector.
   * @returns A derived value from the state.
   */
  (state: State, ...params: FallbackIfNever<Params, []>) => Result
>;

type RemappedSelector<S extends Selector, NewState> = S extends Selector<
  any,
  infer R,
  infer P
>
  ? Selector<NewState, R, P> & {
      unwrapped: S;
    }
  : never;

/* End Extracted from Redux source maps */

export type SliceDefinedSelectors<
  TState,
  TSelector extends TrmrkSelector<TState>,
  RootState
> = {
  [K in keyof TSelector as string extends K ? never : K]: RemappedSelector<
    TSelector[K],
    RootState
  >;
};

export type TrmrkDispatcherType<TState, TPropVal> = CaseReducer<
  TState,
  PayloadAction<TPropVal>
>;

export type TrmrkSelectorType<TState, TPropVal> = (
  state: TState,
  ...args: any[]
) => TPropVal;

export type TrmrkReducer<TState> = {
  [key: string]: CaseReducer<TState, PayloadAction<any>>;
};

export type TrmrkReducerArg<TState> = SliceCaseReducers<TState>;

export type TrmrkReducerType<TState> =
  | TrmrkReducer<TState>
  | TrmrkReducerArg<TState>;

export type TrmrkSelector<TState> = SliceSelectors<TState>;

export type TrmrkSlice<
  TState,
  TReducer extends TrmrkReducerType<TState> = TrmrkReducerType<TState>,
  TSelector extends TrmrkSelector<TState> = TrmrkSelector<TState>
> = Slice<TState, TReducer, string, string, TSelector>;

export interface TrmrkSliceOps<
  TState,
  TReducer extends TrmrkReducerType<TState> = TrmrkReducerType<TState>,
  TSelector extends TrmrkSelector<TState> = TrmrkSelector<TState>
> {
  actions: CaseReducerActions<TReducer, string>;
  selectors: Id<
    SliceDefinedSelectors<
      TState,
      TSelector,
      {
        [K: string]: TState;
      }
    >
  >;
}

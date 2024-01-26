import { ValueRetriever } from "trmrk/src/FactoryRef";

import { RefState } from "./core";
import { useRefState } from "./useRefState";
import { FormState } from "./createFormState";

export class LazyFormState<
  TStateData,
  TState,
  TIn = TStateData
> extends ValueRetriever<FormState<TStateData, TState>, TIn> {}

export class RefLazyFormStatesList<TStateData, TState, TIn = TStateData> {
  public readonly list: RefState<LazyFormState<TStateData, TState, TIn>[]>;

  constructor(inputList: TIn[]) {
    this.list = useRefState(
      inputList.map((data) => new LazyFormState<TStateData, TState, TIn>(data))
    );
  }
}

export const useRefLazyFormStatesList = <TStateData, TState, TIn = TStateData>(
  inputList: TIn[]
) => new RefLazyFormStatesList<TStateData, TState, TIn>(inputList);

import { ValueRetriever } from "trmrk/src/FactoryRef";

import { RefState } from "./core";
import { useRefState } from "./useRefState";
import { FormState } from "./createFormState";

export class LazyFormState<
  TStateData,
  TState,
  TIn = TStateData
> extends ValueRetriever<FormState<TStateData, TState>, TIn> {}

export class RefLazyFormState<TStateData, TState, TIn = TStateData> {
  public readonly data: RefState<LazyFormState<TStateData, TState, TIn>>;

  constructor(inputData: TIn) {
    this.data = useRefState(new LazyFormState(inputData));
  }
}

export const useRefLazyFormState = <TStateData, TState, TIn = TStateData>(
  inputData: TIn
) => new RefLazyFormState<TStateData, TState, TIn>(inputData);

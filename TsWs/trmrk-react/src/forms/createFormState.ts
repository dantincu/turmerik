import { RefState } from "./core";

export class FormState<TStateData, TState> {
  public readonly fields: readonly RefState[];

  constructor(
    public readonly state: TState,
    public readonly dataFactory: (state: TState) => TStateData,
    fieldsRetriever: (state: TState) => RefState[]
  ) {
    const fieldsArr = fieldsRetriever(this.state);
    this.fields = Object.freeze(fieldsArr);
  }
}

export const useFormState = <TStateData, TState>(
  state: TState,
  dataFactory: (state: TState) => TStateData,
  fieldsRetriever: (state: TState) => RefState[]
) => new FormState<TStateData, TState>(state, dataFactory, fieldsRetriever);

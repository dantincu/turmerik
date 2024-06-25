export interface ReducerAction<TPayload> {
  type: string;
  payload: TPayload;
}

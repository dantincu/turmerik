import { ActionResponse } from './types';
import { NullOrUndef, VoidOrAny } from '../../core';

export class TrmrkPromise<T> {
  constructor(
    public promise: Promise<ActionResponse<T>>,
    private onError?: ((error: any) => VoidOrAny) | NullOrUndef
  ) {}

  success<T1>(
    callback: (response: ActionResponse<T>) => Promise<ActionResponse<T1>>
  ) {
    return new TrmrkPromise<T1>(
      new Promise<ActionResponse<T1>>((resolve) => {
        this.promise.then(
          (response) =>
            callback(response).then((resp) => resolve(resp), this.onError),
          this.onError
        );
      }),
      this.onError
    );
  }
}

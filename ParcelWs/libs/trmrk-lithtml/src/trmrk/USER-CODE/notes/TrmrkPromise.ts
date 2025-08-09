import { ActionResponse } from './types';

export class TrmrkPromise<T> {
  constructor(
    public promise: Promise<ActionResponse<T>>,
    private onError?: ((error: any) => void | any | unknown) | null | undefined
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

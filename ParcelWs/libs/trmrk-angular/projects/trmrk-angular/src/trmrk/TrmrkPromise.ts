import { VoidOrAny } from './core';
import { ActionResponse } from './ActionResponse';

export class TrmrkPromise<T> {
  constructor(
    public promise: Promise<ActionResponse<T>>,
    private onError: (error: ActionResponse<any>) => VoidOrAny,
    private errorToResponse: (error: any) => ActionResponse<any>
  ) {}

  success<T1>(
    callback: (response: ActionResponse<T>) => Promise<ActionResponse<T1>>
  ) {
    return new TrmrkPromise<T1>(
      new Promise<ActionResponse<T1>>((resolve) => {
        this.promise.then(
          (response) =>
            response.hasError
              ? this.onError(response)
              : callback(response).then(
                  (resp) =>
                    resp.hasError ? this.onError(resp) : resolve(resp),
                  this.onError
                ),
          (error) => this.onError(this.errorToResponse(error))
        );
      }),
      this.onError,
      this.errorToResponse
    );
  }
}

import { NullOrUndef, VoidOrAny } from './core';

export class AsyncRequestStateManager<TError = any> {
  isLoading = false;
  hasError = 0;
  errorTitle = '';
  errorMsg = '';

  constructor(
    public onSuccess: (() => VoidOrAny) | NullOrUndef = null,
    public onError: ((error: TError) => string | string[]) | NullOrUndef = null
  ) {}

  beforeSend() {
    this.isLoading = true;
    this.clearError();
  }

  success(onSuccess: (() => VoidOrAny) | NullOrUndef = null) {
    this.isLoading = false;
    this.clearError();

    if (onSuccess) {
      this.onSuccess = onSuccess;
    } else if (this.onSuccess) {
      this.onSuccess();
    }
  }

  error(
    error: TError,
    onError: ((error: TError) => string | string[]) | NullOrUndef = null
  ) {
    this.isLoading = false;
    this.hasError++;

    if (onError) {
      this.setErrorProps(error, onError);
    } else if (this.onError) {
      this.setErrorProps(error, this.onError);
    }
  }

  clearError() {
    this.hasError = 0;
    this.errorTitle = '';
    this.errorMsg = '';
  }

  setErrorProps(error: TError, onError: (error: TError) => string | string[]) {
    let errorMsg = onError(error);

    if (typeof errorMsg === 'string') {
      errorMsg = ['', errorMsg];
    }

    this.errorTitle = errorMsg[0];
    this.errorMsg = errorMsg[1];
  }
}

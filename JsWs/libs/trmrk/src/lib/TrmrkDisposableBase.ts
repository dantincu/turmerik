export abstract class TrmrkDisposableBase implements Disposable {
  private _disposeCalled = false;

  abstract disposeCore(): void;

  dispose() {
    if (!this._disposeCalled) {
      this._disposeCalled = true;
      this.disposeCore();
    }
  }

  [Symbol.dispose]() {
    this.dispose();
  }
}

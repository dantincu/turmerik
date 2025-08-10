import { NullOrUndef } from '../../trmrk/core';

export class ComponentDataMap<TData> {
  private _map: { [key: number]: TData | NullOrUndef } = {};

  public get(id: number) {
    const data = this._map[id];
    return data;
  }

  public set(id: number, data: TData) {
    this._map[id] = data;
  }

  public clear(id: number) {
    delete this._map[id];
  }
}

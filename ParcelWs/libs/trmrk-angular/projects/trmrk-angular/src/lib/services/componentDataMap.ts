export class ComponentDataMap<TData> {
  private _map: { [key: number]: TData | null | undefined } = {};

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

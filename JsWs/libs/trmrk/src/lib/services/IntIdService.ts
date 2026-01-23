export class IntIdService {
  private _nextId = 1;

  public getNextId() {
    const nextId = this._nextId++;
    return nextId;
  }

  public setNextId(nextId: number) {
    this._nextId = nextId;
  }
}

export const createIntIdService = () => new IntIdService();

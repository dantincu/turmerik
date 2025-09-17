import { Injectable } from '@angular/core';

@Injectable()
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

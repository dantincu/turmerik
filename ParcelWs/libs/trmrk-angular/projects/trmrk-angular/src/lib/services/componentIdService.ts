import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComponentIdService {
  private _nextId = 1;

  public getNextId() {
    const nextId = this._nextId++;
    return nextId;
  }
}

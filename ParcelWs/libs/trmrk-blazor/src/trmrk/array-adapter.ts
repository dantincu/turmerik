export class ArrayAdapterBase<T, TArr extends T[] | readonly T[]> {
  constructor(public readonly array: TArr) {}

  public contains(item: T) {
    const retVal = this.array.indexOf(item) >= 0;
    return retVal;
  }

  public containsAny(
    predicate: (item: T, idx: number, arr: T[] | readonly T[]) => boolean
  ) {
    const retVal = this.array.findIndex(predicate);
    return !!retVal;
  }

  public containsAnyOf(items: T[] | readonly T[]) {
    const retVal = items.findIndex((item) => this.contains(item));

    return !!retVal;
  }

  public except(items: T[] | readonly T[]) {
    const retArr = this.array.filter((item) => items.indexOf(item) < 0);
    return retArr;
  }

  public exceptAll(itemsMx: (T[] | readonly T[])[]) {
    let retArr = this.except(itemsMx[0]);

    for (let i = 1; i < itemsMx.length; i++) {
      const items = itemsMx[i];
      retArr = retArr.filter((item) => items.indexOf(item) < 0);
    }

    return retArr;
  }
}

export class ArrayAdapter<T> extends ArrayAdapterBase<T, T[]> {}

export class ReadonlyArrayAdapter<T> extends ArrayAdapterBase<T, readonly T[]> {
  constructor(array: T[] | readonly T[]) {
    super(Object.isFrozen(array) ? array : Object.freeze(array));
  }
}

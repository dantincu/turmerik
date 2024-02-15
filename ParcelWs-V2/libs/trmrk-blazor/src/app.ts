export class TrmrkBlazorApp<TInitData> {
  public data: TInitData | null = null;

  public init(initData: TInitData | string) {
    if (typeof initData === "string") {
      initData = JSON.parse(initData);
    }

    this.data = initData as TInitData;
  }

  public logData(msg?: string | null | undefined) {
    console.log(msg ?? "app data", this.data);
  }
}

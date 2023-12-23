interface MtblRefValue<T> {
    value: T;
}
interface Kvp<TKey, TValue> {
    key: TKey;
    value: TValue;
}
declare class _SyncLock1 {
    constructor(dfTimeout?: number | null | undefined);
    run(action: () => Promise<void>, timeout?: number): Promise<void>;
    get<T>(action: () => Promise<T>): Promise<T>;
}
export const core: {
    driveItem: typeof driveItem;
    notesAppConfig: typeof notesAppConfig;
    notesItem: typeof notesItem;
    notesPath: typeof notesPath;
    url: typeof url;
    allWsRegex: RegExp;
    isNonEmptyStr: (arg: any, allWsSameAsEmpty?: boolean) => boolean;
    findKvp: <TValue>(arr: TValue[] | readonly TValue[], predicate: (value: TValue, idx: number, array: TValue[] | readonly TValue[]) => boolean) => Kvp<number, TValue | null>;
    forEach: <T>(arr: T[], callback: (item: T, idx: number, arr: T[]) => boolean | void) => void;
    contains: <T_1>(arr: T_1[], item: T_1) => boolean;
    any: <T_2>(arr: T_2[], predicate: (item: T_2, idx: number, array: T_2[]) => boolean) => boolean;
    containsAnyOfArr: (inStr: string, strArr: string[] | readonly string[], matching?: MtblRefValue<Kvp<number, string | null | undefined>> | null | undefined) => boolean;
    containsAnyOfMx: (inStr: string, strMx: (string[] | readonly string[])[], matching?: MtblRefValue<Kvp<number, Kvp<number, string | null | undefined>>> | null | undefined) => boolean;
};
export const SyncLock: typeof _SyncLock1;

//# sourceMappingURL=types.d.ts.map

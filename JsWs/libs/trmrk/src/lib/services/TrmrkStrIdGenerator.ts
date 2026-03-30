import { RefLazyValue } from "../core";
import { uuidToBase36 } from "../uuid";

export abstract class TrmrkStrIdGeneratorBase {
  abstract newId(): string;
}

export class TrmrkStrIdGenerator extends TrmrkStrIdGeneratorBase {
  newId() {
    const uuid = crypto.randomUUID();
    const base36Id = uuidToBase36(uuid);
    return base36Id;
  }
}

export const defaultStrIdGenerator = new RefLazyValue(
  () => new TrmrkStrIdGenerator(),
);

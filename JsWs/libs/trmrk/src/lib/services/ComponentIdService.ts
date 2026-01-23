import { RefLazyValue } from "../core";

import { IntIdService, createIntIdService } from "./IntIdService";

export class ComponentIdService {
  constructor(private intIdService: IntIdService) {}

  public getNextId() {
    return this.intIdService.getNextId();
  }
}

export const createComponentIdService = () =>
  new ComponentIdService(createIntIdService());

export const defaultComponentIdService = new RefLazyValue<ComponentIdService>(
  () => createComponentIdService(),
);

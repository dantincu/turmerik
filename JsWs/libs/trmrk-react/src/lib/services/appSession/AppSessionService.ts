import { RefLazyValue } from "@/src/trmrk/core";

export class AppSessionService {
  async initialize() {}
}

export const createAppSessionService = () => new AppSessionService();

export const defaultAppSessionService: RefLazyValue<AppSessionService> =
  new RefLazyValue(() => createAppSessionService());

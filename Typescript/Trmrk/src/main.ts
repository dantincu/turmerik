import { TrmrkCore as TrmrkCoreType } from './core/core';

/// This class serves as root namespace for all the code that is not packed into a separate third party library
export class Trmrk {
    core = new TrmrkCoreType();

    /// Reserved for client browser apps to use an instance of this class as a root namespace for app/page specific data/functionality
    app: object | null | undefined;
}

export type TrmrkCore = TrmrkCoreType;

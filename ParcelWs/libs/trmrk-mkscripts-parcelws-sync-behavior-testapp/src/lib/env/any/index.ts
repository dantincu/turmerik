import fs from "fs";

import { turmerik } from "../../../synced-libs/trmrk-mkscripts-parcelws-sync-behavior/env/any";

const jsonStr = JSON.stringify(turmerik.getExportedMembers(), null, "  ");
fs.writeFileSync("./trmrk-mkscripts-parcelws-sync-behavior.json", jsonStr);

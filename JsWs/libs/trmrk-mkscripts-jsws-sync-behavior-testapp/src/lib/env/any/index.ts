import fs from "fs";

import { turmerik } from "../../../trmrk-mkscripts-jsws-sync-behavior/env/any";

const jsonStr = JSON.stringify(turmerik.getExportedMembers(), null, "  ");
fs.writeFileSync("./trmrk-mkscripts-jsws-sync-behavior.json", jsonStr);

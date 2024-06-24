import { v4 as uuidv4 } from "uuid";

export const newUUid = () => uuidv4().replaceAll("-", "");

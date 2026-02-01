import { NullOrUndef } from "./core";

export const joinNames = (parts: (string | NullOrUndef)[]) =>
  parts
    .filter((part) => (part ?? null) !== null)
    .map((part) => `[${part}]`)
    .join("");

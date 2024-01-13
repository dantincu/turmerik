import { getAppTitle, defaultAppTitle } from "../utils";

export const updateHtmlDocTitle = (
  title: string | null = null,
  name: string | null = null
) => {
  document.title = title ?? getAppTitle(name);
};

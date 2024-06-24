export type ScreenOrientationType =
  | "landscape-primary"
  | "landscape-secondary"
  | "portrait-primary"
  | "portrait-secondary";

export const landscapeModeTypes: readonly ScreenOrientationType[] =
  Object.freeze(["landscape-primary", "landscape-secondary"]);

export const portraitModeTypes: readonly ScreenOrientationType[] =
  Object.freeze(["portrait-primary", "portrait-secondary"]);

export const isScreenPortraitMode = () =>
  portraitModeTypes.indexOf(screen.orientation.type) >= 0;

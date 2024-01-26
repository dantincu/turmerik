type OrientationType =
  | "landscape-primary"
  | "landscape-secondary"
  | "portrait-primary"
  | "portrait-secondary";

export const landscapeModeTypes: readonly OrientationType[] = Object.freeze([
  "landscape-primary",
  "landscape-secondary",
]);

export const portraitModeTypes: readonly OrientationType[] = Object.freeze([
  "portrait-primary",
  "portrait-secondary",
]);

export const isScreenPortraitMode = () =>
  portraitModeTypes.indexOf(screen.orientation.type) >= 0;

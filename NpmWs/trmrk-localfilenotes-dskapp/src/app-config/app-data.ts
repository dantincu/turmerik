export interface AppData {}

export const reducer = (state: AppData, action: { type: string }) => {
  return {
    ...state,
  };
};

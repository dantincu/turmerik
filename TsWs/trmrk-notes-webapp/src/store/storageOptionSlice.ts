import { createSlice } from "@reduxjs/toolkit";

import trmrk from "trmrk";

import { TrmrkNotesStorageOptionData } from "../services/appData";

import {
  TrmrkNotesStorageOption,
  TrmrkStorageOption,
} from "../services/appConfig";

declare type DispatcherType<TPropVal> = (
  state: TrmrkNotesStorageOptionData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

declare type SelectorType<TPropVal> = ({
  storageOption,
}: {
  storageOption: TrmrkNotesStorageOptionData;
}) => TPropVal;

export interface StorageOptionsReducer {
  setShowSetupPage: DispatcherType<boolean>;
  setStorageOption: DispatcherType<TrmrkNotesStorageOption | null>;
  setNoteBookPath: DispatcherType<string | null>;
}

export interface StorageOptionsSelector {
  getShowSetupPage: SelectorType<boolean>;
  getStorageOption: SelectorType<TrmrkNotesStorageOption | null>;
  getNoteBookPath: SelectorType<string | null>;
}

const reducer = {
  setShowSetupPage: (state, action) => {
    state.showSetupPage = action.payload;
  },
  setStorageOption: (state, action) => {
    state.storageOption = action.payload;
  },
  setNoteBookPath: (state, action) => {
    state.noteBookPath = action.payload;
  },
} as StorageOptionsReducer;

const selector = {
  getShowSetupPage: ({ storageOption }) => storageOption.showSetupPage,
  getStorageOption: ({ storageOption }) => storageOption.storageOption,
  getNoteBookPath: ({ storageOption }) => storageOption.noteBookPath,
} as StorageOptionsSelector;

const storageOptionSlice = createSlice({
  name: "storageOption",
  initialState: {
    storageOption: null,
  } as TrmrkNotesStorageOptionData,
  reducers: {
    ...reducer,
  },
});

export const { setShowSetupPage, setStorageOption, setNoteBookPath } =
  storageOptionSlice.actions;

export const { getShowSetupPage, getStorageOption, getNoteBookPath } = selector;

export default storageOptionSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;

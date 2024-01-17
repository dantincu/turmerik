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
  setAskUser: DispatcherType<boolean>;
  setOption: DispatcherType<TrmrkNotesStorageOption | null>;
}

export interface StorageOptionsSelector {
  getAskUser: SelectorType<boolean>;
  getOption: SelectorType<TrmrkNotesStorageOption | null>;
}

const reducer = {
  setAskUser: (state, action) => {
    state.askUser = action.payload;
  },
  setOption: (state, action) => {
    state.option = action.payload;
  },
} as StorageOptionsReducer;

const selector = {
  getAskUser: ({ storageOption }) => storageOption.askUser,
  getOption: ({ storageOption }) => storageOption.option,
} as StorageOptionsSelector;

const storageOptionSlice = createSlice({
  name: "storageOption",
  initialState: {
    option: null,
  } as TrmrkNotesStorageOptionData,
  reducers: {
    ...reducer,
  },
});

export const { setAskUser, setOption } = storageOptionSlice.actions;

export const { getAskUser, getOption } = selector;

export default storageOptionSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;

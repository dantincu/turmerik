import { createSlice } from "@reduxjs/toolkit";

import { FilesHcyHistory, FilesHcyHistoryItem } from "../services/appData";

declare type DispatcherType<TPropVal> = (
  state: FilesHcyHistory,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface FilesHcyHistoryReducer {
  filesHcyHistoryGoBack: DispatcherType<void>;
  filesHcyHistoryGoForward: DispatcherType<void>;
  filesHcyHistoryPush: DispatcherType<FilesHcyHistoryItem>;
  filesHcyHistoryInsert: DispatcherType<{
    idx: number;
    items: FilesHcyHistoryItem[];
    currentIdx: number | null | undefined;
  }>;
  filesHcyHistoryReplace: DispatcherType<FilesHcyHistory>;
}

const reducer = {
  filesHcyHistoryGoBack: (state) => {
    if ((state.currentIdx ?? -1) > 0) {
      state.currentIdx!--;
      state.currentItem = state.items[state.currentIdx!];
    } else {
      state.currentIdx = null;
      state.currentItem = null;
    }
  },
  filesHcyHistoryGoForward: (state) => {
    if (
      typeof state.currentIdx === "number" &&
      state.items.length - state.currentIdx > 1
    ) {
      state.currentIdx++;
      state.currentItem = state.items[state.currentIdx!];
    }
  },
  filesHcyHistoryPush: (state, action) => {
    if (typeof state.currentIdx === "number") {
      if (state.items.length - state.currentIdx > 1) {
        state.items.splice(
          state.currentIdx + 1,
          state.items.length - state.currentIdx - 1
        );
      }

      state.currentIdx++;
    } else {
      state.currentIdx = 0;
    }

    state.currentItem = action.payload;
    state.items.push(state.currentItem!);
  },
  filesHcyHistoryInsert: (state, action) => {
    const { items, idx, currentIdx } = action.payload;
    state.items.splice(idx ?? 0, 0, ...items);
    state.currentIdx = currentIdx ?? (state.currentIdx ?? -1) + items.length;
    state.currentItem = state.items[state.currentIdx];
  },
  filesHcyHistoryReplace: (state, action) => {
    const newState = action.payload as FilesHcyHistory;
    state.items = newState.items ?? [];
    state.currentIdx = newState.currentIdx ?? state.items.length - 1;
    state.currentItem = newState.currentItem;

    if (!state.currentItem) {
      if (state.currentIdx >= 0) {
        state.currentItem = state.items[state.currentIdx];
      } else {
        state.currentItem = null;
      }
    }
  },
} as FilesHcyHistoryReducer;

const filesHcyHistorySlice = createSlice({
  name: "filesHcyHistory",
  initialState: {
    items: [],
    currentIdx: null,
    currentItem: null,
  } as FilesHcyHistory,
  reducers: {
    ...reducer,
  },
});

export const {
  filesHcyHistoryGoBack,
  filesHcyHistoryGoForward,
  filesHcyHistoryPush,
  filesHcyHistoryInsert,
  filesHcyHistoryReplace,
} = filesHcyHistorySlice.actions;

export default filesHcyHistorySlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;

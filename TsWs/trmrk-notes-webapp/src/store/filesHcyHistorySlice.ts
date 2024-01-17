import { createSlice } from "@reduxjs/toolkit";

import { FilesHcyHistory, FilesHcyHistoryItem } from "../services/appData";

declare type DispatcherType<TPropVal> = (
  state: FilesHcyHistory,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

declare type SelectorType<TPropVal> = ({
  filesHcyHistory,
}: {
  filesHcyHistory: FilesHcyHistory;
}) => TPropVal;

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

export interface FilesHcyHistorySelector {
  getItems: SelectorType<FilesHcyHistoryItem[]>;
  getCurrentIdx: SelectorType<number | null | undefined>;
  getCurrentItem: SelectorType<FilesHcyHistoryItem | null | undefined>;
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

const selector = {
  getItems: ({ filesHcyHistory }) => filesHcyHistory.items,
  getCurrentIdx: ({ filesHcyHistory }) => filesHcyHistory.currentIdx,
  getCurrentItem: ({ filesHcyHistory }) => filesHcyHistory.currentItem,
} as FilesHcyHistorySelector;

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

export const { getCurrentIdx, getCurrentItem, getItems } = selector;

export default filesHcyHistorySlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;

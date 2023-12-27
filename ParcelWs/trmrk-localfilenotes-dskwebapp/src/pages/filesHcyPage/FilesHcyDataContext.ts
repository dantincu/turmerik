import React from "react";

import {
  FilesHcyData,
  FilesHcyHistoryItem,
  FilesHcyHistory,
  filesHcyCtxActions,
} from "./FilesHcyData";

export const FilesHcyContext = React.createContext({} as FilesHcyData);

export const createFilesHcyContext = (
  state: FilesHcyData,
  dispatch: React.Dispatch<{
    type: string;
    payload: any;
  }>
) => {
  return {
    ...state,
    historyGoBack: () => {
      dispatch({
        type: filesHcyCtxActions.HISTORY_GO_BACK,
        payload: null,
      });
    },
    historyGoForward: () => {
      dispatch({
        type: filesHcyCtxActions.HISTORY_GO_FORWARD,
        payload: null,
      });
    },
    historyPush: (item: FilesHcyHistoryItem) => {
      dispatch({
        type: filesHcyCtxActions.HISTORY_PUSH,
        payload: item,
      });
    },
    historyReplace: (history: FilesHcyHistory) => {
      dispatch({
        type: filesHcyCtxActions.HISTORY_REPLACE,
        payload: history,
      });
    },
  };
};

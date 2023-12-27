export interface FilesHcyHistoryItem {
  idnf: string;
}

export interface FilesHcyHistory {
  items: FilesHcyHistoryItem[];
  currentIdx: number | null | undefined;
  currentItem: FilesHcyHistoryItem | null | undefined;
}

export interface FilesHcyData {
  history: FilesHcyHistory;
  historyGoBack: () => void;
  historyGoForward: () => void;
  historyPush: (item: FilesHcyHistoryItem) => void;
  historyReplace: (history: FilesHcyHistory) => void;
}

export const filesHcyCtxActions = Object.freeze({
  HISTORY_GO_BACK: "HISTORY_GO_BACK",
  HISTORY_GO_FORWARD: "HISTORY_GO_FORWARD",
  HISTORY_PUSH: "HISTORY_PUSH",
  HISTORY_REPLACE: "HISTORY_REPLACE",
});

export const filesHcyCtxReducer = (
  state: FilesHcyData,
  action: { type: string; payload: any }
) => {
  const retState = { ...state };
  const history = retState.history;

  switch (action.type) {
    case filesHcyCtxActions.HISTORY_GO_BACK:
      if ((history.currentIdx ?? -1) > 0) {
        history.currentIdx!--;
        history.currentItem = history.items[history.currentIdx!];
      } else {
        history.currentIdx = null;
        history.currentItem = null;
      }

      break;
    case filesHcyCtxActions.HISTORY_GO_FORWARD:
      if (
        typeof history.currentIdx === "number" &&
        history.items.length - history.currentIdx > 1
      ) {
        history.currentIdx++;
        history.currentItem = history.items[history.currentIdx!];
      }
      break;
    case filesHcyCtxActions.HISTORY_PUSH:
      if (typeof history.currentIdx === "number") {
        if (history.items.length - history.currentIdx > 1) {
          history.items.splice(
            history.currentIdx + 1,
            history.items.length - history.currentIdx - 1
          );
        }

        history.currentIdx++;
      } else {
        history.currentIdx = 0;
      }

      history.currentItem = action.payload;
      history.items.push(history.currentItem!);

      break;
    case filesHcyCtxActions.HISTORY_REPLACE:
      const newHistory = action.payload as FilesHcyHistory;
      history.items = newHistory.items ?? [];
      history.currentIdx = newHistory.currentIdx ?? history.items.length - 1;
      history.currentItem = newHistory.currentItem;

      if (!history.currentItem) {
        if (history.currentIdx >= 0) {
          history.currentItem = history.items[history.currentIdx];
        } else {
          history.currentItem = null;
        }
      }

      break;
  }

  return retState;
};

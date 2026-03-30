"use client";

import { RefLazyValue } from "@/src/trmrk/core";

import {
  AppSession,
  AppSessionTab,
} from "@/src/trmrk-browser/indexedDB/databases/AppSessions";

import {
  openDbRequestToPromise,
  dbRequestToPromise,
} from "@/src/trmrk-browser/indexedDB/core";

import { basicDbAggregator } from "@/src/trmrk-browser/indexedDB/dbAggregators/BasicDbAggregator";
import {
  mapPropNamesToThemselves,
  PropNameWordsConvention,
} from "@/src/trmrk/propNames";

export const sessionUrlQueryKeys = mapPropNamesToThemselves(
  {
    tabId: "",
    sessionId: "",
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase,
);

export class AppSessionService {
  session!: AppSession;

  async initialize() {
    while (!this.session) {
      await this.initializeCore();
    }

    const url = new URL(window.location.href);
    url.searchParams.set(sessionUrlQueryKeys.sessionId, this.session.sessionId);
    window.history.replaceState(null, "", url.href);
  }

  async initializeCore() {
    const appSessionsDbAdapter = basicDbAggregator.value.appSessions.value;
    const db = await openDbRequestToPromise(appSessionsDbAdapter.open());

    const appSessionsStore = appSessionsDbAdapter.stores.appSessions.store(
      db.value,
      null,
      "readwrite",
    );

    let appSessions = await dbRequestToPromise<AppSession[]>(
      appSessionsStore.getAll(),
    );

    if (appSessions.value.length) {
      appSessions.value.sort((a, b) => b.createdAtMillis - a.createdAtMillis);
      this.session = appSessions.value[0];
    } else {
      const timeStamp = Date.now();

      const newSession: AppSession = {
        sessionId: crypto.randomUUID(),
        createdAtMillis: timeStamp,
        defaultAsOf: timeStamp,
      };

      await dbRequestToPromise(appSessionsStore.add(newSession));

      appSessions = await dbRequestToPromise<AppSession[]>(
        appSessionsStore.getAll(),
      );

      if (appSessions.value.length > 1) {
        await dbRequestToPromise(
          appSessionsStore.delete(appSessions.value[0].sessionId),
        );
      } else {
        this.session = newSession;
      }
    }
  }
}

export const createAppSessionService = () => new AppSessionService();

export const defaultAppSessionService: RefLazyValue<AppSessionService> =
  new RefLazyValue(() => createAppSessionService());

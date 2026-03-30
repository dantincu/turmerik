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

import { defaultTimeStampGenerator } from "@/src/trmrk/services/TimeStampGenerator";
import { defaultStrIdGenerator } from "@/src/trmrk/services/TrmrkStrIdGenerator";

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
      let defaultAppSessions = appSessions.value.filter(
        (s) => (s.defaultAsOf ?? null) !== null,
      );

      if (defaultAppSessions.length) {
        defaultAppSessions.sort(
          (a, b) => (b.defaultAsOf ?? 0) - (a.defaultAsOf ?? 0),
        );

        this.session = defaultAppSessions[0];
      } else {
        appSessions.value.sort((a, b) => b.createdAtMillis - a.createdAtMillis);
        this.session = appSessions.value[0];
      }
    } else {
      const timeStamp = defaultTimeStampGenerator.value.millis();

      const newSession: AppSession = {
        sessionId: defaultStrIdGenerator.value.newId(),
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

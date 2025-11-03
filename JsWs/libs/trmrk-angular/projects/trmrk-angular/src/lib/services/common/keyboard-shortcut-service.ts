import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  BasicAppSettingsDbAdapter,
  KeyPress,
  KeyboardShortcut,
  KeyboardShortcutSrlzbl,
} from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { NullOrUndef } from '../../../trmrk/core';

import { TrmrkObservable } from './TrmrkObservable';
import { KeyboardShortcutMatcher } from './keyboard-shortcut-matcher-service';
import { unsubscribeAll } from './rxjs/subscription';
import { IndexedDbDatabasesServiceCore } from './indexedDb/indexed-db-databases-service-core';

export interface KeyboardShortcutServiceSetupArgs {
  shortcuts: KeyboardShortcut[];
}

export interface KeyboardShortcutContainerCore {
  containerElRetriever?: (() => HTMLElement | NullOrUndef) | NullOrUndef;
  considerShortcutPredicate?: ((event: Event) => boolean) | NullOrUndef;
  componentId: number;
}

export interface KeyboardShortcutContainer extends KeyboardShortcutContainerCore {
  scopes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutService implements OnDestroy {
  shortcuts: KeyboardShortcut[] = [];
  scopeObserversMap: { [scope: string]: TrmrkObservable<KeyboardShortcut> } = {};

  private sharedBasicAppSettings: BasicAppSettingsDbAdapter;
  private readonly containers: KeyboardShortcutContainer[] = [];

  constructor(
    private keyboardShortcutMatcher: KeyboardShortcutMatcher,
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore
  ) {
    this.sharedBasicAppSettings = indexedDbDatabasesService.basicAppSettings.value;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.shortcuts = [];
    this.containers.splice(0, this.containers.length);
    this.scopeObserversMap = {};
  }

  setup(args: KeyboardShortcutServiceSetupArgs): Promise<void> {
    return new Promise((resolve, reject) => {
      const arr = (this.shortcuts = args.shortcuts)
        .map((s) => s.scopes)
        .reduce((s1, s2) => [...s1, ...s2.filter((s) => !s1.includes(s))], [])
        .map((s) => ({ key: s, obs: new TrmrkObservable<KeyboardShortcut>(null!) }));

      for (let obj of arr) {
        this.scopeObserversMap[obj.key] = obj.obs;
      }

      this.sharedBasicAppSettings.open(
        (_, db) => {
          const req = this.sharedBasicAppSettings.stores.keyboardShortcuts.store(db).getAll();

          req.onsuccess = (event) => {
            const target = event.target as IDBRequest<KeyboardShortcutSrlzbl[]>;

            for (let srlzbl of target.result) {
              const shortcut = this.shortcuts.find((s) => s.name === srlzbl.name);

              if (shortcut) {
                shortcut.enabled = srlzbl.enabled;

                if (srlzbl.sequence) {
                  shortcut.sequence = srlzbl.sequence;
                }
              }
            }

            for (let shortcut of this.shortcuts) {
              shortcut.enabled ??= true;
            }

            this.keyboardShortcutMatcher.setup({
              shortcuts: this.shortcuts,
              containers: this.containers,
            });

            resolve();
          };

          req.onerror = (event) => {
            const target = event.target as IDBRequest;
            reject(target.error);
          };
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  }

  registerContainer(container: KeyboardShortcutContainer) {
    this.containers.push(container);
  }

  unRegisterContainer(componentId: number) {
    const idx = this.containers.findIndex((c) => c.componentId === componentId);

    if (idx >= 0) {
      this.containers.splice(idx, 1);
    }
  }

  subscribeToScope(
    scope: string,
    keyboardShortcutHandlersMap: {
      [name: string]: (keyboardShortcut: KeyboardShortcut) => void;
    }
  ) {
    const subscription = this.scopeObserversMap[scope].subscribe((shortcut) => {
      const handler = keyboardShortcutHandlersMap[shortcut.name];

      if (handler) {
        handler(shortcut);
      }
    });

    return subscription;
  }

  registerAndSubscribeToScopes(
    container: KeyboardShortcutContainerCore,
    scopeHandlersMap: {
      [scope: string]: {
        [name: string]: (keyboardShortcut: KeyboardShortcut) => void;
      };
    }
  ) {
    const containerToRegister = container as KeyboardShortcutContainer;
    const scopesArr = Object.keys(scopeHandlersMap);
    containerToRegister.scopes ??= scopesArr;
    this.registerContainer(containerToRegister);

    const subscriptions: Subscription[] = scopesArr.map((scope) =>
      this.subscribeToScope(scope, scopeHandlersMap[scope])
    );

    return subscriptions;
  }

  unregisterAndUnsubscribeFromScopes(componentId: number, subscriptions: Subscription[]) {
    this.unRegisterContainer(componentId);
    unsubscribeAll(subscriptions);
  }

  handleKeyDown(event: KeyboardEvent) {
    const matching = this.keyboardShortcutMatcher.fullyMatchesShortcutSequence(event);

    if (matching) {
      const shortcut = this.shortcuts.find((s) => s.name === matching.name);

      if (shortcut) {
        for (let scope of shortcut.scopes) {
          const obs = this.scopeObserversMap[scope];
          obs?.next(shortcut);
        }

        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
}

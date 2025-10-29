import { Injectable, OnDestroy } from '@angular/core';

import {
  KeyPress,
  KeyboardShortcut,
} from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { KeyboardShortcutContainer } from './keyboard-shortcut-service';

export interface KeyboardShortcutMatcherSetupArgs {
  shortcuts: KeyboardShortcut[];
  containers: KeyboardShortcutContainer[];
}

export interface PartialMatchResult {
  shortcut: KeyboardShortcut;
  matchedLength: number;
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutMatcher implements OnDestroy {
  shortcuts: KeyboardShortcut[] = [];
  partialMatches: PartialMatchResult[] = [];
  containers: KeyboardShortcutContainer[] = [];

  constructor() {}

  ngOnDestroy(): void {
    this.shortcuts = [];
    this.partialMatches = [];
    this.containers = [];
  }

  setup(args: KeyboardShortcutMatcherSetupArgs) {
    this.shortcuts = args.shortcuts;
    this.containers = args.containers;
  }

  fullyMatchesShortcutSequence(event: KeyboardEvent): KeyboardShortcut | null {
    let match: KeyboardShortcut | null = null;

    if (this.partialMatches.length > 0) {
      let i = 0;

      while (i < this.partialMatches.length) {
        const pm = this.partialMatches[i];

        if (this.keyboardEventMatchesKeyPress(event, pm.shortcut.sequence[pm.matchedLength])) {
          if (pm.matchedLength === pm.shortcut.sequence.length - 1) {
            if (
              this.containers.some(
                (c) =>
                  this.containerMatchesShortcut(pm.shortcut, c) &&
                  this.containerMatchesKeyboardEvent(c, event)
              )
            ) {
              match = pm.shortcut;
              this.partialMatches = [];
              break;
            } else {
              this.partialMatches.splice(i, 1);
            }
          } else if (pm.matchedLength >= pm.shortcut.sequence.length) {
            this.partialMatches.splice(i, 1);
          } else {
            pm.matchedLength++;
            i++;
          }
        } else {
          this.partialMatches.splice(i, 1);
        }
      }
    }

    if (match === null) {
      const matchingContainers = this.containers.filter((c) =>
        this.containerMatchesKeyboardEvent(c, event)
      );

      if (matchingContainers.length > 0) {
        const newPartialMatches: PartialMatchResult[] = this.shortcuts
          .filter(
            (s) =>
              s.enabled &&
              matchingContainers.some((c) => this.containerMatchesShortcut(s, c)) &&
              this.keyboardEventMatchesKeyPress(event, s.sequence[0])
          )
          .map((s) => ({
            shortcut: s,
            matchedLength: 1,
          }));

        match =
          newPartialMatches.find((pm) => pm.matchedLength === pm.shortcut.sequence.length)
            ?.shortcut ?? null;

        if (match === null) {
          this.partialMatches.push(...newPartialMatches);
        } else {
          this.partialMatches = [];
        }
      }
    }

    return match;
  }

  containerMatchesShortcut(
    shortcut: KeyboardShortcut,
    container: KeyboardShortcutContainer
  ): boolean {
    const matches = shortcut.scopes.some((s) => container.scopes.includes(s));
    return matches;
  }

  containerMatchesKeyboardEvent(container: KeyboardShortcutContainer, event: KeyboardEvent) {
    let matches: boolean;

    if (container.considerShortcutPredicate) {
      matches = container.considerShortcutPredicate(event);
    } else if (container.containerElRetriever) {
      matches = container.containerElRetriever()?.contains(event.target as Node) ?? true;
    } else {
      matches = true;
    }

    return matches;
  }

  keyboardEventMatchesKeyPress(event: KeyboardEvent, keyPress: KeyPress): boolean {
    if (event.key.toLowerCase() !== keyPress.key.toLowerCase()) {
      return false;
    }

    if ((event.ctrlKey || false) !== (keyPress.ctrlKey || false)) {
      return false;
    }

    if ((event.shiftKey || false) !== (keyPress.shiftKey || false)) {
      return false;
    }

    if ((event.altKey || false) !== (keyPress.altKey || false)) {
      return false;
    }

    if ((event.metaKey || false) !== (keyPress.metaKey || false)) {
      return false;
    }

    return true;
  }
}

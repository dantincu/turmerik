import { Subscription } from 'rxjs';
import { NullOrUndef } from '../../../../trmrk/core';

export const unsubscribeAll = (
  subscriptions: Subscription[] | NullOrUndef,
  clearSubscriptionsArray = true
) => {
  if (subscriptions) {
    subscriptions.forEach((sub) => sub.unsubscribe());

    if (clearSubscriptionsArray) {
      subscriptions.splice(0, subscriptions.length);
    }
  }
};

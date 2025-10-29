import { Observable } from 'rxjs';
import { take, catchError, finalize } from 'rxjs/operators';

export const observableToPromise = <T>(observable: Observable<T>): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const subscription = observable
      .pipe(
        take(1), // Ensure only one emission
        catchError((err) => {
          reject(err);
          return []; // Return empty observable to complete stream
        }),
        finalize(() => subscription.unsubscribe()) // Clean up
      )
      .subscribe({
        next: resolve,
        error: reject, // Just in case catchError doesn't catch everything
      });
  });
};

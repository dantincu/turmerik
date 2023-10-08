using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Async
{
    public interface IAsyncMessageQueuerFactory
    {
        IAsyncMessageQueuer<T> Queuer<T>(
            AsyncMessageQueuerOpts<T> opts);

        IAsyncMessageQueuer<T> Queuer<T>(
            Action<T> valueCallback,
            Func<Exception, bool> unhandledErrorCallback = null,
            Action<ConcurrentQueue<T>> alwaysCallback = null,
            int? spinWaitCount = null,
            int? waitMillis = null);
    }

    public class AsyncMessageQueuerFactory : IAsyncMessageQueuerFactory
    {
        public IAsyncMessageQueuer<T> Queuer<T>(
            AsyncMessageQueuerOpts<T> opts) => new AsyncMessageQueuer<T>(
                NormalizeOpts(opts));

        public IAsyncMessageQueuer<T> Queuer<T>(
            Action<T> valueCallback,
            Func<Exception, bool> unhandledErrorCallback = null,
            Action<ConcurrentQueue<T>> alwaysCallback = null,
            int? spinWaitCount = null,
            int? waitMillis = null) => Queuer(
                new AsyncMessageQueuerOpts<T>
                {
                    ValueCallback = valueCallback ?? throw new ArgumentNullException(
                        nameof(valueCallback)),
                    UnhandledErrorCallback = unhandledErrorCallback,
                    AlwaysCallback = alwaysCallback,
                    SpinWaitCount = spinWaitCount ?? AsyncH.DEFAULT_SPIN_WAIT_COUNT,
                    WaitMillis = waitMillis ?? AsyncH.DEFAULT_WAIT_MILLIS
                });

        private AsyncMessageQueuerOpts<T> NormalizeOpts<T>(
            AsyncMessageQueuerOpts<T> opts) => new AsyncMessageQueuerOpts<T>(opts).ActWith(nOpts =>
            {
                nOpts.UnhandledErrorCallback ??= exc => true;

                nOpts.AlwaysCallback ??= queue =>
                {
                    while (queue.TryDequeue(out _))
                    {
                    }
                };
            });
    }
}

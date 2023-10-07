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
            Action<T> valueCallback,
            int? defaultWaitMillis = null);
    }

    public class AsyncMessageQueuerFactory : IAsyncMessageQueuerFactory
    {
        public IAsyncMessageQueuer<T> Queuer<T>(
            Action<T> valueCallback,
            int? defaultWaitMillis = null) => new AsyncMessageQueuer<T>(
                new ConcurrentQueue<T>(),
                valueCallback,
                defaultWaitMillis ?? AsyncH.DEFAULT_WAIT_MILLIS);
    }
}

using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Core.Threading
{
    public interface ISynchronizedValueAdapterFactory
    {
        ISynchronizedValueAdapter<TValue> Create<TValue>(
            SemaphoreSlim semaphore = null,
            IEqualityComparer<TValue> eqCompr = null,
            TValue initialValue = default);
    }

    public class SynchronizedValueAdapterFactory : ISynchronizedValueAdapterFactory
    {
        public ISynchronizedValueAdapter<TValue> Create<TValue>(
            SemaphoreSlim semaphore = null,
            IEqualityComparer<TValue> eqCompr = null,
            TValue initialValue = default) => new SynchronizedValueAdapter<TValue>(
                semaphore ?? new SemaphoreSlim(1),
                eqCompr ?? EqualityComparer<TValue>.Default,
                initialValue);
    }
}

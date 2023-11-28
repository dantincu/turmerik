using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Core.Threading
{
    public interface ISynchronizedValueWrapperFactory
    {
        ISynchronizedValueWrapper<TValue> Create<TValue>(
            SemaphoreSlim semaphore = null,
            IEqualityComparer<TValue> eqCompr = null,
            TValue initialValue = default);
    }

    public class SynchronizedValueWrapperFactory : ISynchronizedValueWrapperFactory
    {
        public ISynchronizedValueWrapper<TValue> Create<TValue>(
            SemaphoreSlim semaphore = null,
            IEqualityComparer<TValue> eqCompr = null,
            TValue initialValue = default) => new SynchronizedValueWrapper<TValue>(
                semaphore ?? new SemaphoreSlim(1),
                eqCompr ?? EqualityComparer<TValue>.Default,
                initialValue);
    }
}

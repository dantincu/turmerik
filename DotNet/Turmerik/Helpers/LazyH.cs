using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Turmerik.Helpers
{
    public static class LazyH
    {
        public static Lazy<T> Lazy<T>(
            Func<T> factory,
            LazyThreadSafetyMode lazyThreadSafetyMode) => new Lazy<T>(
                factory,
                lazyThreadSafetyMode);

        public static Lazy<T> Lazy<T>(
            Func<T> factory) => new Lazy<T>(
                factory);

        public static Lazy<T> SyncLazy<T>(
            Func<T> factory) => new Lazy<T>(
                factory,
                LazyThreadSafetyMode.ExecutionAndPublication);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Helpers
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

        public static MutableLazy<T> MtblLazy<T>(
            Func<T> factory,
            LazyThreadSafetyMode lazyThreadSafetyMode) => new MutableLazy<T>(
                factory,
                lazyThreadSafetyMode);

        public static MutableLazy<T> MtblLazy<T>(
            Func<T> factory) => new MutableLazy<T>(
                factory);

        public static MutableLazy<T> MtblSyncLazy<T>(
            Func<T> factory) => new MutableLazy<T>(
                factory,
                LazyThreadSafetyMode.ExecutionAndPublication);

        public static DisposableMutableLazy<T> DspMtblLazy<T>(
            Func<T> factory,
            LazyThreadSafetyMode lazyThreadSafetyMode)
            where T : IDisposable => new DisposableMutableLazy<T>(
                factory,
                lazyThreadSafetyMode);

        public static DisposableMutableLazy<T> DspMtblLazy<T>(
            Func<T> factory)
            where T : IDisposable => new DisposableMutableLazy<T>(
                factory);

        public static DisposableMutableLazy<T> DspMtblSyncLazy<T>(
            Func<T> factory)
            where T : IDisposable => new DisposableMutableLazy<T>(
                factory,
                LazyThreadSafetyMode.ExecutionAndPublication);
    }
}

﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Utility
{
    public class DisposableMutableLazy<T> : MutableLazy<T>, IDisposable
        where T : IDisposable
    {
        public DisposableMutableLazy(
            Func<T> factory,
            LazyThreadSafetyMode lazyThreadSafetyMode = LazyThreadSafetyMode.None) : base(
                factory,
                lazyThreadSafetyMode)
        {
        }

        public void Dispose()
        {
            var value = this.Value;
            value?.Dispose();
        }
    }
}

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Async
{
    public class AsyncMessageQueuerOpts<T>
    {
        public AsyncMessageQueuerOpts()
        {
        }

        public AsyncMessageQueuerOpts(AsyncMessageQueuerOpts<T> src)
        {
            ValueCallback = src.ValueCallback;
            UnhandledErrorCallback = src.UnhandledErrorCallback;
            AlwaysCallback = src.AlwaysCallback;
            SpinWaitCount = src.SpinWaitCount;
            WaitMillis = src.WaitMillis;
        }

        public Action<T> ValueCallback { get; set; }
        public Func<Exception, bool> UnhandledErrorCallback { get; set; }
        public Action<ConcurrentQueue<T>> AlwaysCallback { get; set; }
        public int SpinWaitCount { get; set; }
        public int WaitMillis { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Core.Threading
{
    public class IntermitentBackgroundWorkerOpts
    {
        public SemaphoreSlim Semaphore { get; set; }
        public Action LoopCallback { get; set; }
    }
}

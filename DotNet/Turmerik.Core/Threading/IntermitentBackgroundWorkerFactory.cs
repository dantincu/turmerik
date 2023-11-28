using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Core.Threading
{
    public interface IIntermitentBackgroundWorkerFactory
    {
        IIntermitentBackgroundWorker Worker(
            IntermitentBackgroundWorkerOpts opts);
    }

    public class IntermitentBackgroundWorkerFactory : IIntermitentBackgroundWorkerFactory
    {
        public IIntermitentBackgroundWorker Worker(
            IntermitentBackgroundWorkerOpts opts)
        {
            opts.Semaphore ??= new SemaphoreSlim(1);

            var worker = new IntermitentBackgroundWorker(opts);
            return worker;
        }
    }
}

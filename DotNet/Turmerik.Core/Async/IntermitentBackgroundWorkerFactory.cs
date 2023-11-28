using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Async
{
    public interface IIntermitentBackgroundWorkerFactory
    {
        IIntermitentBackgroundWorker Worker(
            IntermitentBackgroundWorkerOpts opts);
    }

    public class IntermitentBackgroundWorkerFactory : IIntermitentBackgroundWorkerFactory
    {
        public IIntermitentBackgroundWorker Worker(
            IntermitentBackgroundWorkerOpts opts) => new IntermitentBackgroundWorker(opts);
    }
}

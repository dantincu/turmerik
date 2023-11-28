using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Async;

namespace Turmerik.UnitTests
{
    public class IntermitentBackgroundWorkerUnitTest : UnitTestBase
    {
        private readonly IIntermitentBackgroundWorkerFactory workerFactory;

        public IntermitentBackgroundWorkerUnitTest()
        {
            workerFactory = SvcProv.GetRequiredService<IIntermitentBackgroundWorkerFactory>();
        }

        [Fact]
        public void MainTest()
        {
            int idx = 0;
            IIntermitentBackgroundWorker worker = null;

            worker = workerFactory.Worker(new IntermitentBackgroundWorkerOpts
            {
                LoopCallback = () =>
                {
                    if (++idx >= 10)
                    {
                        worker.Stop();
                    }
                }
            });

            worker.Start();

            while (worker.IsActive)
            {
                Thread.Sleep(100);
            }

            Assert.Equal(10, idx);
        }
    }
}

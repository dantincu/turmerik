using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Core.Threading
{
    public interface IBackgroundCleanupComponent<TComponent>
        where TComponent : IDisposable
    {
        void EnqueueForCleanup(TComponent component);
    }

    public class BackgroundCleanupComponent<TComponent> : IBackgroundCleanupComponent<TComponent>
        where TComponent : IDisposable
    {
        public BackgroundCleanupComponent(
            IIntermitentBackgroundWorkerFactory intermitentBackgroundWorkerFactory,
            ConcurrentQueue<TComponent> components)
        {
            BgWorker = intermitentBackgroundWorkerFactory.Worker(new IntermitentBackgroundWorkerOpts
            {
                LoopCallback = PerformCleanup
            });

            Components = components ?? throw new ArgumentNullException(
                nameof(components));
        }

        protected ConcurrentQueue<TComponent> Components { get; }
        protected IIntermitentBackgroundWorker BgWorker { get; }

        public void EnqueueForCleanup(TComponent component)
        {
            Components.Enqueue(component);
            BgWorker.Start();
        }

        protected void PerformCleanup()
        {
            if (Components.TryDequeue(out var component))
            {
                component.Dispose();
            }
            else
            {
                BgWorker.Stop();
            }
        }
    }
}

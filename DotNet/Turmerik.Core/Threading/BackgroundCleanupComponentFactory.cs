using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace Turmerik.Core.Threading
{
    public interface IBackgroundCleanupComponentFactory
    {
        IBackgroundCleanupComponent<TComponent> Create<TComponent>(
            ConcurrentQueue<TComponent> components = null) where TComponent : IDisposable;
    }

    public class BackgroundCleanupComponentFactory : IBackgroundCleanupComponentFactory
    {
        IIntermitentBackgroundWorkerFactory intermitentBackgroundWorkerFactory;

        public BackgroundCleanupComponentFactory(
            IIntermitentBackgroundWorkerFactory intermitentBackgroundWorkerFactory)
        {
            this.intermitentBackgroundWorkerFactory = intermitentBackgroundWorkerFactory ?? throw new ArgumentNullException(nameof(intermitentBackgroundWorkerFactory));
        }

        public IBackgroundCleanupComponent<TComponent> Create<TComponent>(
            ConcurrentQueue<TComponent> components = null) where TComponent : IDisposable => new BackgroundCleanupComponent<TComponent>(
                intermitentBackgroundWorkerFactory,
                components ?? new ConcurrentQueue<TComponent>());
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.Threading;

namespace Turmerik.WinForms.Controls
{
    public interface IPropChangedEventAdapterFactory
    {
        PropChangedEventAdapter<TPropVal, TEventArgs> Create<TPropVal, TEventArgs>(
            PropChangedEventAdapterOpts<TPropVal, TEventArgs> opts,
            SemaphoreSlim semaphore = null,
            bool initialValue = true);
    }

    public class PropChangedEventAdapterFactory : IPropChangedEventAdapterFactory
    {
        private readonly ISynchronizedValueAdapterFactory synchronizedValueAdapterFactory;

        public PropChangedEventAdapterFactory(
            ISynchronizedValueAdapterFactory synchronizedValueAdapterFactory)
        {
            this.synchronizedValueAdapterFactory = synchronizedValueAdapterFactory ?? throw new ArgumentNullException(nameof(synchronizedValueAdapterFactory));
        }

        public PropChangedEventAdapter<TPropVal, TEventArgs> Create<TPropVal, TEventArgs>(
            PropChangedEventAdapterOpts<TPropVal, TEventArgs> opts,
            SemaphoreSlim semaphore = null,
            bool initialValue = true) => new PropChangedEventAdapter<TPropVal, TEventArgs>(
                opts.ActWith(opts =>
                {
                    opts.SynchronizedValueAdapter ??= synchronizedValueAdapterFactory.Create(
                        semaphore, null, initialValue);
                }));
    }
}

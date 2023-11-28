using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Threading;
using Turmerik.Core.Utility;
using Turmerik.Core.Helpers;

namespace Turmerik.WinForms.Controls
{
    public interface IPropChangedEventAdapter<TPropVal, TEventArgs>
    {
        Func<TPropVal> PropValGetter { get; }

        bool WithEventSuspended(
            Action<bool> action);

        bool FireEventIfRequired(
            object source,
            TEventArgs evtArgs);
    }

    public class PropChangedEventAdapter<TPropVal, TEventArgs> : IPropChangedEventAdapter<TPropVal, TEventArgs>
    {
        private readonly ISynchronizedValueAdapter<bool> synchronizedValueAdapter;

        public PropChangedEventAdapter(
            PropChangedEventAdapterOpts<TPropVal, TEventArgs> opts)
        {
            synchronizedValueAdapter = opts.SynchronizedValueAdapter ?? throw new ArgumentNullException(
                nameof(synchronizedValueAdapter));

            PropValGetter = opts.PropValGetter ?? throw new ArgumentNullException(
                nameof(PropValGetter));

            EnabledHandler = opts.EnabledHandler ?? throw new ArgumentNullException(
                nameof(EnabledHandler));

            DisabledHandler = opts.DisabledHandler.FirstNotNull(
                (source, evtArgs, propVal) => { });

            BeforeHandler = opts.BeforeHandler.FirstNotNull(
                (source, evtArgs, propVal, wasEnabled) => { });

            AfterHandler = opts.AfterHandler.FirstNotNull(
                (source, evtArgs, propVal, wasEnabled) => { });
        }

        public Func<TPropVal> PropValGetter { get; }

        protected Action<object, TEventArgs, TPropVal> EnabledHandler { get; }
        protected Action<object, TEventArgs, TPropVal> DisabledHandler { get; }
        protected Action<object, TEventArgs, TPropVal, bool> BeforeHandler { get; }
        protected Action<object, TEventArgs, TPropVal, bool> AfterHandler { get; }

        public bool WithEventSuspended(
            Action<bool> action) => synchronizedValueAdapter.Execute(false,
                (wasEnabled) => action(wasEnabled));

        public bool FireEventIfRequired(
            object source,
            TEventArgs evtArgs) => synchronizedValueAdapter.Execute(
                false, (wasEnabled) =>
                {
                    var propVal = PropValGetter();

                    BeforeHandler(source, evtArgs, propVal, wasEnabled);

                    if (wasEnabled)
                    {
                        EnabledHandler(source, evtArgs, propVal);
                    }
                    else
                    {
                        DisabledHandler(source, evtArgs, propVal);
                    }

                    AfterHandler(source, evtArgs, propVal, wasEnabled);
                });
    }
}

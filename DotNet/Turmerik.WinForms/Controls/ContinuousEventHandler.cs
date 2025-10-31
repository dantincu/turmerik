using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.WinForms.Helpers;

namespace Turmerik.WinForms.Controls
{
    public interface IContinuousEventHandler<TArgs> : IDisposable
    {
        void EventFired(TArgs args);

        ContinuousEventHandlerOpts<TArgs> NormalizeOpts(
            ContinuousEventHandlerOpts<TArgs> opts);
    }

    public interface IContinuousEventHandlerFactory
    {
        IContinuousEventHandler<TArgs> Create<TArgs>(
            ContinuousEventHandlerOpts<TArgs> opts);
    }

    public class ContinuousEventHandlerOpts<TArgs>
    {
        public int? Delay { get; set; }
        public int? ThreadStopDelay { get; set; }
        public Action<TArgs> Handler { get; set; }
        public Control TargetControl { get; set; }
    }

    public class ContinuousEventHandler<TArgs> : IContinuousEventHandler<TArgs>
    {
        private readonly ContinuousEventHandlerOpts<TArgs> opts;

        private DateTime lastFiredAt;
        private TArgs lastArgs;
        private Thread? thread;

        public ContinuousEventHandler(
            ContinuousEventHandlerOpts<TArgs> opts)
        {
            this.opts = NormalizeOpts(opts ?? throw new ArgumentNullException(
                nameof(opts)));
        }

        public void Dispose()
        {
            lastArgs = default!;
            thread = null!;
        }

        public void EventFired(TArgs args)
        {
            Action updateArgs = () =>
            {
                lastFiredAt = DateTime.Now;
                lastArgs = args;
            };

            if (thread == null)
            {
                updateArgs();
                thread = new Thread(DoThreadWork);
                thread.Start();
            }
            else
            {
                updateArgs();
            }
        }

        public ContinuousEventHandlerOpts<TArgs> NormalizeOpts(
            ContinuousEventHandlerOpts<TArgs> opts)
        {
            opts.Delay ??= 500;
            opts.ThreadStopDelay ??= 5000;
            return opts;
        }

        private void DoThreadWork()
        {
            var millisOffset = 0;
            var threadStopMillisOffset = 0;

            Action assignMillisOffset = () =>
            {
                var millisElapsed = (int)Math.Ceiling((DateTime.Now - lastFiredAt).TotalMilliseconds);
                millisOffset = opts.Delay!.Value - millisElapsed;
                threadStopMillisOffset = opts.ThreadStopDelay!.Value - millisElapsed;
            };

            assignMillisOffset();

            while (threadStopMillisOffset > 0)
            {
                if (millisOffset <= 0)
                {
                    opts.TargetControl.InvokeIfReq(() => opts.Handler(lastArgs));
                    lastFiredAt = DateTime.MaxValue;
                    lastArgs = default!;
                    assignMillisOffset();
                }
                else
                {
                    Thread.Sleep(millisOffset);
                    assignMillisOffset();
                }
            }

            thread = null;
        }
    }

    public class ContinuousEventHandlerFactory : IContinuousEventHandlerFactory
    {
        public IContinuousEventHandler<TArgs> Create<TArgs>(
            ContinuousEventHandlerOpts<TArgs> opts) => new ContinuousEventHandler<TArgs>(opts);
    }
}

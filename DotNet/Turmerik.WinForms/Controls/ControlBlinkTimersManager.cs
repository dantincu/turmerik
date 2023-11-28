using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Async;
using WinFormsTimer = System.Windows.Forms.Timer;

namespace Turmerik.WinForms.Controls
{
    public interface IControlBlinkTimersManager
    {
        void Blink(IControlBlinkTimerOpts opts);
    }

    public class ControlBlinkTimersManager : IControlBlinkTimersManager
    {
        private readonly IBackgroundCleanupComponent<WinFormsTimer> timersBackgroundCleaner;

        public ControlBlinkTimersManager(
            IBackgroundCleanupComponentFactory backgroundCleanupComponentFactory)
        {
            timersBackgroundCleaner = backgroundCleanupComponentFactory.Create<WinFormsTimer>();
        }

        public void Blink(
            IControlBlinkTimerOpts opts)
        {
            var normOpts = NormalizeOpts(opts);

            var timer = new WinFormsTimer
            {
                Interval = normOpts.IntervalLength,
            };

            var handler = CreateEventHandler(
                normOpts, timer);

            timer.Tick += handler;
            timer.Start();
            BlinkCore(normOpts, true);
        }

        private ControlBlinkTimerNormOpts NormalizeOpts(
            IControlBlinkTimerOpts opts)
        {
            var control = opts.Control;
            var uISettings = opts.GetUISettings();

            var normOpts = new ControlBlinkTimerNormOpts
            {
                Control = opts.Control,
                IntervalLength = opts.IntervalLength ?? uISettings.DefaultBlinkIntervalMillis,
                IntervalsCount = opts.IntervalsCount ?? 1,
                InitialBackColor = opts.InitialBackColor ?? control.BackColor,
                InitialForeColor = opts.InitialForeColor ?? control.ForeColor,
            };

            normOpts.BackColor = opts.BackColor ?? normOpts.InitialBackColor;
            normOpts.ForeColor = opts.ForeColor ?? normOpts.InitialForeColor;

            return normOpts;
        }

        private EventHandler CreateEventHandler(
            ControlBlinkTimerNormOpts normOpts,
            WinFormsTimer timer)
        {
            EventHandler handler = null;
            int elapsedIntervals = 1;

            handler = (s, e) =>
            {
                if (++elapsedIntervals > normOpts.IntervalsCount)
                {
                    timer.Tick -= handler;
                    timer.Stop();
                    BlinkCore(normOpts, false);
                    timersBackgroundCleaner.EnqueueForCleanup(timer);
                }
                else
                {
                    BlinkCore(normOpts,
                        elapsedIntervals % 2 == 1);
                }
            };

            return handler;
        }

        private void BlinkCore(
            ControlBlinkTimerNormOpts normOpts,
            bool activeState)
        {
            if (activeState)
            {
                normOpts.Control.BackColor = normOpts.BackColor;
                normOpts.Control.ForeColor = normOpts.ForeColor;
            }
            else
            {
                normOpts.Control.BackColor = normOpts.InitialBackColor;
                normOpts.Control.ForeColor = normOpts.InitialForeColor;
            }
        }
    }
}

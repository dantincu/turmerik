using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.LocalFileNotes.WinFormsApp.Settings.UI;
using Turmerik.WinForms.Controls;

namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls
{
    public class ControlBlinkTimersManagerAdapter
    {
        public ControlBlinkTimersManagerAdapter(
            IControlBlinkTimersManager timersManager,
            IUISettingsRetriever uISettings,
            IUIThemeRetriever uIThemeRetriever,
            ControlBlinkTimersManagerAdapterOpts opts)
        {
            TimersManager = timersManager ?? throw new ArgumentNullException(
                nameof(TimersManager));

            UISettingsData = uISettings.Data;
            UITheme = uIThemeRetriever.Data;

            RefUxControl = opts.RefUxControl ?? throw new ArgumentNullException(
                nameof(RefUxControl));

            InconsClickSuccessBlinkTimerOpts = GetControlBlinkTimerOpts(
                opts =>
                {
                    opts.ForeColor = UITheme.SuccessColor;
                }).ToImmtbl();

            InconsClickErrorBlinkTimerOpts = GetControlBlinkTimerOpts(
                opts =>
                {
                    opts.ForeColor = UITheme.ErrorColor;
                }).ToImmtbl();
        }

        public IControlBlinkTimersManager TimersManager { get; }
        public IUISettingsData UISettingsData { get; }
        public IUIThemeData UITheme { get; }
        public Control RefUxControl { get; }

        public ControlBlinkTimerOptsImmtbl InconsClickSuccessBlinkTimerOpts { get; }
        public ControlBlinkTimerOptsImmtbl InconsClickErrorBlinkTimerOpts { get; }

        public ControlBlinkTimerOptsMtbl GetControlBlinkTimerOpts(
            Action<ControlBlinkTimerOptsMtbl> callback = null) => ControlBlinkTimerOptsMtbl.WithControlInitialColors(
                RefUxControl, opts =>
                {
                    opts.IntervalLength = UISettingsData.SlowBlinkIntervalMillis;
                    opts.IntervalsCount = 2;

                    callback?.Invoke(opts);
                });

        public void BlinkControl(
            Control iconLabel,
            IActionResult result,
            bool condition = true) => BlinkControl(
                iconLabel,
                result.IsSuccess,
                condition);

        public void BlinkControl(
            Control iconLabel,
            bool isSuccess,
            bool condition = true)
        {
            if (condition)
            {
                var optsMtbl = GetControlBlinkTimerOptsMtbl(
                iconLabel, isSuccess);

                TimersManager.Blink(optsMtbl);
            }
        }

        public ControlBlinkTimerOptsMtbl GetControlBlinkTimerOptsMtbl(
            Control control,
            bool isSuccess) => GetControlBlinkTimerOptsImmtbl(
                isSuccess).With(immtbl => new ControlBlinkTimerOptsMtbl(immtbl)
                {
                    Control = control
                });

        public ControlBlinkTimerOptsImmtbl GetControlBlinkTimerOptsImmtbl(
            bool isSuccess) => isSuccess switch
            {
                true => InconsClickSuccessBlinkTimerOpts,
                false => InconsClickErrorBlinkTimerOpts
            };
    }
}

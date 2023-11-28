using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IControlBlinkTimerOpts
    {
        Control Control { get; }
        int? IntervalLength { get; }
        int? IntervalsCount { get; }
        Color? ForeColor { get; }
        Color? BackColor { get; }
        Color? InitialForeColor { get; }
        Color? InitialBackColor { get; }

        IUISettingsDataCore GetUISettings();
    }

    public static class ControlBlinkTimerOpts
    {
        public static ControlBlinkTimerOptsImmtbl ToImmtbl(
            this IControlBlinkTimerOpts src) => new ControlBlinkTimerOptsImmtbl(src);

        public static ControlBlinkTimerOptsMtbl ToMtbl(
            this IControlBlinkTimerOpts src) => new ControlBlinkTimerOptsMtbl(src);
    }

    public class ControlBlinkTimerOptsImmtbl : IControlBlinkTimerOpts
    {
        public ControlBlinkTimerOptsImmtbl(
            IControlBlinkTimerOpts src)
        {
            Control = src.Control;
            IntervalLength = src.IntervalLength;
            IntervalsCount = src.IntervalsCount;
            ForeColor = src.ForeColor;
            BackColor = src.BackColor;
            InitialForeColor = src.InitialForeColor;
            InitialBackColor = src.InitialBackColor;

            UISettings = src.GetUISettings()?.ToImmtbl();
        }

        public Control Control { get; }
        public int? IntervalLength { get; }
        public int? IntervalsCount { get; }
        public Color? ForeColor { get; }
        public Color? BackColor { get; }
        public Color? InitialForeColor { get; }
        public Color? InitialBackColor { get; }

        public UISettingsDataCoreImmtbl UISettings { get; }

        public IUISettingsDataCore GetUISettings() => UISettings;
    }

    public class ControlBlinkTimerOptsMtbl : IControlBlinkTimerOpts
    {
        public ControlBlinkTimerOptsMtbl()
        {
        }

        public ControlBlinkTimerOptsMtbl(
            IControlBlinkTimerOpts src)
        {
            Control = src.Control;
            IntervalLength = src.IntervalLength;
            IntervalsCount = src.IntervalsCount;
            ForeColor = src.ForeColor;
            BackColor = src.BackColor;
            InitialForeColor = src.InitialForeColor;
            InitialBackColor = src.InitialBackColor;

            UISettings = src.GetUISettings()?.ToMtbl();
        }

        public Control Control { get; set; }
        public int? IntervalLength { get; set; }
        public int? IntervalsCount { get; set; }
        public Color? ForeColor { get; set; }
        public Color? BackColor { get; set; }
        public Color? InitialForeColor { get; set; }
        public Color? InitialBackColor { get; set; }

        public UISettingsDataCoreMtbl UISettings { get; set; }

        public IUISettingsDataCore GetUISettings() => UISettings;

        public static ControlBlinkTimerOptsMtbl WithControlInitialColors(
            Control control,
            Action<ControlBlinkTimerOptsMtbl> callback = null)
        {
            var opts = new ControlBlinkTimerOptsMtbl
            {
                InitialBackColor = control.BackColor,
                InitialForeColor = control.ForeColor,
            };

            callback?.Invoke(opts);
            return opts;
        }
    }

    public class ControlBlinkTimerNormOpts
    {
        public Control Control { get; set; }
        public int IntervalLength { get; set; }
        public int IntervalsCount { get; set; }
        public Color ForeColor { get; set; }
        public Color BackColor { get; set; }
        public Color InitialForeColor { get; set; }
        public Color InitialBackColor { get; set; }
    }
}

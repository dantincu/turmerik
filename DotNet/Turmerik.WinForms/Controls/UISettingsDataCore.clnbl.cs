using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IUISettingsDataCore
    {
        Color DefaultBackColor { get; }
        Color DefaultForeColor { get; }
        Color SuccessColor { get; }
        Color ErrorColor { get; }
        Color WarningColor { get; }
        Color InfoIconColor { get; }
        Color ActiveIconColor { get; }
        int SlowBlinkIntervalMillis { get; }
        int DefaultBlinkIntervalMillis { get; }
        int FastBlinkIntervalMillis { get; }
    }

    public static class UISettingsDataCore
    {
        public static UISettingsDataCoreImmtbl ToImmtbl(
            this IUISettingsDataCore src) => new UISettingsDataCoreImmtbl(src);

        public static UISettingsDataCoreMtbl ToMtbl(
            this IUISettingsDataCore src) => new UISettingsDataCoreMtbl(src);

        public static UISettingsDataCoreMtbl GetDefaultData() => new UISettingsDataCoreMtbl
        {
            DefaultBackColor = Color.FromArgb(240, 248, 255),
            DefaultForeColor = Color.FromArgb(0, 0, 0),
            SuccessColor = Color.FromArgb(0, 128, 0),
            ErrorColor = Color.FromArgb(192, 0, 0),
            WarningColor = Color.FromArgb(160, 96, 0),
            InfoIconColor = Color.FromArgb(48, 64, 80),
            ActiveIconColor = Color.FromArgb(0, 0, 255),
            SlowBlinkIntervalMillis = 375,
            DefaultBlinkIntervalMillis = 125,
            FastBlinkIntervalMillis = 40
        };
    }

    public class UISettingsDataCoreImmtbl : IUISettingsDataCore
    {
        public UISettingsDataCoreImmtbl(
            IUISettingsDataCore src)
        {
            DefaultBackColor = src.DefaultBackColor;
            DefaultForeColor = src.DefaultForeColor;
            SuccessColor = src.SuccessColor;
            ErrorColor = src.ErrorColor;
            WarningColor = src.WarningColor;
            InfoIconColor = src.InfoIconColor;
            ActiveIconColor = src.ActiveIconColor;
            SlowBlinkIntervalMillis = src.SlowBlinkIntervalMillis;
            DefaultBlinkIntervalMillis = src.DefaultBlinkIntervalMillis;
            FastBlinkIntervalMillis = src.FastBlinkIntervalMillis;
        }

        public Color DefaultBackColor { get; }
        public Color DefaultForeColor { get; }
        public Color SuccessColor { get; }
        public Color ErrorColor { get; }
        public Color WarningColor { get; }
        public Color InfoIconColor { get; }
        public Color ActiveIconColor { get; }
        public int SlowBlinkIntervalMillis { get; }
        public int DefaultBlinkIntervalMillis { get; }
        public int FastBlinkIntervalMillis { get; }
    }

    public class UISettingsDataCoreMtbl : IUISettingsDataCore
    {
        public UISettingsDataCoreMtbl()
        {
        }

        public UISettingsDataCoreMtbl(
            IUISettingsDataCore src)
        {
            DefaultBackColor = src.DefaultBackColor;
            DefaultForeColor = src.DefaultForeColor;
            SuccessColor = src.SuccessColor;
            ErrorColor = src.ErrorColor;
            WarningColor = src.WarningColor;
            InfoIconColor = src.InfoIconColor;
            ActiveIconColor = src.ActiveIconColor;
            SlowBlinkIntervalMillis = src.SlowBlinkIntervalMillis;
            DefaultBlinkIntervalMillis = src.DefaultBlinkIntervalMillis;
            FastBlinkIntervalMillis = src.FastBlinkIntervalMillis;
        }

        public Color DefaultBackColor { get; set; }
        public Color DefaultForeColor { get; set; }
        public Color SuccessColor { get; set; }
        public Color ErrorColor { get; set; }
        public Color WarningColor { get; set; }
        public Color InfoIconColor { get; set; }
        public Color ActiveIconColor { get; set; }
        public int SlowBlinkIntervalMillis { get; set; }
        public int DefaultBlinkIntervalMillis { get; set; }
        public int FastBlinkIntervalMillis { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public interface IUISettingsDataCore
    {
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
            SlowBlinkIntervalMillis = src.SlowBlinkIntervalMillis;
            DefaultBlinkIntervalMillis = src.DefaultBlinkIntervalMillis;
            FastBlinkIntervalMillis = src.FastBlinkIntervalMillis;
        }

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
            SlowBlinkIntervalMillis = src.SlowBlinkIntervalMillis;
            DefaultBlinkIntervalMillis = src.DefaultBlinkIntervalMillis;
            FastBlinkIntervalMillis = src.FastBlinkIntervalMillis;
        }

        public int SlowBlinkIntervalMillis { get; set; }
        public int DefaultBlinkIntervalMillis { get; set; }
        public int FastBlinkIntervalMillis { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using static Turmerik.WinForms.Controls.UISettingsDataCore;

namespace Turmerik.WinForms.Controls
{
    public interface IUISettingsDataCore
    {
        Size? MainFormSize { get; }
        Point? MainFormLocation { get; }
        int SlowBlinkIntervalMillis { get; }
        int DefaultBlinkIntervalMillis { get; }
        int FastBlinkIntervalMillis { get; }

        IEnumerable<IToolTipDelay> GetToolTipDelays();

        IReadOnlyDictionary<string, decimal> GetSplitContainerWidthRatiosMap();
    }

    public static class UISettingsDataCore
    {
        public interface IToolTipDelay
        {
            string Name { get; }
            int? Delay { get; }
            bool? IsSelected { get; }
            bool? Disabled { get; }
            bool? IsBalloon { get; }
            bool? ShowAlways { get; }
        }

        public class ToolTipDelayImmtbl : IToolTipDelay
        {
            public ToolTipDelayImmtbl(
                IToolTipDelay src)
            {
                Name = src.Name;
                Delay = src.Delay;
                IsSelected = src.IsSelected;
                Disabled = src.Disabled;
                IsBalloon = src.IsBalloon;
                ShowAlways = src.ShowAlways;
            }

            public string Name { get; }
            public int? Delay { get; }
            public bool? IsSelected { get; }
            public bool? Disabled { get; }
            public bool? IsBalloon { get; }
            public bool? ShowAlways { get; }
        }

        public class ToolTipDelayMtbl : IToolTipDelay
        {
            public ToolTipDelayMtbl()
            {
            }

            public ToolTipDelayMtbl(
                IToolTipDelay src)
            {
                Name = src.Name;
                Delay = src.Delay;
                IsSelected = src.IsSelected;
                Disabled = src.Disabled;
                IsBalloon = src.IsBalloon;
                ShowAlways = src.ShowAlways;
            }

            public string Name { get; set; }
            public int? Delay { get; set; }
            public bool? IsSelected { get; set; }
            public bool? Disabled { get; set; }
            public bool? IsBalloon { get; set; }
            public bool? ShowAlways { get; set; }
        }

        public static UISettingsDataCoreImmtbl ToImmtbl(
            this IUISettingsDataCore src) => new UISettingsDataCoreImmtbl(src);

        public static UISettingsDataCoreMtbl ToMtbl(
            this IUISettingsDataCore src) => new UISettingsDataCoreMtbl(src);

        public static ToolTipDelayImmtbl ToImmtbl(
            this IToolTipDelay src) => new ToolTipDelayImmtbl(src);

        public static ToolTipDelayMtbl ToMtbl(
            this IToolTipDelay src) => new ToolTipDelayMtbl(src);

        public static UISettingsDataCoreMtbl GetDefaultData() => new UISettingsDataCoreMtbl
        {
            SlowBlinkIntervalMillis = 375,
            DefaultBlinkIntervalMillis = 125,
            FastBlinkIntervalMillis = 40,
            ToolTipDelays = new ToolTipDelayMtbl
                {
                    Name = "Show",
                    Delay = 1000,
                    IsBalloon = true,
                    // ShowAlways = true,
                    IsSelected = true,
                }.Lst(
                new ToolTipDelayMtbl
                {
                    Name = "Show Instantly",
                    Delay = 1,
                    IsBalloon = true,
                    // ShowAlways = true,
                },
                new ToolTipDelayMtbl
                {
                    Name = "Show Delayed",
                    Delay = 2000,
                    IsBalloon = true,
                    // ShowAlways = true,
                },
                new ToolTipDelayMtbl
                {
                    Name = "Do Not Show",
                    Delay = 0,
                    Disabled = true,
                }),
        };
    }

    public class UISettingsDataCoreImmtbl : IUISettingsDataCore
    {
        public UISettingsDataCoreImmtbl(
            IUISettingsDataCore src)
        {
            MainFormSize = src.MainFormSize;
            MainFormLocation = src.MainFormLocation;
            SlowBlinkIntervalMillis = src.SlowBlinkIntervalMillis;
            DefaultBlinkIntervalMillis = src.DefaultBlinkIntervalMillis;
            FastBlinkIntervalMillis = src.FastBlinkIntervalMillis;
            ToolTipDelays = src.GetToolTipDelays()?.Select(o => o.ToImmtbl()).RdnlC();
            SplitContainerWidthRatiosMap = src.GetSplitContainerWidthRatiosMap()?.Dictnr().RdnlD();
        }

        public Size? MainFormSize { get; }
        public Point? MainFormLocation { get; }
        public int SlowBlinkIntervalMillis { get; }
        public int DefaultBlinkIntervalMillis { get; }
        public int FastBlinkIntervalMillis { get; }

        public ReadOnlyCollection<ToolTipDelayImmtbl> ToolTipDelays { get; }
        public ReadOnlyDictionary<string, decimal> SplitContainerWidthRatiosMap { get; }

        public IEnumerable<IToolTipDelay> GetToolTipDelays() => ToolTipDelays;

        public IReadOnlyDictionary<string, decimal> GetSplitContainerWidthRatiosMap(
            ) => SplitContainerWidthRatiosMap;
    }

    public class UISettingsDataCoreMtbl : IUISettingsDataCore
    {
        public UISettingsDataCoreMtbl()
        {
        }

        public UISettingsDataCoreMtbl(
            IUISettingsDataCore src)
        {
            MainFormSize = src.MainFormSize;
            MainFormLocation = src.MainFormLocation;
            SlowBlinkIntervalMillis = src.SlowBlinkIntervalMillis;
            DefaultBlinkIntervalMillis = src.DefaultBlinkIntervalMillis;
            FastBlinkIntervalMillis = src.FastBlinkIntervalMillis;
            ToolTipDelays = src.GetToolTipDelays()?.Select(o => o.ToMtbl()).ToList();
            SplitContainerWidthRatiosMap = src.GetSplitContainerWidthRatiosMap()?.Dictnr();
        }

        public Size? MainFormSize { get; set; }
        public Point? MainFormLocation { get; set; }
        public int SlowBlinkIntervalMillis { get; set; }
        public int DefaultBlinkIntervalMillis { get; set; }
        public int FastBlinkIntervalMillis { get; set; }

        public List<ToolTipDelayMtbl> ToolTipDelays { get; set; }
        public Dictionary<string, decimal> SplitContainerWidthRatiosMap { get; set; }

        public IEnumerable<IToolTipDelay> GetToolTipDelays() => ToolTipDelays;

        public IReadOnlyDictionary<string, decimal> GetSplitContainerWidthRatiosMap(
            ) => SplitContainerWidthRatiosMap;
    }
}

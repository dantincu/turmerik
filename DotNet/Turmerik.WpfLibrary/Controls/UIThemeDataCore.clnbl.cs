using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace Turmerik.WpfLibrary.Controls
{
    public interface IUIThemeDataCore
    {
        Color DefaultBackColor { get; }
        Color InputBackColor { get; }
        Color DefaultForeColor { get; }
        Color SuccessColor { get; }
        Color ErrorColor { get; }
        Color WarningColor { get; }
        Color LightBorderColor { get; }
        Color InfoIconColor { get; }
        Color ActiveIconColor { get; }
    }

    public static class UIThemeDataCore
    {
        public static UIThemeDataCoreImmtbl ToImmtbl(
            this IUIThemeDataCore src) => new UIThemeDataCoreImmtbl(src);

        public static UIThemeDataCoreMtbl ToMtbl(
            this IUIThemeDataCore src) => new UIThemeDataCoreMtbl(src);

        public static UIThemeDataCoreMtbl ToMtbl(
            this UIThemeDataCoreSrlzbl src) => new UIThemeDataCoreMtbl(src);

        public static UIThemeDataCoreSrlzbl GetDefaultData() => new UIThemeDataCoreSrlzbl
        {
            // DefaultBackColor = Color.FromArgb(255, 232, 208),
            // InputBackColor = Color.FromArgb(232, 255, 232),
            DefaultForeColor = new Color(), // Color.FromArgb(0, 0, 0),
            DefaultBackColor = new Color
            {
                R = 255,
                G = 255,
                B = 255
            }, // Color.FromArgb(255, 255, 255),
            InputBackColor = new Color
            {
                R = 255,
                G = 255,
                B = 255
            }, // Color.FromArgb(255, 255, 255),
            SuccessColor = new Color
            {
                R = 0,
                G = 128,
                B = 0
            }, // Color.FromArgb(0, 128, 0),
            ErrorColor = new Color
            {
                R = 0,
                G = 128,
                B = 0
            }, // Color.FromArgb(192, 0, 0),
            WarningColor = new Color
            {
                R = 190,
                G = 96,
                B = 0
            }, // Color.FromArgb(160, 96, 0),
            LightBorderColor = new Color
            {
                R = 192,
                G = 192,
                B = 192
            }, // Color.FromArgb(192, 192, 192),
            InfoIconColor = new Color
            {
                R = 48,
                G = 64,
                B = 80
            }, // Color.FromArgb(48, 64, 80),
            ActiveIconColor = new Color
            {
                R = 0,
                G = 0,
                B = 255
            }, // Color.FromArgb(0, 0, 255),
        };
    }

    public class UIThemeDataCoreImmtbl : IUIThemeDataCore
    {
        public UIThemeDataCoreImmtbl(
            IUIThemeDataCore src)
        {
            DefaultBackColor = src.DefaultBackColor;
            InputBackColor = src.InputBackColor;
            DefaultForeColor = src.DefaultForeColor;
            SuccessColor = src.SuccessColor;
            ErrorColor = src.ErrorColor;
            WarningColor = src.WarningColor;
            LightBorderColor = src.LightBorderColor;
            InfoIconColor = src.InfoIconColor;
            ActiveIconColor = src.ActiveIconColor;
        }

        public Color DefaultBackColor { get; }
        public Color InputBackColor { get; }
        public Color DefaultForeColor { get; }
        public Color SuccessColor { get; }
        public Color ErrorColor { get; }
        public Color WarningColor { get; }
        public Color LightBorderColor { get; }
        public Color InfoIconColor { get; }
        public Color ActiveIconColor { get; }
        public int SlowBlinkIntervalMillis { get; }
        public int DefaultBlinkIntervalMillis { get; }
        public int FastBlinkIntervalMillis { get; }
    }

    public class UIThemeDataCoreMtbl : IUIThemeDataCore
    {
        public UIThemeDataCoreMtbl()
        {
        }

        public UIThemeDataCoreMtbl(
            UIThemeDataCoreSrlzbl src)
        {
            DefaultBackColor = src.DefaultBackColor!.Value;
            InputBackColor = src.InputBackColor!.Value;
            DefaultForeColor = src.DefaultForeColor!.Value;
            SuccessColor = src.SuccessColor!.Value;
            ErrorColor = src.ErrorColor!.Value;
            WarningColor = src.WarningColor!.Value;
            LightBorderColor = src.LightBorderColor!.Value;
            InfoIconColor = src.InfoIconColor!.Value;
            ActiveIconColor = src.ActiveIconColor!.Value;
        }

        public UIThemeDataCoreMtbl(
            IUIThemeDataCore src)
        {
            DefaultBackColor = src.DefaultBackColor;
            InputBackColor = src.InputBackColor;
            DefaultForeColor = src.DefaultForeColor;
            SuccessColor = src.SuccessColor;
            ErrorColor = src.ErrorColor;
            WarningColor = src.WarningColor;
            LightBorderColor = src.LightBorderColor;
            InfoIconColor = src.InfoIconColor;
            ActiveIconColor = src.ActiveIconColor;
        }

        public Color DefaultBackColor { get; set; }
        public Color InputBackColor { get; set; }
        public Color DefaultForeColor { get; set; }
        public Color SuccessColor { get; set; }
        public Color ErrorColor { get; set; }
        public Color WarningColor { get; set; }
        public Color LightBorderColor { get; set; }
        public Color InfoIconColor { get; set; }
        public Color ActiveIconColor { get; set; }
    }

    public class UIThemeDataCoreSrlzbl
    {
        public UIThemeDataCoreSrlzbl()
        {
        }

        public UIThemeDataCoreSrlzbl(
            IUIThemeDataCore src)
        {
            DefaultBackColor = src.DefaultBackColor;
            InputBackColor = src.InputBackColor;
            DefaultForeColor = src.DefaultForeColor;
            SuccessColor = src.SuccessColor;
            ErrorColor = src.ErrorColor;
            WarningColor = src.WarningColor;
            LightBorderColor = src.LightBorderColor;
            InfoIconColor = src.InfoIconColor;
            ActiveIconColor = src.ActiveIconColor;
        }

        public Color? DefaultBackColor { get; set; }
        public Color? InputBackColor { get; set; }
        public Color? DefaultForeColor { get; set; }
        public Color? SuccessColor { get; set; }
        public Color? ErrorColor { get; set; }
        public Color? WarningColor { get; set; }
        public Color? LightBorderColor { get; set; }
        public Color? InfoIconColor { get; set; }
        public Color? ActiveIconColor { get; set; }
    }
}

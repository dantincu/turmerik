using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.WinForms.Controls;

namespace Turmerik.Utility.WinFormsApp.Settings.UI
{
    public interface IUIThemeData : IUIThemeDataCore
    {
    }

    public static class UIThemeData
    {
        public static UIThemeDataImmtbl ToImmtbl(
            this IUIThemeData src) => new UIThemeDataImmtbl(src);

        public static UIThemeDataMtbl ToMtbl(
            this IUIThemeData src) => new UIThemeDataMtbl(src);

        public static UIThemeDataMtbl ToMtbl(
            this UIThemeDataSrlzbl src) => new UIThemeDataMtbl(src);

        public static UIThemeDataSrlzbl GetDefaultData() => new UIThemeDataSrlzbl(
            UIThemeDataCore.GetDefaultData());
    }

    public class UIThemeDataImmtbl : UIThemeDataCoreImmtbl, IUIThemeData
    {
        public UIThemeDataImmtbl(
            IUIThemeData src) : base(src)
        {
        }
    }

    public class UIThemeDataMtbl : UIThemeDataCoreMtbl, IUIThemeData
    {
        public UIThemeDataMtbl()
        {
        }

        public UIThemeDataMtbl(UIThemeDataCoreSrlzbl src) : base(src)
        {
        }

        public UIThemeDataMtbl(
            UIThemeDataSrlzbl src) : base(src)
        {
        }

        public UIThemeDataMtbl(
            IUIThemeDataCore src) : base(src)
        {
        }

        public UIThemeDataMtbl(
            IUIThemeData src) : base(src)
        {
        }
    }

    public class UIThemeDataSrlzbl : UIThemeDataCoreSrlzbl
    {
        public UIThemeDataSrlzbl()
        {
        }

        public UIThemeDataSrlzbl(
            UIThemeDataCoreSrlzbl src)
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

        public UIThemeDataSrlzbl(
            IUIThemeDataCore src) : base(src)
        {
        }

        public UIThemeDataSrlzbl(
            IUIThemeData src) : base(src)
        {
        }
    }
}

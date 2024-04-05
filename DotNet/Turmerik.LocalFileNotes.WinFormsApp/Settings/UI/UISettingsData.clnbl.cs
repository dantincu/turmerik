using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.WinForms.Controls;

namespace Turmerik.LocalFileNotes.WinFormsApp.Settings.UI
{
    public interface IUISettingsData : IUISettingsDataCore
    {
    }

    public static class UISettingsData
    {
        public static UISettingsDataImmtbl ToImmtbl(
            this IUISettingsData src) => new UISettingsDataImmtbl(src);

        public static UISettingsDataMtbl ToMtbl(
            this IUISettingsData src) => new UISettingsDataMtbl(src);
    }

    public class UISettingsDataImmtbl : UISettingsDataCoreImmtbl, IUISettingsData
    {
        public UISettingsDataImmtbl(
            IUISettingsData src) : base(src)
        {
        }
    }

    public class UISettingsDataMtbl : UISettingsDataCoreMtbl, IUISettingsData
    {
        public UISettingsDataMtbl()
        {
        }

        public UISettingsDataMtbl(
            IUISettingsDataCore src) : base(src)
        {
        }

        public UISettingsDataMtbl(
            IUISettingsData src) : base(src)
        {
        }
    }
}

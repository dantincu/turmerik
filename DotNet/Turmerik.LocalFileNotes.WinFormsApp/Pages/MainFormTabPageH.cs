using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalFileNotes.WinFormsApp.Properties;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages
{
    public static class MainFormTabPageH
    {
        public static MainFormHomeTabPageTuple<TTabPageData> CreateTuple<TTabPageData>(
            this TTabPageData tabPageData,
            string title) where TTabPageData : MainFormTabPageBase
        {
            var tabPage = new TabPage
            {
                Text = title,
                ImageIndex = (int)tabPageData.Icon
            };

            var tuple = new MainFormHomeTabPageTuple<TTabPageData>(
                tabPage, tabPageData);

            return tuple;
        }

        public static Dictionary<MainFormTabPageIcon, Bitmap> GetMainFormTabPageIconsMap(
            ) => new Dictionary<MainFormTabPageIcon, Bitmap>
            {
                { MainFormTabPageIcon.Home, Resources.home_circle_24x24 }
            };
    }
}

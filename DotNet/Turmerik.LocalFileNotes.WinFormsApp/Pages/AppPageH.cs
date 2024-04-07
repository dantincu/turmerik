using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalFileNotes.WinFormsApp.Properties;
using Turmerik.LocalFileNotes.WinFormsApp.UserControls.Pages;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages
{
    public static class AppPageH
    {
        public static AppPageTuple<TAppPageData, TAppPageUC> CreateTuple<TAppPageData, TAppPageUC>(
            this TAppPageData appPageData,
            TAppPageUC appPageUC,
            string title,
            TabPage tabPage = null)
            where TAppPageData : AppPageBase
            where TAppPageUC : UserControl, IAppPageUC
        {
            tabPage ??= new TabPage();

            tabPage.Text = title;
            tabPage.ImageIndex = (int)appPageData.Icon;

            appPageUC.Dock = DockStyle.Fill;
            tabPage.Controls.Clear();
            tabPage.Controls.Add(appPageUC);

            var tuple = new AppPageTuple<TAppPageData, TAppPageUC>(
                tabPage, appPageData, appPageUC);

            return tuple;
        }

        public static Dictionary<AppPageIcon, Bitmap> GetMainFormTabPageIconsMap(
            ) => new Dictionary<AppPageIcon, Bitmap>
            {
                { AppPageIcon.Home, Resources.home_circle_24x24 }
            };
    }
}

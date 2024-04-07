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
        // public const string TAB_PAGE_RIGHT_PADDING = "    ×";
        public const string TAB_PAGE_RIGHT_PADDING = "        ";

        public static AppPageTuple<TAppPageData, TAppPageUC> CreateTuple<TAppPageData, TAppPageUC>(
            this TAppPageData appPageData,
            TAppPageUC appPageUC,
            string title,
            TabPage? tabPage = null,
            string rightPadding = null)
            where TAppPageData : AppPageBase
            where TAppPageUC : UserControl, IAppPageUC
        {
            tabPage ??= new TabPage();
            rightPadding ??= TAB_PAGE_RIGHT_PADDING;

            tabPage.Text = title + rightPadding;
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
                { AppPageIcon.Home, Resources.home_circle_24x24 },
                { AppPageIcon.FileExplorer, Resources.folder_24x24 }
            };
    }
}

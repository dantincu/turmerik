using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages.Impl
{
    public class AppFileExplorerPage : AppPageBase
    {
        public AppFileExplorerPage()
        {
            Icon = AppPageIcon.FileExplorer;
            SidePanel = AppPageSidePanel.FileExplorer;
        }

        public AppFileExplorerPage(
            string dirPath) : this()
        {
            Idnf = dirPath;
            Title = dirPath;
        }

        public override AppPageResourceType ResourceType => AppPageResourceType.FileExplorer;
    }
}

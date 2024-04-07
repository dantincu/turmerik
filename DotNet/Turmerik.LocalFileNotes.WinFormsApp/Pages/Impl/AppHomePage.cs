using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages.Impl
{
    public class AppHomePage : AppPageBase
    {
        public AppHomePage()
        {
            Icon = AppPageIcon.Home;
            Title = "Home";
        }

        public override AppPageResourceType ResourceType => AppPageResourceType.Home;
    }
}

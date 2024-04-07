using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalFileNotes.WinFormsApp.Pages;

namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls.Pages
{
    public interface IAppPageUC
    {
        event Action<AppPageOpts> OnOpenPageInNewTab;
        event Action<AppPageOpts> OnOpenPageInCurrentTab;
        event Action OnCloseCurrentTab;

        void UnregisterAll();
    }
}

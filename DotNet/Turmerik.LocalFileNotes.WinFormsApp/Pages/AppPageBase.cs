using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages
{
    public abstract class AppPageBase
    {
        protected AppPageBase(
            bool openInAltTabControl)
        {
            IsOpenInAltTabControl = openInAltTabControl;
        }

        public abstract AppPageResourceType ResourceType { get; }
        public AppPageIcon Icon { get; protected set; }
        public string Idnf { get; protected set; }
        public string Title { get; protected set; }
        public AppPageSidePanel SidePanel { get; protected set; }
        public virtual bool IsOpenInAltTabControl { get; set; }
    }
}

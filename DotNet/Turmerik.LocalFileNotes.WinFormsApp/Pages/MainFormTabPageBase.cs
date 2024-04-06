using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages
{
    public abstract class MainFormTabPageBase
    {
        public abstract MainFormTabPageResourceType ResourceType { get; }
        public MainFormTabPageIcon Icon { get; protected set; }
        public string Title { get; protected set; }
    }
}

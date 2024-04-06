using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages
{
    public class MainFormHomeTabPage : MainFormTabPageBase
    {
        public MainFormHomeTabPage()
        {
            Icon = MainFormTabPageIcon.Home;
            Title = "Home";
        }

        public MainFormHomeTabPage(
            string title) : this()
        {
            Title = title;
        }

        public override MainFormTabPageResourceType ResourceType => MainFormTabPageResourceType.HomePage;
    }
}

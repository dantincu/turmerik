using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages
{
    public abstract class MainFormHomeTabPageTupleBase
    {
        protected MainFormHomeTabPageTupleBase(
            TabPage tabPageControl)
        {
            TabPageControl = tabPageControl ?? throw new ArgumentNullException(
                nameof(tabPageControl));
        }

        public TabPage TabPageControl { get; }

        public abstract MainFormTabPageBase GetTabPageData();
    }

    public class MainFormHomeTabPageTuple<TTabPageData> : MainFormHomeTabPageTupleBase
        where TTabPageData : MainFormTabPageBase
    {
        public MainFormHomeTabPageTuple(
            TabPage tabPageControl,
            TTabPageData tabPageData) : base(tabPageControl)
        {
            TabPageData = tabPageData ?? throw new ArgumentNullException(
                nameof(tabPageData));
        }

        public TTabPageData TabPageData { get; }

        public override MainFormTabPageBase GetTabPageData(
            ) => TabPageData;
    }
}

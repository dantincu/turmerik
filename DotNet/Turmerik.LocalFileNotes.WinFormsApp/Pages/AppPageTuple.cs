using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalFileNotes.WinFormsApp.UserControls.Pages;

namespace Turmerik.LocalFileNotes.WinFormsApp.Pages
{
    public abstract class AppPageTupleBase : IDisposable
    {
        private volatile int _disposed;

        protected AppPageTupleBase(
            TabPage tabPageControl)
        {
            TabPageControl = tabPageControl ?? throw new ArgumentNullException(
                nameof(tabPageControl));
        }

        public TabPage TabPageControl { get; }

        public void Dispose()
        {
            if (Interlocked.CompareExchange(
                ref _disposed, 1, 0) == 0)
            {
                DisposeCore();
            }
        }

        public abstract AppPageBase GetAppPageData();
        public abstract IAppPageUC GetAppPageUC();

        protected abstract void DisposeCore();
    }

    public class AppPageTuple<TTabPageData, TAppPageUC> : AppPageTupleBase
        where TTabPageData : AppPageBase
        where TAppPageUC : UserControl, IAppPageUC
    {
        public AppPageTuple(
            TabPage tabPageControl,
            TTabPageData tabPageData,
            TAppPageUC appPageUC) : base(
                tabPageControl)
        {
            TabPageData = tabPageData ?? throw new ArgumentNullException(
                nameof(tabPageData));

            AppPageUC = appPageUC ?? throw new ArgumentNullException(
                nameof(appPageUC));
        }

        public TTabPageData TabPageData { get; }
        public TAppPageUC AppPageUC { get; }

        public override AppPageBase GetAppPageData(
            ) => TabPageData;

        public override IAppPageUC GetAppPageUC(
            ) => AppPageUC;

        protected override void DisposeCore()
        {
            AppPageUC.UnregisterAll();
            AppPageUC.Dispose();
        }
    }
}

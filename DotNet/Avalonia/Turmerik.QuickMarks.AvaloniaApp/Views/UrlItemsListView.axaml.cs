using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Avalonia.ReactiveUI;
using ReactiveUI;
using Turmerik.QuickMarks.AvaloniaApp.ViewModels;

namespace Turmerik.QuickMarks.AvaloniaApp.Views
{
    public partial class UrlItemsListView : ReactiveUserControl<UrlItemsListViewModel>
    {
        public UrlItemsListView()
        {
            this.WhenActivated(disposables => { });
            AvaloniaXamlLoader.Load(this);
        }
    }
}

using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.QuickMarks.AvaloniaApp.ViewModels;
using Turmerik.QuickMarks.AvaloniaApp.Views;

namespace Turmerik.QuickMarks.AvaloniaApp
{
    public class AppViewLocator : IViewLocator
    {
        public IViewFor ResolveView<T>(T viewModel, string contract = null) => viewModel switch
        {
            UrlItemViewModel context => new UrlItemView { DataContext = context },
            _ => throw new ArgumentOutOfRangeException(nameof(viewModel))
        };
    }
}

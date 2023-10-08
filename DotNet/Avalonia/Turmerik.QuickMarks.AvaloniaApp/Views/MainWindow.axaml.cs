using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Avalonia.ReactiveUI;
using Microsoft.Extensions.DependencyInjection;
using ReactiveUI;
using Turmerik.Async;
using Turmerik.QuickMarks.AvaloniaApp.ViewModels;

namespace Turmerik.QuickMarks.AvaloniaApp.Views;

public partial class MainWindow : ReactiveWindow<MainWindowViewModel>
{
    public MainWindow()
    {
        this.WhenActivated(disposables => { });
        AvaloniaXamlLoader.Load(this);

        this.Closing += MainWindow_Closing;
    }

    #region UI Event Handlers

    private void MainWindow_Closing(object? sender, WindowClosingEventArgs e)
    {
    }

    #endregion UI Event Handlers
}

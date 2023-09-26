using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Avalonia.Media;
using Avalonia.ReactiveUI;
using Avalonia.VisualTree;
using ReactiveUI;
using System.Threading;
using System;
using Turmerik.QuickMarks.AvaloniaApp.ViewModels;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace Turmerik.QuickMarks.AvaloniaApp.Views;

public partial class MainView : ReactiveUserControl<MainWindowViewModel>
{
    private readonly IServiceProvider svcProv;

    private IAppGlobalsData appGlobals;
    private MainWindowViewModel viewModel;
    private Button buttonControlSyncItems;
    private volatile int childControlsInitialized;

    public MainView()
    {
        svcProv = ServiceProviderContainer.Instance.Value.Data;

        this.Loaded += MainView_Loaded;
        this.WhenActivated(disposables => { });

        AvaloniaXamlLoader.Load(this);
    }

    private void MainView_Loaded(object? sender, Avalonia.Interactivity.RoutedEventArgs e)
    {
        foreach (var control in this.GetVisualChildren(
            ).Single().GetVisualDescendants().OfType<Button>())
        {
            if (control.Name == nameof(buttonSyncItems))
            {
                buttonControlSyncItems = control;
                break;
            }
        }

        if (buttonControlSyncItems != null && Interlocked.CompareExchange(ref childControlsInitialized, 1, 0) == 0)
        {
            viewModel = this.ViewModel;

            appGlobals = svcProv.GetRequiredService<AppGlobals>().RegisterData(
                new AppGlobalsMutableData
                {
                    TopLevel = TopLevel.GetTopLevel(this),
                    DefaultOutputTextForeground = new SolidColorBrush(Color.FromArgb(255, 0, 0, 255)),
                    SuccessOutputTextForeground = new SolidColorBrush(Color.FromArgb(255, 0, 255, 0)),
                    ErrorOutputTextForeground = new SolidColorBrush(Color.FromArgb(255, 255, 0, 0)),
                    DefaultMaterialIconsForeground = buttonControlSyncItems.Foreground
                });

            viewModel.Initialize();
        }
    }
}

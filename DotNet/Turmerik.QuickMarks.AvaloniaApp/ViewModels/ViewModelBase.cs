using Avalonia.Controls;
using Microsoft.Extensions.DependencyInjection;
using ReactiveUI;
using System;

namespace Turmerik.QuickMarks.AvaloniaApp.ViewModels;

public class ViewModelBase : ReactiveObject
{
    protected IServiceProvider SvcProv { get; }
    protected IAppGlobalsData AppGlobals { get; }
    protected TopLevel TopLevel { get; }

    public ViewModelBase()
    {
        SvcProv = ServiceProviderContainer.Instance.Value.Data;
        AppGlobals = SvcProv.GetRequiredService<AppGlobals>().Data;
        TopLevel = AppGlobals.TopLevel;
    }
}

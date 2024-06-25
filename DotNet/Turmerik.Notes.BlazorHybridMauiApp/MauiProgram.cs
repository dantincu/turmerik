using Microsoft.Extensions.Logging;
using System.Web.Services.Description;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Dependencies;
using Turmerik.NetCore.Dependencies;

namespace Turmerik.Notes.BlazorHybridMauiApp
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                });

            TrmrkCoreServices.RegisterAll(
                builder.Services);

            TrmrkServices.RegisterAll(builder.Services);
            TrmrkNetCoreServices.RegisterAll(builder.Services);

            DriveExplorerH.AddFsRetrieverAndExplorer(builder.Services);

            builder.Services.AddMauiBlazorWebView();
            builder.Services.AddBlazorBootstrap();

#if DEBUG
            builder.Services.AddBlazorWebViewDeveloperTools();
    		builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}

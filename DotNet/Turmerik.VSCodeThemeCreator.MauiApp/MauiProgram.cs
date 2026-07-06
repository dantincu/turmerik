using CommunityToolkit.Maui;
using Microsoft.Extensions.Logging;

namespace Turmerik.VSCodeThemeCreator.MauiApp
{
    public static class MauiProgram
    {
        public static global::Microsoft.Maui.Hosting.MauiApp CreateMauiApp()
        {
            var builder = global::Microsoft.Maui.Hosting.MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .UseMauiCommunityToolkit()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

#if DEBUG
    		builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}

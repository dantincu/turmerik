using Microsoft.Extensions.Logging;

using MsHosting = Microsoft.Maui.Hosting;

namespace Turmerik.LocalFileNotes.MauiApp
{
    public static class MauiProgram
    {
        public static MsHosting.MauiApp CreateMauiApp()
        {
            var builder = MsHosting.MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
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

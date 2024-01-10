using Foundation;
using MsHosting = Microsoft.Maui.Hosting;

namespace Turmerik.LocalFileNotes.MauiApp
{
    [Register("AppDelegate")]
    public class AppDelegate : MauiUIApplicationDelegate
    {
        protected override MsHosting.MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();
    }
}

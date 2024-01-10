using Android.App;
using Android.Runtime;
using MsHosting = Microsoft.Maui.Hosting;

namespace Turmerik.LocalFileNotes.MauiApp
{
    [Application]
    public class MainApplication : MauiApplication
    {
        public MainApplication(IntPtr handle, JniHandleOwnership ownership)
            : base(handle, ownership)
        {
        }

        protected override MsHosting.MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();
    }
}

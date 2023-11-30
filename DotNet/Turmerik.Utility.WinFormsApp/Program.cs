using Microsoft.Extensions.DependencyInjection;
using Turmerik.WinForms.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Logging.Dependencies;
using Turmerik.Logging;
using Turmerik.Utility.WinFormsApp.Settings;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.Utility.WinFormsApp.UserControls;

namespace Turmerik.Utility.WinFormsApp
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            var svcProv = RegisterServices();

            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new MainForm());
        }

        private static IServiceProvider RegisterServices()
        {
            var svcProvContnr = ServiceProviderContainer.Instance.Value;

            var svcProv  = svcProvContnr.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                    TrmrkServices.RegisterAll(services);
                    services.AddSingleton<IDriveItemsRetriever, FsEntriesRetriever>();
                    services.AddSingleton<IDriveExplorerService, FsExplorerService>();

                    services.AddSingleton<IAppEnv, AppEnv>();
                    LoggingServices.RegisterAll(services);

                    services.AddSingleton(
                        svcProv => svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create());

                    services.AddSingleton<IAppDataFactory, AppDataFactory>();
                    services.AddSingleton<IAppSettings, AppSettings>();
                    services.AddSingleton<UISettingsRetriever>();
                    services.AddSingleton<ControlBlinkTimersManagerAdapterFactory>();
                    services.AddSingleton<ControlBlinkTimersManagerAdapterContainer>();
                }));

            return svcProv;
        }
    }
}
using Microsoft.Extensions.DependencyInjection;
using Turmerik.WinForms.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Dependencies;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Logging.Dependencies;
using Turmerik.Logging;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.TestWinFormsApp
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
            Application.Run(new RichTextBoxPseudoMarkupForm());
        }

        private static IServiceProvider RegisterServices()
        {
            var svcProvContnr = ServiceProviderContainer.Instance.Value;

            var svcProv = svcProvContnr.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                    TrmrkServices.RegisterAll(services);

                    DriveExplorerH.AddFsRetrieverAndExplorer(
                        services, null, true);

                    services.AddSingleton<IAppEnv, AppEnv>();
                    LoggingServices.RegisterAll(services);

                    services.AddSingleton(
                        svcProv => svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create());

                    services.AddSingleton<IAppDataFactory, AppDataFactory>();
                }));

            return svcProv;
        }
    }
}
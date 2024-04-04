using Microsoft.Extensions.DependencyInjection;
using System.Configuration;
using System.Data;
using System.Windows;
using Turmerik.WpfLibrary.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Logging.Dependencies;
using Turmerik.Logging;
using Turmerik.Jint.Dependencies;
using Turmerik.LocalFileNotes.WpfApp.Settings;
using Turmerik.LocalFileNotes.WpfApp.Settings.UI;
using Turmerik.LocalFileNotes.WpfApp.ViewModels;

namespace Turmerik.LocalFileNotes.WpfApp
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        public App()
        {
            // System.Windows.Data.Binding.AddTargetUpdatedHandler(this, HandleBindingError);
        }

        /* private void HandleBindingError(object sender, System.Windows.Data.BindingErrorEventArgs e)
        {
            // Log or handle the binding error here
        } */

        private ServiceProviderContainer SvcProvContainer => ServiceProviderContainer.Instance.Value;
        private IServiceProvider SvcProv => ServiceProviderContainer.Instance.Value.Data;

        protected override void OnStartup(StartupEventArgs e)
        {
            RegisterServices();
            base.OnStartup(e);
        }

        private IServiceProvider RegisterServices()
        {
            var svcProv = SvcProvContainer.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                    TrmrkServices.RegisterAll(services);

                    DriveExplorerH.AddFsRetrieverAndExplorer(
                        services, null, true);

                    services.AddSingleton<IAppEnv, AppEnv>();
                    LoggingServices.RegisterAll(services);

                    services.AddSingleton(
                        svcProv => svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create());

                    TrmrkJintServices.RegisterAll(services);

                    services.AddSingleton<IAppDataFactory, AppDataFactory>();
                    services.AddSingleton<IAppSettings, AppSettings>();
                    services.AddSingleton<IUISettingsRetriever, UISettingsRetriever>();
                    services.AddSingleton<IUIThemeRetriever, UIThemeRetriever>();

                    services.AddSingleton<MainWindowVM>();
                }));

            return svcProv;
        }
    }

}

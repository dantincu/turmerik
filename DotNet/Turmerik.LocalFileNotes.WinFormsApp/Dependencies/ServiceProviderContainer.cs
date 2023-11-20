using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.Logging;
using Turmerik.Logging.Dependencies;
using Turmerik.Notes.Dependencies;
using Turmerik.Notes.Settings;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;

namespace Turmerik.LocalFileNotes.WinFormsApp.Dependencies
{
    public class ServiceProviderContainer : ServiceProviderContainerBase
    {
        private ServiceProviderContainer()
        {
        }

        protected override void RegisterServices(
            IServiceCollection services)
        {
            TrmrkServices.RegisterAll(services);
            TrmrkNoteServices.RegisterAll(services);
            TrmrkNoteServices.RegisterAppSettingsRetriever<NotesAppConfigImmtbl, NotesAppConfigMtbl>(services);

            services.AddSingleton<IDriveItemsRetriever, FsEntriesRetriever>();
            services.AddSingleton<IDriveExplorerService, FsExplorerService>();

            services.AddSingleton<IAppEnv, AppEnv>();
            LoggingServices.RegisterAll(services);

            services.AddSingleton(
                svcProv => svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create(true));

            WinFormsServices.RegisterAll(services);

            services.AddSingleton<IWinFormsActionComponentCreator, WinFormsActionComponentCreator>();
        }

        public static Lazy<ServiceProviderContainer> Instance { get; } = new (() => new ());
    }
}

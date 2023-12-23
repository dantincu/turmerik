using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.Dependencies;
using Turmerik.AspNetCore.UserSessions;
using Turmerik.Core.Dependencies;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.LocalFilesExplorer.AspNetCoreApp.Settings;
using Turmerik.Logging;
using Turmerik.Logging.Dependencies;
using Turmerik.NetCore.Dependencies;
using Turmerik.Notes.Core;

namespace Turmerik.LocalFilesExplorer.AspNetCoreApp.Dependencies
{
    public static class LocalFilesExplorerAspNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            TrmrkCoreServices.RegisterAll(services);
            TrmrkServices.RegisterAll(services);
            TrmrkNetCoreServices.RegisterAll(services);
            AspNetCoreServices.RegisterAll(services);

            services.AddSingleton<IAppEnv, AppEnv>();
            LoggingServices.RegisterAll(services);

            services.AddSingleton(
                svcProv => svcProv.GetRequiredService<IAppLoggerCreatorFactory>().Create());

            services.AddSingleton<IDriveItemsRetriever, FsItemsRetriever>();
            services.AddSingleton<IDriveExplorerService, FsExplorerService>();
            services.AddSingleton<IAppConfigServiceFactory, AppConfigServiceFactory>();

            services.AddSingleton(
                svcProv => svcProv.GetRequiredService<IAppConfigServiceFactory>(
                    ).Service<NotesAppConfigImmtbl, NotesAppConfigMtbl>(null));

            services.AddSingleton<IUsersIdnfStorage, LocalJsonFileUsersIdnfStorage>();
            return services;
        }
    }
}

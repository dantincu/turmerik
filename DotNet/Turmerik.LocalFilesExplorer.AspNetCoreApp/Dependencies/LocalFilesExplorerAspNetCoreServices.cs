using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.Dependencies;
using Turmerik.AspNetCore.UserSessions;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Utility;
using Turmerik.Dependencies;
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

            services.AddSingleton<Core.DriveExplorer.FsExplorerServiceFactory>();

            DriveExplorerH.AddFsRetrieverAndExplorer(
                services, null, false, null);

            services.AddSingleton<IAppConfigServiceFactory, AppConfigServiceFactory>();

            services.AddSingleton(
                svcProv => svcProv.GetRequiredService<IAppConfigServiceFactory>(
                    ).Service<NotesAppConfigImmtbl, NotesAppConfigMtbl>(null));

            services.AddSingleton<IUsersIdnfStorage, LocalJsonFileUsersIdnfStorage>();
            return services;
        }
    }

    public class FsExplorerServiceFactory : IFsExplorerServiceFactory
    {
        private readonly Core.DriveExplorer.FsExplorerServiceFactory baseFactory;
        private readonly IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever;

        public FsExplorerServiceFactory(
            Core.DriveExplorer.FsExplorerServiceFactory baseFactory,
            IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever)
        {
            this.baseFactory = baseFactory ?? throw new ArgumentNullException(
                nameof(baseFactory));

            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(
                nameof(appSettingsRetriever));
        }

        public IFsExplorerService Explorer(
            bool allowSysFolders = false,
            string rootDirPath = null) => baseFactory.Explorer(allowSysFolders,
                rootDirPath ?? appSettingsRetriever.Data.FsExplorerServiceReqRootPath);

        public IFsItemsRetriever Retriever(
            bool allowSysFolders = false,
            string rootDirPath = null) => baseFactory.Retriever(allowSysFolders,
                rootDirPath ?? appSettingsRetriever.Data.FsExplorerServiceReqRootPath);
    }
}

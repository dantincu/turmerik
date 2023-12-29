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
using Turmerik.Core.Utility;
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

            services.AddSingleton<FsExplorerServiceFactory>();

            services.AddSingleton<IDriveItemsRetriever>(
                svcProv => svcProv.GetRequiredService<FsExplorerServiceFactory>().Retriever());

            services.AddSingleton<IDriveExplorerService>(
                svcProv => svcProv.GetRequiredService<FsExplorerServiceFactory>().Explorer());

            services.AddSingleton<IAppConfigServiceFactory, AppConfigServiceFactory>();

            services.AddSingleton(
                svcProv => svcProv.GetRequiredService<IAppConfigServiceFactory>(
                    ).Service<NotesAppConfigImmtbl, NotesAppConfigMtbl>(null));

            services.AddSingleton<IUsersIdnfStorage, LocalJsonFileUsersIdnfStorage>();
            return services;
        }
    }

    public class FsExplorerServiceFactory
    {
        private readonly IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever;
        private readonly ITimeStampHelper timeStampHelper;

        public FsExplorerServiceFactory(
            IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever,
            ITimeStampHelper timeStampHelper)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(
                nameof(appSettingsRetriever));

            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(
                nameof(timeStampHelper));
        }

        public FsExplorerService Explorer(
            ) => new FsExplorerService(
                timeStampHelper)
            {
                RootDirPath = appSettingsRetriever.Data.FsExplorerServiceReqRootPath
            };

        public FsItemsRetriever Retriever(
            ) => new FsItemsRetriever(
                timeStampHelper)
            {
                RootDirPath = appSettingsRetriever.Data.FsExplorerServiceReqRootPath
            };
    }
}

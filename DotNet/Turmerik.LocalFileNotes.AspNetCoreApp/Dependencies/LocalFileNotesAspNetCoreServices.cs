using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.AspNetCore.Dependencies;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.Notes.AspNetCore.Dependencies;
using Turmerik.Notes.AspNetCore.Settings;
using Turmerik.DriveExplorer;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Dependencies
{
    public static class LocalFileNotesAspNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            NotesAspNetCoreServices.RegisterAll(services);
            AspNetCoreServices.RegisterAppSettingsRetriever<AppConfigCoreImmtbl, AppConfigCoreMtbl>(services);

            services.AddSingleton<IDriveExplorerService, FsExplorerService>();
            services.AddSingleton<IDriveItemsCreator, DriveItemsCreator>();
            return services;
        }
    }
}

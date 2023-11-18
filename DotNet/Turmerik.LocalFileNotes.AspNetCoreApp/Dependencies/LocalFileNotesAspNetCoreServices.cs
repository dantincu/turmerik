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
using Turmerik.DriveExplorer;
using Turmerik.Notes.Settings;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Dependencies
{
    public static class LocalFileNotesAspNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            NotesAspNetCoreServices.RegisterAll(services);
            AspNetCoreServices.RegisterAppSettingsRetriever<NotesAppConfigImmtbl, NotesAppConfigMtbl>(services);

            services.AddSingleton<IDriveItemsRetriever, FsEntriesRetriever>();
            services.AddSingleton<IDriveExplorerService, FsExplorerService>();
            return services;
        }
    }
}

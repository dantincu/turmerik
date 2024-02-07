using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.Dependencies;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Notes.AspNetCore.Dependencies;
using Turmerik.Notes.Dependencies;
using Turmerik.Notes.Core;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Dependencies
{
    public static class LocalFileNotesAspNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            NotesAspNetCoreServices.RegisterAll(services);
            TrmrkNoteServices.RegisterAppSettingsRetriever<NotesAppConfigImmtbl, NotesAppConfigMtbl>(services);

            DriveExplorerH.AddFsRetrieverAndExplorer(services);

            return services;
        }
    }
}

using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer.Notes;
using Turmerik.HtmlAgility;
using Turmerik.Notes.Md;
using Turmerik.Notes.Service;
using Turmerik.Notes.Settings;

namespace Turmerik.Notes.Dependencies
{
    public static class TrmrkNoteServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IHtmlNodesRetriever, HtmlNodesRetriever>();
            services.AddSingleton<IMdObjectsRetriever, MdObjectsRetriever>();
            services.AddSingleton<INoteMdParser, NoteMdParser>();
            services.AddSingleton<INoteItemsRetrieverFactory, NoteItemsRetrieverFactory>();
            services.AddSingleton<INoteJsonDeserializer, NoteJsonDeserializer>();
            services.AddSingleton<INoteJsonRetriever, NoteJsonRetriever>();
            services.AddSingleton<INoteMdRetriever, NoteMdRetriever>();

            services.AddSingleton<INoteDirsPairGeneratorFactory, NoteDirsPairGeneratorFactory>();
            services.AddSingleton<INoteDirsPairCreatorFactory, NoteDirsPairCreatorFactory>();
            services.AddSingleton<INotesExplorerServiceFactory, NotesExplorerServiceFactory>();

            services.AddSingleton<IAppConfigServiceFactory, AppConfigServiceFactory>();
            return services;
        }

        public static IServiceCollection RegisterAppSettingsRetriever<TImmtblData, TMtblData>(
            IServiceCollection services,
            Func<TMtblData, TImmtblData> normalizerFunc = null) => services.AddSingleton(
                svcProv => svcProv.GetRequiredService<IAppConfigServiceFactory>(
                    ).Service(normalizerFunc));
    }
}

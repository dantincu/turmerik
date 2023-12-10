using Microsoft.Extensions.DependencyInjection;
using System;
using Turmerik.Md;
using Turmerik.Notes.Service;
using Turmerik.Notes.Settings;

namespace Turmerik.Notes.Dependencies
{
    public static class TrmrkNoteServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
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

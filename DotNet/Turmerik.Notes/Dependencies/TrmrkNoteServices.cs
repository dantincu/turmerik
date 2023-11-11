using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Notes.Md;

namespace Turmerik.Notes.Dependencies
{
    public static class TrmrkNoteServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IMdObjectsRetriever, MdObjectsRetriever>();
            services.AddSingleton<INoteMdParser, NoteMdParser>();
            services.AddSingleton<INoteCfgValuesRetriever, NoteCfgValuesRetriever>();
            services.AddSingleton<IExistingNoteDirPairsRetrieverFactory, ExistingNoteDirPairsRetrieverFactory>();
            services.AddSingleton<INextNoteIdxRetriever, NextNoteIdxRetriever>();
            services.AddSingleton<INoteJsonDeserializer, NoteJsonDeserializer>();
            services.AddSingleton<INoteJsonRetriever, NoteJsonRetriever>();
            services.AddSingleton<INoteMdRetriever, NoteMdRetriever>();

            services.AddSingleton<INoteDirsPairGeneratorFactory, NoteDirsPairGeneratorFactory>();
            services.AddSingleton<INoteDirsPairCreatorFactory, NoteDirsPairCreatorFactory>();

            return services;
        }
    }
}

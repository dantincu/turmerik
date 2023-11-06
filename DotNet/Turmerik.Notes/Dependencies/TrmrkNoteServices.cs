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
            services.AddSingleton<INoteTitleRetriever, NoteTitleRetriever>();

            services.AddSingleton<INextNoteIdxRetriever, NextNoteIdxRetriever>();
            services.AddSingleton<IDirsPairGenerator, DirsPairGenerator>();

            services.AddSingleton<INoteDirsPairGenerator, NoteDirsPairGenerator>();
            services.AddSingleton<INoteDirsPairCreator, NoteDirsPairCreator>();

            return services;
        }
    }
}

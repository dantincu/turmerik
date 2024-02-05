﻿using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Html;
using Turmerik.Md;
using Turmerik.DirsPair;
using Turmerik.Notes.Core;
using Turmerik.Code.Core;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.Dependencies
{
    public static class TrmrkServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IFsEntryNameNormalizer, FsEntryNameNormalizer>();
            services.AddSingleton<IDirsPairGeneratorFactory, DirsPairGeneratorFactory>();
            services.AddSingleton<IDirsPairCreatorFactory, DirsPairCreatorFactory>();
            services.AddSingleton<IDriveItemsCreator, DriveItemsCreator>();

            services.AddSingleton<IFsItemsRetriever, FsItemsRetriever>();
            services.AddSingleton<ICachedEntriesRetrieverFactory, CachedEntriesRetrieverFactory>();
            services.AddSingleton<IFilteredDriveEntriesRetriever, FilteredDriveEntriesRetriever>();
            services.AddSingleton<IFilteredDriveEntriesRemover, FilteredDriveEntriesRemover>();

            services.AddSingleton<INameToIdnfConverter, NameToIdnfConverter>();

            services.AddSingleton<INoteMdParser, NoteMdParser>();
            services.AddSingleton<IHtmlDocTitleRetriever, HtmlDocTitleRetriever>();

            services.AddSingleton<INoteCfgValuesRetriever, NoteCfgValuesRetriever>();
            services.AddSingleton<INextNoteIdxRetriever, NextNoteIdxRetriever>();
            services.AddSingleton<INoteDirsPairIdxRetriever, NoteDirsPairIdxRetriever>();
            services.AddSingleton<IExistingDirPairsRetrieverFactory, ExistingDirPairsRetrieverFactory>();

            return services;
        }
    }
}

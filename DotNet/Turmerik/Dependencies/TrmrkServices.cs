using Turmerik.Actions;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.EqualityComparer;
using Turmerik.Reflection;
using Turmerik.Utility;
using Turmerik.Async;
using Turmerik.TextStream;
using Turmerik.TextSerialization;
using Turmerik.DriveExplorer;
using Turmerik.ConsoleApps;
using Turmerik.TextParsing;
using Turmerik.Text;
using Turmerik.DriveExplorer.DirsPair;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.Dependencies
{
    public static class TrmrkServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IAppInstanceStartInfoProvider, AppInstanceStartInfoProvider>();
            services.AddSingleton<ITimeStampHelper, TimeStampHelper>();
            services.AddSingleton<ILambdaExprHelper, LambdaExprHelper>();
            services.AddSingleton<ILambdaExprHelperFactory, LambdaExprHelperFactory>();
            services.AddSingleton<IBasicEqualityComparerFactory, BasicEqualityComparerFactory>();
            services.AddSingleton<IJsonConversion, JsonConversion>();

            services.AddSingleton<IActionErrorCatcherFactory, ActionErrorCatcherFactory>();
            services.AddSingleton<IAsyncMessageQueuerFactory, AsyncMessageQueuerFactory>();
            services.AddSingleton<IBestItemRetriever, BestItemRetriever>();
            services.AddSingleton<IBestItemAsyncRetriever, BestItemAsyncRetriever>();

            services.AddSingleton<IConsoleArgsParser, ConsoleArgsParser>();
            services.AddSingleton<ITextParserTemplate, TextParserTemplate>();
            services.AddSingleton<IStringTemplateParser, StringTemplateParser>();
            services.AddSingleton<IExceptionSerializer, ExceptionSerializer>();

            services.AddSingleton<IControlCharsNormalizer, ControlCharsNormalizer>();
            services.AddSingleton<IDelimCharsExtractor, DelimCharsExtractor>();
            services.AddSingleton<ITextBufferLinesRetriever, TextBufferLinesRetriever>();
            services.AddSingleton<ITextLinesRetrieverFactory, TextLinesRetrieverFactory>();

            services.AddSingleton<IFsEntryNameNormalizer, FsEntryNameNormalizer>();
            services.AddSingleton<IDirsPairGenerator, DirsPairGenerator>();
            services.AddSingleton<IDirsPairCreator, DirsPairCreator>();
            services.AddSingleton<IDriveItemsCreator, DriveItemsCreator>();

            services.AddSingleton<IFsEntriesRetriever, FsEntriesRetriever>();
            services.AddSingleton<ICachedEntriesRetrieverFactory, CachedEntriesRetrieverFactory>();

            services.AddSingleton<INoteCfgValuesRetriever, NoteCfgValuesRetriever>();
            services.AddSingleton<INextNoteIdxRetriever, NextNoteIdxRetriever>();
            services.AddSingleton<INoteDirsPairIdxRetriever, NoteDirsPairIdxRetriever>();
            services.AddSingleton<IExistingDirPairsRetrieverFactory, ExistingDirPairsRetrieverFactory>();
            return services;
        }
    }
}

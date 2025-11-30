using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Actions;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Reflection;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextParsing.IndexesFilter;
using Turmerik.Core.TextParsing.StructuredFreeText;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.TextStream;
using Turmerik.Core.Threading;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Dependencies
{
    public static class TrmrkCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services,
            bool isForLocalDevice = true)
        {
            services.AddSingleton<IAppInstanceStartInfoProvider, AppInstanceStartInfoProvider>();
            services.AddSingleton<IConsoleMsgPrinter, ConsoleMsgPrinter>();
            services.AddSingleton<IConsoleObjectPropsPrinter, ConsoleObjectPropsPrinter>();
            services.AddSingleton<ITimeStampHelper, TimeStampHelper>();
            services.AddSingleton<ILambdaExprHelper, LambdaExprHelper>();
            services.AddSingleton<ILambdaExprHelperFactory, LambdaExprHelperFactory>();
            services.AddSingleton<IObjectMapperFactory, ObjectMapperFactory>();
            services.AddSingleton<IBasicComparerFactory, BasicComparerFactory>();
            services.AddSingleton<IBasicEqualityComparerFactory, BasicEqualityComparerFactory>();
            services.AddSingleton<IJsonConversion, JsonConversion>();
            services.AddSingleton<IGenericTaskAdapter, GenericTaskAdapter>();
            services.AddSingleton<IFsEntryNameNormalizer, FsEntryNameNormalizer>();
            services.AddSingleton<INameToIdnfConverter, NameToIdnfConverter>();
            services.AddSingleton<IPascalOrCamelCaseToWordsConverter, PascalOrCamelCaseToWordsConverter>();
            services.AddSingleton<IPropertyInjector, PropertyInjector>();

            services.AddSingleton<ISynchronizedAdapterFactory, SynchronizedAdapterFactory>();
            services.AddSingleton<IIntermitentBackgroundWorkerFactory, IntermitentBackgroundWorkerFactory>();
            services.AddSingleton<IBackgroundCleanupComponentFactory, BackgroundCleanupComponentFactory>();
            services.AddSingleton<ISynchronizedValueAdapterFactory, SynchronizedValueAdapterFactory>();
            services.AddSingleton<IProcessLauncherCore, ProcessLauncherCore>();

            services.AddSingleton<IActionErrorCatcherFactory, ActionErrorCatcherFactory>();
            services.AddSingleton<IBestItemRetriever, BestItemRetriever>();
            services.AddSingleton<IBestItemAsyncRetriever, BestItemAsyncRetriever>();

            services.AddSingleton<IConsoleArgsParser, ConsoleArgsParser>();
            services.AddSingleton<ITrmrkUniqueDirRetriever, TrmrkUniqueDirRetriever>();

            if (isForLocalDevice)
            {
                services.AddSingleton<ITrmrkUniqueDirCreator, TrmrkUniqueDirCreator>();
                services.AddSingleton<ITempDirConsoleApp, TempDirConsoleApp>();
                services.AddSingleton<ILocalDevicePathMacrosRetriever, LocalDevicePathMacrosRetriever>();
                services.AddSingleton<IDirsPairConfigLoader, DirsPairConfigLoader>();
            }

            services.AddSingleton<IStringTemplateParser, StringTemplateParser>();
            services.AddSingleton<IExceptionSerializer, ExceptionSerializer>();
            services.AddSingleton<IControlCharsNormalizer, ControlCharsNormalizer>();
            services.AddSingleton<IDelimCharsExtractor, DelimCharsExtractor>();
            services.AddSingleton<ITextBufferLinesRetriever, TextBufferLinesRetriever>();
            services.AddSingleton<ITextLinesRetrieverFactory, TextLinesRetrieverFactory>();
            services.AddSingleton<IExpressionTextParser, ExpressionTextParser>();
            services.AddSingleton<IRegexReplacer, RegexReplacer>();
            services.AddSingleton<IStringLiteralTransformer, StringLiteralTransformer>();
            services.AddSingleton<ITextMacrosReplacer, TextMacrosReplacer>();
            services.AddSingleton<ICachedEntriesRetrieverFactory, CachedEntriesRetrieverFactory>();
            services.AddSingleton<IDriveItemsCreator, DriveItemsCreator>();
            services.AddSingleton<IFilteredDriveEntriesRetriever, FilteredDriveEntriesRetriever>();
            services.AddSingleton<IFilteredDriveEntriesRemover, FilteredDriveEntriesRemover>();
            services.AddSingleton<IFilteredDriveEntriesCloner, FilteredDriveEntriesCloner>();
            services.AddSingleton<IFilteredDriveEntriesSynchronizer, FilteredDriveEntriesSynchronizer>();
            services.AddSingleton<IFilteredDriveEntriesNodesRetriever, FilteredDriveEntriesNodesRetriever>();
            services.AddSingleton<IDriveEntriesCloner, DriveEntriesCloner>();

            services.AddSingleton<IChecksumCalculator, ChecksumCalculator>();
            services.AddSingleton<IIdxesFilterParser, IdxesFilterParser>();
            services.AddSingleton<IFilteredIdxesRetriever, FilteredIdxesRetriever>();

            services.AddSingleton<IAssemblyFinder, AssemblyFinder>();
            services.AddSingleton<ITypeResolver, TypeResolver>();
            services.AddSingleton<ITrmrkStructuredFreeTextSerializer, TrmrkStructuredFreeTextSerializer>();
            services.AddSingleton<ITrmrkStructuredFreeTextWebSerializer, TrmrkStructuredFreeTextWebSerializer>();

            return services;
        }
    }
}

using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Reflection;
using Turmerik.Core.Actions;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Core.TextStream;
using Turmerik.Core.Threading;
using Turmerik.Core.FileSystem;

namespace Turmerik.Core.Dependencies
{
    public static class TrmrkCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IAppInstanceStartInfoProvider, AppInstanceStartInfoProvider>();
            services.AddSingleton<ITimeStampHelper, TimeStampHelper>();
            services.AddSingleton<ILambdaExprHelper, LambdaExprHelper>();
            services.AddSingleton<ILambdaExprHelperFactory, LambdaExprHelperFactory>();
            services.AddSingleton<IBasicComparerFactory, BasicComparerFactory>();
            services.AddSingleton<IBasicEqualityComparerFactory, BasicEqualityComparerFactory>();
            services.AddSingleton<IJsonConversion, JsonConversion>();

            services.AddSingleton<IIntermitentBackgroundWorkerFactory, IntermitentBackgroundWorkerFactory>();
            services.AddSingleton<IBackgroundCleanupComponentFactory, BackgroundCleanupComponentFactory>();
            services.AddSingleton<ISynchronizedValueAdapterFactory, SynchronizedValueAdapterFactory>();

            services.AddSingleton<IActionErrorCatcherFactory, ActionErrorCatcherFactory>();
            services.AddSingleton<IBestItemRetriever, BestItemRetriever>();
            services.AddSingleton<IBestItemAsyncRetriever, BestItemAsyncRetriever>();

            services.AddSingleton<IConsoleArgsParser, ConsoleArgsParser>();
            services.AddSingleton<IDataTreeGeneratorFactory, DataTreeGeneratorFactory>();
            services.AddSingleton<IStringTemplateParser, StringTemplateParser>();
            services.AddSingleton<IExceptionSerializer, ExceptionSerializer>();

            services.AddSingleton<IControlCharsNormalizer, ControlCharsNormalizer>();
            services.AddSingleton<IDelimCharsExtractor, DelimCharsExtractor>();
            services.AddSingleton<ITextBufferLinesRetriever, TextBufferLinesRetriever>();
            services.AddSingleton<ITextLinesRetrieverFactory, TextLinesRetrieverFactory>();

            services.AddSingleton<IFsEntriesRetriever, FsEntriesRetriever>();
            services.AddSingleton<IStrPartsMatcher, StrPartsMatcher>();

            return services;
        }
    }
}

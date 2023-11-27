using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Reflection;
using Turmerik.Core.Actions;
using Turmerik.Core.Async;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Core.TextStream;

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

            return services;
        }
    }
}

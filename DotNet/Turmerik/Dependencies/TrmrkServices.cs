using Turmerik.Actions;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.EqualityComparer;
using Turmerik.Reflection;
using Turmerik.Text;
using Turmerik.Utility;
using Turmerik.DriveExplorer;
using Turmerik.Async;

namespace Turmerik.Dependencies
{
    public static class TrmrkServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<ITimeStampHelper, TimeStampHelper>();
            services.AddSingleton<ILambdaExprHelper, LambdaExprHelper>();
            services.AddSingleton<ILambdaExprHelperFactory, LambdaExprHelperFactory>();
            services.AddSingleton<IBasicEqualityComparerFactory, BasicEqualityComparerFactory>();
            services.AddSingleton<IJsonConversion, JsonConversion>();

            services.AddSingleton<IActionErrorCatcherFactory, ActionErrorCatcherFactory>();
            services.AddSingleton<IAsyncMessageQueuerFactory, AsyncMessageQueuerFactory>();
            
            services.AddSingleton<INoteDirsPairFullNamePartRetriever, NoteDirsPairFullNamePartRetriever>();
            services.AddSingleton<INoteDirsPairGeneratorFactory, NoteDirsPairGeneratorFactory>();

            return services;
        }
    }
}

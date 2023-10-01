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
            services.AddSingleton<IActionErrorCatcherFactory, ActionErrorCatcherFactory>();
            services.AddSingleton<IJsonConversion, JsonConversion>();
            services.AddSingleton<INoteDirsPairIdxRetrieverFactory, NoteDirsPairIdxRetrieverFactory>();
            services.AddSingleton<INoteDirsPairFullNamePartRetriever, NoteDirsPairFullNamePartRetriever>();

            return services;
        }
    }
}

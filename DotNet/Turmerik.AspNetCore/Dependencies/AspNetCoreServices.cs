using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.Dependencies;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.NetCore.Dependencies;

namespace Turmerik.AspNetCore.Dependencies
{
    public static class AspNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            TrmrkServices.RegisterAll(services);
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

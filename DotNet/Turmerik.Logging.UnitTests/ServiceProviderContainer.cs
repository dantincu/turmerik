using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Logging.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.Logging.UnitTests
{
    public class ServiceProviderContainer : ServiceProviderContainerBase
    {
        private ServiceProviderContainer()
        {
        }

        public static Lazy<ServiceProviderContainer> Instance { get; } = new Lazy<ServiceProviderContainer>(
            () => new ServiceProviderContainer(), LazyThreadSafetyMode.ExecutionAndPublication);

        protected override void RegisterServices(
            IServiceCollection services)
        {
            TrmrkCoreServices.RegisterAll(services);

            services.AddSingleton<IAppEnv, AppEnv>();
            LoggingServices.RegisterAll(services);
        }
    }
}

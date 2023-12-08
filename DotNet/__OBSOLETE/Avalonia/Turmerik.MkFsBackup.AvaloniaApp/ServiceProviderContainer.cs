using Turmerik.Dependencies;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.NetCore.Dependencies;

namespace Turmerik.MkFsBackup.AvaloniaApp
{
    public class ServiceProviderContainer : ServiceProviderContainerBase
    {
        private ServiceProviderContainer()
        {
        }

        public static Lazy<ServiceProviderContainer> Instance { get; } = new Lazy<ServiceProviderContainer>(() => new());

        protected override void RegisterServices(IServiceCollection services)
        {
            TrmrkServices.RegisterAll(services);
            TrmrkNetCoreServices.RegisterAll(services);
            services.AddSingleton<AppGlobals>();
        }
    }
}

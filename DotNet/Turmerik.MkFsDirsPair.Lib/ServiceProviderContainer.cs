using Turmerik.Dependencies;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkFsDirsPair.Lib
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
        }
    }
}

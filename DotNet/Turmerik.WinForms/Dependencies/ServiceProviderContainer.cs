using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Dependencies;
using Turmerik.NetCore.Dependencies;
using Turmerik.WinForms.Actions;

namespace Turmerik.WinForms.Dependencies
{
    public class ServiceProviderContainer : ServiceProviderContainerBase
    {
        private ServiceProviderContainer()
        {
        }

        protected override void RegisterServices(
            IServiceCollection services)
        {
            TrmrkCoreServices.RegisterAll(services);
            TrmrkNetCoreServices.RegisterAll(services);
            WinFormsServices.RegisterAll(services);
        }

        public static Lazy<ServiceProviderContainer> Instance { get; } = new(() => new());
    }
}

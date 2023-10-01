using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Dependencies
{
    public abstract class ServiceProviderContainerBase : SingletonRegistrarBase<IServiceProvider, ServiceProviderOpts>
    {
        protected abstract void RegisterServices(
            IServiceCollection services);

        protected override IServiceProvider Convert(
            ServiceProviderOpts opts)
        {
            RegisterServices(opts.Services);

            opts.ServicesCallback?.Invoke(
                opts.Services);

            var svcProv = opts.Services.BuildServiceProvider();
            return svcProv;
        }
    }
}

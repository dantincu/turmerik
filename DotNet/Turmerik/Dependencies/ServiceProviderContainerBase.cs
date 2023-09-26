using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Dependencies
{
    public abstract class ServiceProviderContainerBase : SingletonRegistrarBase<IServiceProvider, IServiceCollection>
    {
        protected readonly Guid Guid = Guid.NewGuid();

        protected abstract void RegisterServices(
            IServiceCollection services);

        protected override IServiceProvider Convert(
            IServiceCollection services)
        {
            RegisterServices(services);
            var svcProv = services.BuildServiceProvider();

            return svcProv;
        }
    }
}

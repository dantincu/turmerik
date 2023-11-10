using Turmerik.Dependencies;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Notes.Dependencies;

namespace Turmerik.Notes.UnitTests
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
            TrmrkServices.RegisterAll(services);
            TrmrkNoteServices.RegisterAll(services);
        }
    }
}

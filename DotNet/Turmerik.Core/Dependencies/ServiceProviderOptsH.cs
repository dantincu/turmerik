using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Dependencies
{
    public static class ServiceProviderOptsH
    {
        public static ServiceProviderOpts AsOpts(
            this IServiceCollection services,
            Action<IServiceCollection> servicesCallback = null) => new ServiceProviderOpts
            {
                Services = services,
                ServicesCallback = servicesCallback
            };
    }
}

using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Logging.Dependencies
{
    public static class LoggingServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            return services;
        }
    }
}

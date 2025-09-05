using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.NetCore.ConsoleApps.ExecuteCustomCommand.Executors;

namespace Turmerik.ExecuteCustomCommand.Dependencies
{
    public static class TrmrkExecuteCustomCommandServices
    {
        public static IServiceCollection AddCustomCommandExecutors(
            this IServiceCollection services)
        {
            services.AddScoped<QuitCommandExecutor>();

            return services;
        }
    }
}

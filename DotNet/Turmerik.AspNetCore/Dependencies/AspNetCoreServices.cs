using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.UserSessions;
using Turmerik.Core.Dependencies;
using Turmerik.NetCore.Dependencies;

namespace Turmerik.AspNetCore.Dependencies
{
    public static class AspNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IUsersManager, UsersManager>();
            return services;
        }
    }
}

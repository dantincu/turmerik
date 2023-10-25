using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.AspNetCore.Dependencies;
using Turmerik.LocalDevice.Core.Env;

namespace Turmerik.Notes.AspNetCore.Dependencies
{
    public static class NotesAspNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            AspNetCoreServices.RegisterAll(services);
            return services;
        }
    }
}

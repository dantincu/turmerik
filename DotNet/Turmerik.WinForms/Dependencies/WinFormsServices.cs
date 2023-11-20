using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.WinForms.Actions;

namespace Turmerik.WinForms.Dependencies
{
    public static class WinFormsServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            return services;
        }
    }
}

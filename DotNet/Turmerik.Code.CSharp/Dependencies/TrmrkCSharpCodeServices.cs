using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code.CSharp.Dependencies
{
    public static class TrmrkCSharpCodeServices
    {
        public static IServiceCollection RegisterAll(
            this IServiceCollection services)
        {
            return services;
        }
    }
}

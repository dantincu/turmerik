using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.HtmlAgility.Dependencies
{
    public static class HtmlAgilityServices
    {
        public static IServiceCollection RegisterAll(
            this IServiceCollection services)
        {
            services.AddSingleton<IHtmlNodesRetriever, HtmlNodesRetriever>();

            return services;
        }
    }
}

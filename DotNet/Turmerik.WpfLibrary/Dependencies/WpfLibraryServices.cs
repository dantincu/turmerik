using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.WpfLibrary.Actions;
using Turmerik.WpfLibrary.MatUIIcons;

namespace Turmerik.WpfLibrary.Dependencies
{
    public static class WpfLibraryServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IMatUIIconsRetriever, MatUIIconsRetriever>();
            services.AddSingleton<IWpfActionComponentCreator, WpfActionComponentCreator>();

            return services;
        }
    }
}

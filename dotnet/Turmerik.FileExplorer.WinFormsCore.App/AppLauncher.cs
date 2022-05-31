using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Infrastucture;

namespace Turmerik.FileExplorer.WinFormsCore.App
{
    public class AppLauncher
    {
        public async Task Launch(string[] args)
        {
            var programArgs = new ProgramArgsParser().Parse(args);

            var services = new ServiceCollection();
            var appSvcs = TrmrkCoreServiceCollectionBuilder.RegisterAll(services);

            services.AddSingleton(programArgs);
            services.AddSingleton<MainFormViewModel>();
            services.AddSingleton<MainFormEventsViewModel>();
            services.AddTransient<FsExplorerViewModel>();

            ServiceProviderContainer.Instance.Value.RegisterServices(services);
            ServiceProviderContainer.Instance.Value.IsDesignMode = false;

            await using (var app = new App())
            {
                app.Run(programArgs);
            }
        }
    }
}

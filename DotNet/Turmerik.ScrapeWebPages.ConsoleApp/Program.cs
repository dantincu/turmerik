using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Jint.Dependencies;
using Turmerik.ScrapeWebPages.ConsoleApp;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkCoreServices.RegisterAll(services);
TrmrkJintServices.RegisterAll(services);

services.AddSingleton<IAppEnv, AppEnv>();
services.AddSingleton<IProgramBehaviorRetriever, ProgramBehaviorRetriever>();
services.AddSingleton<ProgramComponent>();

var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        using (var program = svcProv.GetRequiredService<ProgramComponent>())
        {
            await program.RunAsync(args);
        }
    },
    false);
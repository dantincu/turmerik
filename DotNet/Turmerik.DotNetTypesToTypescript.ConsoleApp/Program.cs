using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Jint.Dependencies;
using Turmerik.Core.ConsoleApps.DotNetTypesToTypescript;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkCoreServices.RegisterAll(services);

services.AddSingleton<IAppEnv, AppEnv>();

TrmrkCoreServices.AddDotNetTypesToTypescriptServices(services);

var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        await program.RunAsync(args);
    },
    false);
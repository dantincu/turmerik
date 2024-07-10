using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Jint.Dependencies;
using Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkNetCoreServices.RegisterAll(services);
services.AddSingleton<IAppEnv, AppEnv>();

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

TrmrkNetCoreServices.AddDotNetTypesToTypescriptServices(services);
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        await program.RunAsync(args);
    },
    false);
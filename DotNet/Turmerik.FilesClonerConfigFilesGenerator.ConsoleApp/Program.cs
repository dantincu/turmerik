using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.NetCore.ConsoleApps.FilesClonerConfigFilesGenerator;
using Turmerik.Core.LocalDeviceEnv;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkNetCoreServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddSingleton<IAppEnv, AppEnv>();

TrmrkNetCoreServices.AddFilesClonerServices(services);

var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        await program.RunAsync(args);
    },
    false);
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.NetCore.ConsoleApps.FilesCloner;
using Turmerik.Core.LocalDeviceEnv;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkNetCoreServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddSingleton<IAppEnv, AppEnv>();

services.AddScoped<FileCloneComponent>();
services.AddScoped<CloningProfileComponent>();
services.AddScoped<ProgramComponent>();

var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        await program.RunAsync(args);
    },
    false);
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.NetCore.ConsoleApps.FilesCloner;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkNetCoreServices.RegisterAll(services);

services.AddSingleton<IDriveItemsRetriever, FsItemsRetriever>();
services.AddSingleton<IDriveExplorerService, FsExplorerService>();

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
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.DirsPair.ConsoleApps.MkFsDirPairs;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

services.AddSingleton<IDriveItemsRetriever, FsEntriesRetriever>();
services.AddSingleton<IDriveExplorerService, FsExplorerService>();

services.AddTransient<IProgramComponent, ProgramComponent>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        await program.RunAsync(args);
    },
    false);

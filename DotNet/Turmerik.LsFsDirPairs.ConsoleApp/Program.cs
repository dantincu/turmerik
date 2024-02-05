using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.DirsPair.ConsoleApps.LsFsDirPairs;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

services.AddSingleton<IDriveItemsRetriever, FsItemsRetriever>();
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


using Microsoft.Extensions.DependencyInjection;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using RfDirsPairNames = Turmerik.DirsPair.ConsoleApps.RfDirsPairNames;
using Turmerik.FsDirsPairRefactor.ConsoleApp;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.DirsPair.ConsoleApps.RfDirsPairNames;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

services.AddSingleton<IDriveItemsRetriever, FsItemsRetriever>();
services.AddSingleton<IDriveExplorerService, FsExplorerService>();
services.AddSingleton<IProgramComponent, ProgramComponent>();

services.AddTransient<RfFirsPairNamesRecursivellyProgramComponent>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<RfFirsPairNamesRecursivellyProgramComponent>();
        await program.RunAsync(args);
    },
    false);

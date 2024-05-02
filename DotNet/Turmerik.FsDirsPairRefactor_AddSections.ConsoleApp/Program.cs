using Microsoft.Extensions.DependencyInjection;
using Turmerik.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.Core.DriveExplorer;
using Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes;
using FsDirsPairRefactor = Turmerik.FsDirsPairRefactor_AddSections.ConsoleApp;
using RfDirsPairNames = Turmerik.DirsPair.ConsoleApps.RfDirsPairNames;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddSingleton<IdxesUpdater>();
services.AddSingleton<RfDirsPairNames.IProgramComponent, RfDirsPairNames.ProgramComponent>();
services.AddSingleton<FsDirsPairRefactor.ProgramComponent>();

var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<FsDirsPairRefactor.ProgramComponent>();
        await program.RunAsync(args);
    },
    false);

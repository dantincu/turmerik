using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.AddSectionRanks.ConsoleApp;
using UpdFsDirPairsIdxes = Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddTransient<ProgramComponent>();
services.AddSingleton<UpdFsDirPairsIdxes.IdxesUpdater>();
services.AddTransient<UpdFsDirPairsIdxes.IProgramComponent, UpdFsDirPairsIdxes.ProgramComponent>();

var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        await program.RunAsync(args);
    },
    false);

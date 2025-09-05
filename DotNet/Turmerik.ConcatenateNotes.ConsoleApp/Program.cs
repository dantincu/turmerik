using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using UpdFsDirPairsIdxes = Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes;
using RfDirsPairNames = Turmerik.NetCore.ConsoleApps.RfDirsPairNames;
using MkFsDirPairs = Turmerik.NetCore.ConsoleApps.MkFsDirPairs;
using MdToPdf = Turmerik.NetCore.ConsoleApps.MdToPdf;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddTransient<Turmerik.ConcatenateNotes.ConsoleApp.ProgramComponent>();
services.AddSingleton<UpdFsDirPairsIdxes.IdxesUpdater>();
services.AddTransient<UpdFsDirPairsIdxes.IProgramComponent, UpdFsDirPairsIdxes.ProgramComponent>();
services.AddTransient<Turmerik.NetCore.ConsoleApps.MkFsDirPairs.PdfCreatorFactory>();
services.AddTransient<MkFsDirPairs.IProgramComponent, MkFsDirPairs.ProgramComponent>();
services.AddTransient<RfDirsPairNames.IProgramComponent, RfDirsPairNames.ProgramComponent>();
services.AddTransient<MdToPdf.IProgramComponent, MdToPdf.ProgramComponent>();

var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<Turmerik.ConcatenateNotes.ConsoleApp.ProgramComponent>();
        await program.RunAsync(args);
    },
    false);

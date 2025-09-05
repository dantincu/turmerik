using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.FsDirPairsNormalizeMacros.ConsoleApp;
using RfDirsPairNames = Turmerik.NetCore.ConsoleApps.RfDirsPairNames;
using MdToPdf = Turmerik.NetCore.ConsoleApps.MdToPdf;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddTransient<ProgramComponent>();
services.AddTransient<MdToPdf.IProgramComponent, MdToPdf.ProgramComponent>();
services.AddTransient<RfDirsPairNames.IProgramComponent, RfDirsPairNames.ProgramComponent>();

var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        await program.RunAsync(args);
    },
    false);

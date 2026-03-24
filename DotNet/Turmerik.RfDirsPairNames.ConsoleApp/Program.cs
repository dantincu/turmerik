using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.NetCore.Dependencies;
using RfDirsPairNames = Turmerik.NetCore.ConsoleApps.RfDirsPairNames;
using MdToPdf = Turmerik.NetCore.ConsoleApps.MdToPdf;
using MkFsDirPairs = Turmerik.NetCore.ConsoleApps.MkFsDirPairs;
using UpdateNoteChildren = Turmerik.NetCore.ConsoleApps.UpdateNoteChildren;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);
TrmrkNetCoreServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddTransient<MdToPdf.IProgramComponent, MdToPdf.ProgramComponent>();
services.AddTransient<MkFsDirPairs.PdfCreatorFactory>();
services.AddTransient<MkFsDirPairs.IProgramComponent, MkFsDirPairs.ProgramComponent>();
services.AddTransient<RfDirsPairNames.IProgramComponent, RfDirsPairNames.ProgramComponent>();
services.AddTransient<UpdateNoteChildren.IProgramComponent, UpdateNoteChildren.ProgramComponent>();
services.AddNoteChildrenUpdaterServices();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    (async () =>
    {
        var program = svcProv.GetRequiredService<RfDirsPairNames.IProgramComponent>();
        await program.RunAsync(args);
    }),
    false);

using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.NetCore.ConsoleApps.UpdFsDirPairsIdxes;
using Turmerik.NetCore.Dependencies;
using UpdateNoteChildren = Turmerik.NetCore.ConsoleApps.UpdateNoteChildren;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddSingleton<IdxesUpdater>();
services.AddNoteChildrenUpdaterServices();
services.AddTransient<IProgramComponent, ProgramComponent>();
services.AddTransient<UpdateNoteChildren.IProgramComponent, UpdateNoteChildren.ProgramComponent>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        await program.RunAsync(args);
    },
    false);

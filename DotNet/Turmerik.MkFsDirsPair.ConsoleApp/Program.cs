using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.NetCore.ConsoleApps.MkFsDirPairs;
using Turmerik.NetCore.Dependencies;
using UpdateNoteChildren = Turmerik.NetCore.ConsoleApps.UpdateNoteChildren;

Console.ForegroundColor = ConsoleColor.DarkYellow;
Console.WriteLine("Turmerik.MkFsDirsPair.ConsoleApp");
Console.ResetColor();
Console.WriteLine();

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);
TrmrkNetCoreServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddTransient<UpdateNoteChildren.IProgramComponent, UpdateNoteChildren.ProgramComponent>();
services.AddNoteChildrenUpdaterServices();
services.AddTransient<IProgramComponent, ProgramComponent>();
services.AddTransient<PdfCreatorFactory>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        await program.RunAsync(args);
    },
    false);

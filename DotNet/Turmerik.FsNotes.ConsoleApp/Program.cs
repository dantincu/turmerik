using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.Notes.ConsoleApps;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

services.AddSingleton<IDriveExplorerService, FsExplorerService>();

services.AddTransient<ProgramComponent>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        await program.RunAsync(args);
    },
    false);

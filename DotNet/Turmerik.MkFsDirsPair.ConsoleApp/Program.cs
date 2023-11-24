using Microsoft.Extensions.DependencyInjection;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.DirsPair.ConsoleApps.MkFsDirPairs;
using Turmerik.Helpers;
using Turmerik.HtmlAgility.DirsPair.ConsoleApps.MkFsDirPairs;

var services = TrmrkServices.RegisterAll(
    new ServiceCollection());

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

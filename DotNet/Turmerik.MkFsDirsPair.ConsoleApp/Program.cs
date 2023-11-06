using Microsoft.Extensions.DependencyInjection;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.ConsoleApp;

var services = TrmrkServices.RegisterAll(
    new ServiceCollection());

services.AddSingleton<IDriveExplorerService, FsExplorerService>();
services.AddSingleton<IDriveItemsCreator, DriveItemsCreator>();

services.AddTransient<ProgramComponent>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        await program.RunAsync(args);
    },
    false);

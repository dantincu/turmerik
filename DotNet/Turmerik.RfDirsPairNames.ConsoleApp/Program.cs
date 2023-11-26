using Microsoft.Extensions.DependencyInjection;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.DirsPair.ConsoleApps.RfDirsPairNames;
using Turmerik.Helpers;

var services = TrmrkServices.RegisterAll(
    new ServiceCollection());

services.AddSingleton<IDriveExplorerService, FsExplorerService>();

services.AddTransient<IProgramComponent, ProgramComponent>();
var svcProv = services.BuildServiceProvider();

ConsoleH.TryExecute(
    () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        program.Run(args);
    },
    false);

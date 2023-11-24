
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using Turmerik.FsDirsPairRevOrder.ConsoleApp;
using Turmerik.Helpers;

var services = TrmrkServices.RegisterAll(
    new ServiceCollection());

services.AddSingleton<IDriveExplorerService, FsExplorerService>();

services.AddTransient<ProgramComponent>();
var svcProv = services.BuildServiceProvider();

ConsoleH.TryExecute(
    () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        program.Run(args);
    },
    false);

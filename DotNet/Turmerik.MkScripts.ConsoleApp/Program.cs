using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.NetCore.ConsoleApps.MkScripts;
using Turmerik.Jint.Dependencies;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkNetCoreServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddSingleton<IAppEnv, AppEnv>();

TrmrkNetCoreServices.AddMkScriptsServices(services);
TrmrkJintServices.RegisterAll(services);

var svcProv = services.BuildServiceProvider();

ConsoleH.TryExecute(
    () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        program.Run(args);
    },
    false);
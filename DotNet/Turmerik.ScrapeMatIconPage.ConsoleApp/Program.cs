using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.ScrapeMatIconPage.ConsoleApp;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddSingleton<ProgramComponent>();

var svcProv = services.BuildServiceProvider();

ConsoleH.TryExecute(
    () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        program.Run(args);
    },
    false);

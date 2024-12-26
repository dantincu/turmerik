using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.Puppeteer.ConsoleApps.RfDirsPairNames;
using MdToPdf = Turmerik.Puppeteer.ConsoleApps.MdToPdf;
using MkFsDirPairs = Turmerik.Puppeteer.ConsoleApps.MkFsDirPairs;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

services.AddTransient<MdToPdf.IProgramComponent, MdToPdf.ProgramComponent>();
services.AddTransient<MkFsDirPairs.PdfCreatorFactory>();
services.AddTransient<MkFsDirPairs.IProgramComponent, MkFsDirPairs.ProgramComponent>();
services.AddTransient<IProgramComponent, ProgramComponent>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    (async () =>
    {
        var program = svcProv.GetRequiredService<IProgramComponent>();
        await program.RunAsync(args);
    }),
    false);

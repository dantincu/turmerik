﻿using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Dependencies;
using Turmerik.NetCore.Dependencies;
using Turmerik.Puppeteer.ConsoleApps.MkFsDirPairs;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkServices.RegisterAll(services);
TrmrkNetCoreServices.RegisterAll(services);

DriveExplorerH.AddFsRetrieverAndExplorer(
    services, null, true);

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

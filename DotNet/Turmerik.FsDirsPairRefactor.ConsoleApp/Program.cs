﻿
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Dependencies;
using Turmerik.DriveExplorer;
using RfDirsPairNames = Turmerik.DriveExplorer.DirsPair.ConsoleApps.RfDirsPairNames;
using Turmerik.FsDirsPairRefactor.ConsoleApp;
using Turmerik.Helpers;

var services = TrmrkServices.RegisterAll(
    new ServiceCollection());

services.AddSingleton<IDriveItemsRetriever, FsEntriesRetriever>();
services.AddSingleton<IDriveExplorerService, FsExplorerService>();
services.AddSingleton<RfDirsPairNames.IProgramComponent, RfDirsPairNames.ProgramComponent>();

services.AddTransient<RfFirsPairNamesRecursivellyProgramComponent>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<RfFirsPairNamesRecursivellyProgramComponent>();
        await program.RunAsync(args);
    },
    false);

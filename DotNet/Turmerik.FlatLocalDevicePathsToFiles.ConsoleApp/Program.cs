using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Dependencies;
using FlatLocalDevicePathsToFiles = Turmerik.NetCore.ConsoleApps.FlatLocalDevicePathsToFiles;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkCoreServices.RegisterAll(services);
TrmrkNetCoreServices.RegisterAll(services);

services.AddSingleton<FlatLocalDevicePathsToFiles.IProgramComponent, FlatLocalDevicePathsToFiles.ProgramComponent>();

var svcProv = services.BuildServiceProvider();

ConsoleH.TryExecute(
    () =>
    {
        var program = svcProv.GetRequiredService<FlatLocalDevicePathsToFiles.IProgramComponent>();
        program.Run(args);
    },
    false);
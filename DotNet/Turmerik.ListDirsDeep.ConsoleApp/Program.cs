using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.ListDirsDeep.ConsoleApp;
using Turmerik.NetCore.Dependencies;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkNetCoreServices.RegisterAll(services);
services.AddSingleton(svcProv => svcProv);

services.AddScoped<ProgramComponent>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        await program.RunAsync(args);
    },
    false);

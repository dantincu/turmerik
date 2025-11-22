using Microsoft.Extensions.DependencyInjection;
using Turmerik.Code.CSharp.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.GenClnblTypes.ConsoleApp.Components;
using Turmerik.NetCore.Dependencies;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkNetCoreServices.RegisterAll(services);
TrmrkCSharpCodeServices.RegisterAll(services);
services.AddSingleton(svcProv => svcProv);

services.AddScoped<ProgramComponent>();
services.AddScoped<ProgramArgsRetriever>();
services.AddScoped<ProgramArgsNormalizer>();
var svcProv = services.BuildServiceProvider();

await ConsoleH.TryExecuteAsync(
    async () =>
    {
        var program = svcProv.GetRequiredService<ProgramComponent>();
        await program.RunAsync(args);
    },
    false);

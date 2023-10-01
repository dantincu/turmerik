
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Helpers;
using Turmerik.Dependencies;
using Turmerik.MkFsDirsPair.Lib;
using Core = Turmerik.LsDirPairs.ConsoleApp;

var svcProv = ServiceProviderContainer.Instance.Value.RegisterData(
    new ServiceCollection().AsOpts(svc => svc.AddScoped<Core.ProgramComponent>()));

ProgramH.Run(() => svcProv.GetRequiredService<Core.ProgramComponent>().Run(args));
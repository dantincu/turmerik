using Microsoft.Extensions.DependencyInjection;
using Turmerik.MkFsBackup.ConsoleApp;
using Turmerik.Dependencies;
using Turmerik.Helpers;

var svcProv = ServiceProviderContainer.Instance.Value.RegisterData(
    new ServiceCollection().AsOpts(svc =>
    {
        svc.AddTransient<ProgramComponent>();
    }));

ProgramH.Run(() => svcProv.GetRequiredService<ProgramComponent>().Run(args));
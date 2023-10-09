
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Helpers;
using Turmerik.Dependencies;
using Turmerik.MkFsDirsPair.Lib;
using Core = Turmerik.LsDirPairs.ConsoleApp;
using Turmerik.DriveExplorer;
using Turmerik.Text;
using Turmerik.LsDirPairs.ConsoleApp;

var svcProv = ServiceProviderContainer.Instance.Value.RegisterData(
    new ServiceCollection().AsOpts());

ProgramH.Run(() => new DirPairsRetriever(
    svcProv.GetRequiredService<INoteDirsPairGeneratorFactory>(),
    svcProv.GetRequiredService<IJsonConversion>().LoadConfig<AppSettings>().TrmrkDirPairs).GetResult(
        args.FirstOrDefault()));
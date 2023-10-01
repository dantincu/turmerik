
using Microsoft.Extensions.DependencyInjection;
using Turmerik.DriveExplorer;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.MkNoteDirsPair.ConsoleApp;
using Turmerik.Text;

var svcProv = ServiceProviderContainer.Instance.Value.RegisterData(
    new ServiceCollection());

ProgH.Run(args,
    new DirNamesPairGenerator(
        svcProv.GetRequiredService<IJsonConversion>(),
        svcProv.GetRequiredService<INoteDirsPairIdxRetrieverFactory>(),
        svcProv.GetRequiredService<INoteDirsPairFullNamePartRetriever>()));


using Microsoft.Extensions.DependencyInjection;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.MkNoteDirsPair.ConsoleApp;

ServiceProviderContainer.Instance.Value.RegisterData(new ServiceCollection());
ProgH.Run(args, new DirNamesPairGenerator());
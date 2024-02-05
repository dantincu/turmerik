using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.TestConsoleApp
{
    internal static class Program
    {
        static void Main(string[] args)
        {
            var services = TrmrkCoreServices.RegisterAll(
                new ServiceCollection());

            services.AddSingleton<IAppEnv, AppEnv>();
            var svcProv = services.BuildServiceProvider();
            var tempDirConsoleApp = svcProv.GetRequiredService<ITempDirConsoleApp>();

            var opts = new TempDirConsoleAppOpts
            {
                Action = (trmrkUniqueDir) =>
                {
                    Console.WriteLine("Hello World");
                },
                TempDirOpts = new Core.Utility.TrmrkUniqueDirOpts
                {
                    DirNameType = typeof(Program)
                }
            };

            Console.Write($"Please specify value (0, 1 or any other key) for {nameof(opts.RemoveExistingTempDirsBeforeAction)}: ");
            var key = Console.ReadKey();
            Console.WriteLine();

            opts.RemoveExistingTempDirsBeforeAction = key.Key switch
            {
                ConsoleKey.D0 => false,
                ConsoleKey.D1 => true,
                _ => null
            };

            Console.Write($"Please specify value (0, 1 or any other key) for {nameof(opts.RemoveTempDirAfterAction)}: ");
            key = Console.ReadKey();
            Console.WriteLine();

            opts.RemoveTempDirAfterAction = key.Key switch
            {
                ConsoleKey.D0 => false,
                ConsoleKey.D1 => true,
                _ => null
            };

            ConsoleH.TryExecute(() =>
            {
                tempDirConsoleApp.Run(opts);
            }, false);
        }
    }
}
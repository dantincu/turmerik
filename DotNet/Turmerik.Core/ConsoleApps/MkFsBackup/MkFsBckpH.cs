using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using Turmerik.Core.Dependencies;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using static Turmerik.Core.ConsoleApps.MkFsBackup.DirsBackupConfig;

namespace Turmerik.Core.ConsoleApps.MkFsBackup
{
    public static class MkFsBckpH
    {
        public static void Run(string[] args)
        {
            var services = TrmrkCoreServices.RegisterAll(
                new ServiceCollection());

            TrmrkCoreServices.RegisterAll(services);

            services.AddTransient<ProgramComponent>();
            var svcProv = services.BuildServiceProvider();

            ConsoleH.TryExecute(
                () =>
                {
                    var program = svcProv.GetRequiredService<ProgramComponent>();
                    program.Run(args);
                },
                false);
        }

        public static string[] ToStrArr(
            this ArgOption option) => new string[] { option.ShortArg, option.FullArg };

        public static FilteredFsEntriesRetrieverOptions ToFsRetrieverOpts(
            IPathFilters pathFilters,
            string rootDirPath) => new FilteredFsEntriesRetrieverOptions
            {
                RootDirPath = rootDirPath,
                IncludedPaths = pathFilters.GetIncludedPaths(),
                ExcludedPaths = pathFilters.GetExcludedPaths(),
                ExcludedEntryNames = pathFilters.GetExcludedEntryNames(),
            };
    }
}

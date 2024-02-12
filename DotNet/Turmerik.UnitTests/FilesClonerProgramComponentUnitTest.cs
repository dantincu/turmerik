using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.NetCore.ConsoleApps.FilesCloner;

namespace Turmerik.UnitTests
{
    public class FilesClonerProgramComponentUnitTest : UnitTestBase
    {
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramComponent programComponent;
        private readonly ITempDirConsoleApp tempDirConsoleApp;

        public FilesClonerProgramComponentUnitTest()
        {
            programArgsRetriever = SvcProv.GetRequiredService<IProgramArgsRetriever>();
            programComponent = SvcProv.GetRequiredService<IProgramComponent>();
            tempDirConsoleApp = SvcProv.GetRequiredService<ITempDirConsoleApp>();
        }

        private async Task PerformTestAsync(
            string[] rawArgs,
            Action<Core.Utility.TrmrkUniqueDir, ProgramArgs> pgArgsModifier,
            Action<Core.Utility.TrmrkUniqueDir, ProgramArgs> onCompleteCallback)
        {
            var pgArgs = programArgsRetriever.GetArgs(rawArgs);

            await tempDirConsoleApp.RunAsync(new TempDirAsyncConsoleAppOpts
            {
                Action = async tempDir =>
                {
                    pgArgsModifier(tempDir, pgArgs);
                    await programComponent.RunAsync(pgArgs);
                    onCompleteCallback(tempDir, pgArgs);
                },
                TempDirOpts = new Core.Utility.TrmrkUniqueDirOpts
                {
                    DirNameType = GetType(),
                },
                RemoveExistingTempDirsBeforeAction = true,
                RemoveTempDirAfterAction = false
            });
        }

        private static class TestTempDirRelPaths
        {
            public const string FILE_CLONER = "temp/file-cloner";

            public static class CloningProfile
            {
                public const string NOTES_BLAZOR_APP = "temp/cloning-profile/notes-blazorapp";
                public const string DOTNET_UTIL_BINS = "temp/cloning-profile/dotnet-util-bins";
                public const string DOTNET_MKBCKP_BINS = "temp/cloning-profile/dotnet-mkbckp-bins";
            }
        }
    }
}

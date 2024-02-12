using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.NetCore.ConsoleApps.FilesCloner;

namespace Turmerik.UnitTests
{
    public class FilesClonerProgramComponentUnitTest : UnitTestBase
    {
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IProgramComponent programComponent;
        private readonly ITempDirConsoleApp tempDirConsoleApp;

        public FilesClonerProgramComponentUnitTest()
        {
            programArgsRetriever = SvcProv.GetRequiredService<IProgramArgsRetriever>();
            programArgsNormalizer = SvcProv.GetRequiredService<IProgramArgsNormalizer>();
            localDevicePathMacrosRetriever = SvcProv.GetRequiredService<ILocalDevicePathMacrosRetriever>();
            programComponent = SvcProv.GetRequiredService<IProgramComponent>();
            tempDirConsoleApp = SvcProv.GetRequiredService<ITempDirConsoleApp>();
        }

        [Fact]
        public async Task LocalFileTest()
        {
            await PerformTestAsync([ ":w:|$TURMERIK_TEMP_DIR|\\temp\\local", ":i:input.txt", ":o:", ":cksm"],
                (tempDir, pgArgs) =>
                {
                    var dirPath = Path.Combine(tempDir.DirPath, "temp\\local");
                    Directory.CreateDirectory(dirPath);

                    string inputFilePath = Path.Combine(
                        dirPath, "input.txt");

                    File.WriteAllText(
                        inputFilePath,
                        "asdfasdf asdfasdf qwerqwer zxcvxzcv asdfasdf asdfasdf qwerqwer zxcvxzcv asdfasdf asdfasdf qwerqwer zxcvxzcv");
                }, (tempDir, pgArgs) =>
                {
                });
        }

        private async Task PerformTestAsync(
            string[] rawArgs,
            Action<Core.Utility.TrmrkUniqueDir, ProgramArgs> pgArgsModifier,
            Action<Core.Utility.TrmrkUniqueDir, ProgramArgs> onCompleteCallback)
        {
            await tempDirConsoleApp.RunAsync(new TempDirAsyncConsoleAppOpts
            {
                Action = async tempDir =>
                {
                    var args = programArgsRetriever.GetArgs(rawArgs);
                    args.TempDir = tempDir;

                    args.WorkDir = tempDir.DirPath;
                    programArgsNormalizer.NormalizeArgs(args);

                    var localDevicePathsMap = args.LocalDevicePathsMap;

                    localDevicePathsMap.TurmerikTempDir = new LocalDevicePathsMap.FolderMtbl
                    {
                        DirPath = tempDir.DirPath
                    };

                    localDevicePathsMap.UserProfileDir.DirPath = Path.Combine(
                        tempDir.DirPath, "temp", "UserProfile");

                    localDevicePathsMap.OnedriveDir.DirPath = Path.Combine(
                        tempDir.DirPath, "temp", "OneDrive");

                    localDevicePathMacrosRetriever.Normalize(
                        localDevicePathsMap);

                    args.Config.Profiles.Single(
                        profile => profile.ProfileName == "notes-blazorapp").ActWith(profile =>
                        {
                            profile.ScriptGroups[0].WorkDir = "|$TURMERIK_REPO_DIR|\\ParcelWs-V2\\apps\\trmrk-notes-blazorapp";
                            profile.ScriptGroups[1].WorkDir = "|$TURMERIK_REPO_DIR|\\DotNet\\Turmerik.Notes.BlazorApp";

                            profile.FileGroups[0].WorkDir = "|$TURMERIK_REPO_DIR|\\ParcelWs-V2\\apps\\trmrk-notes-blazorapp";

                            foreach (var file in profile.FileGroups[1].Files)
                            {
                                file.CloneDirLocator = new Core.FileSystem.FsEntryLocator
                                {
                                    EntryBasePath = Path.Combine(
                                        tempDir.DirPath, "temp",
                                        "trmrk-notes-blazorapp\\wwwroot")
                                };
                            }
                        });

                    pgArgsModifier(tempDir, args);
                    await programComponent.RunAsync(args);
                    onCompleteCallback(tempDir, args);
                },
                TempDirOpts = new Core.Utility.TrmrkUniqueDirOpts
                {
                    DirNameType = GetType(),
                },
                RemoveExistingTempDirsBeforeAction = true,
                RemoveTempDirAfterAction = false
            });
        }
    }
}

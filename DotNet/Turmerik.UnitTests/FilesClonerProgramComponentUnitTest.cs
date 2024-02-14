using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Utility;
using Turmerik.NetCore.ConsoleApps.FilesCloner;

namespace Turmerik.UnitTests
{
    public class FilesClonerProgramComponentUnitTest : UnitTestBase
    {
        private readonly IAppInstanceStartInfoProvider appInstanceStartInfoProvider;
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IProgramComponent programComponent;
        private readonly ITempDirConsoleApp tempDirConsoleApp;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly TrmrkUniqueDirOpts trmrkUniqueDirOpts;

        public FilesClonerProgramComponentUnitTest()
        {
            appInstanceStartInfoProvider = SvcProv.GetRequiredService<IAppInstanceStartInfoProvider>();
            programArgsRetriever = SvcProv.GetRequiredService<IProgramArgsRetriever>();
            programArgsNormalizer = SvcProv.GetRequiredService<IProgramArgsNormalizer>();
            localDevicePathMacrosRetriever = SvcProv.GetRequiredService<ILocalDevicePathMacrosRetriever>();
            programComponent = SvcProv.GetRequiredService<IProgramComponent>();
            tempDirConsoleApp = SvcProv.GetRequiredService<ITempDirConsoleApp>();
            textMacrosReplacer = SvcProv.GetRequiredService<ITextMacrosReplacer>();

            trmrkUniqueDirOpts = new TrmrkUniqueDirOpts
            {
                AppInstanceStartInfo = appInstanceStartInfoProvider.Data,
                DirNameType = GetType(),
                CreateDirectory = true
            };

            tempDirConsoleApp.Run(new TempDirConsoleAppOpts
            {
                Action = tempDir =>
                {
                },
                TempDirOpts = trmrkUniqueDirOpts,
                RemoveExistingTempDirsBeforeAction = true,
                RemoveTempDirAfterAction = false,
            });
        }

        // [Fact]
        public async Task LocalFileTest()
        {
            await PerformTestAsync([ ":w:|$TURMERIK_TEMP_DIR|", ":i:temp\\local\\input.txt", ":o:temp\\local", ":cksm"],
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

        // [Fact]
        public async Task BlazorAppTest()
        {
            await PerformTestAsync([":w:|$TURMERIK_TEMP_DIR|\\temp\\blazorapp", ":p:notes-blazorapp"],
                (tempDir, pgArgs) =>
                {
                }, (tempDir, pgArgs) =>
                {
                });
        }

        // [Fact]
        public async Task UtilityBinsTest()
        {
            await PerformTestAsync([":w:|$TURMERIK_TEMP_DIR|\\temp\\utility-bins", ":p:dotnet-util-bins"],
                (tempDir, pgArgs) =>
                {
                }, (tempDir, pgArgs) =>
                {
                });
        }

        // [Fact]
        public async Task BkpBinsTest()
        {
            await PerformTestAsync([":w:|$TURMERIK_TEMP_DIR|\\temp\\bkp-bins", ":p:dotnet-bkp-bins"],
                (tempDir, pgArgs) =>
                {
                }, (tempDir, pgArgs) =>
                {
                });
        }

        private async Task PerformTestAsync(
            string[] rawArgs,
            Action<TrmrkUniqueDir, ProgramArgs> pgArgsModifier,
            Action<TrmrkUniqueDir, ProgramArgs> onCompleteCallback)
        {
            await tempDirConsoleApp.RunAsync(new TempDirAsyncConsoleAppOpts
            {
                Action = async tempDir =>
                {
                    var args = programArgsRetriever.GetArgs(rawArgs);
                    args.TempDir = tempDir;

                    programArgsNormalizer.NormalizeArgs(args);

                    if (!Path.IsPathRooted(args.WorkDir))
                    {
                        args.WorkDir = Path.Combine(tempDir.DirPath, args.WorkDir);
                    }

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
                            var blazorAppRepoDirPath = Path.Combine(
                                localDevicePathsMap.TurmerikRepoDir.DirPath,
                                "DotNet\\Turmerik.Notes.BlazorApp");

                            var clientBlazorAppRepoDirPath = Path.Combine(
                                localDevicePathsMap.TurmerikRepoDir.DirPath,
                                "ParcelWs-V2\\apps\\trmrk-notes-blazorapp");

                            profile.ScriptGroups[0].WorkDir = Path.Combine(
                                blazorAppRepoDirPath, profile.ScriptGroups[0].WorkDir);

                            profile.ScriptGroups[1].WorkDir = Path.Combine(
                                blazorAppRepoDirPath, profile.ScriptGroups[1].WorkDir);

                            profile.FileGroups[0].WorkDir = blazorAppRepoDirPath;
                            profile.FileGroups[1].WorkDir = clientBlazorAppRepoDirPath;

                            foreach (var file in profile.FileGroups[0].Files)
                            {
                                file.CloneDirLocator = new Core.FileSystem.FsEntryLocator
                                {
                                    EntryPath = Path.Combine(
                                        tempDir.DirPath, "temp",
                                        "Turmerik.Notes.BlazorApp")
                                };
                            }

                            foreach (var file in profile.FileGroups[1].Files)
                            {
                                file.CloneDirLocator = new Core.FileSystem.FsEntryLocator
                                {
                                    EntryPath = Path.Combine(
                                        tempDir.DirPath, "temp",
                                        "Turmerik.Notes.BlazorApp\\wwwroot")
                                };

                                file.InputFileLocator.EntryPath = Path.Combine(
                                    clientBlazorAppRepoDirPath, file.InputFileLocator.EntryRelPath);
                            }
                        });

                    pgArgsModifier(tempDir, args);
                    await programComponent.RunAsync(args);
                    onCompleteCallback(tempDir, args);
                },
                TempDirOpts = trmrkUniqueDirOpts,
                RemoveExistingTempDirsBeforeAction = false,
                RemoveTempDirAfterAction = false
            });
        }
    }
}

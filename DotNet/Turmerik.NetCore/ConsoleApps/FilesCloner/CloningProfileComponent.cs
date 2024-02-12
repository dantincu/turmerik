using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Utility;
using Turmerik.Core.Text;
using static Turmerik.NetCore.ConsoleApps.FilesCloner.ProgramConfig;
using System.IO.Compression;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public interface ICloningProfileComponent
    {
        Task RunAsync(
            ProgramArgs pgArgs,
            Profile profile);
    }

    public class CloningProfileComponent : ICloningProfileComponent
    {
        private readonly IProcessLauncher processLauncher;
        private readonly IFilteredDriveEntriesRetriever filteredFsEntriesRetriever;
        private readonly IFilteredDriveEntriesRemover filteredFsEntriesRemover;
        private readonly IFilteredDriveEntriesCloner filteredDriveEntriesCloner;
        private readonly IDriveEntriesCloner driveEntriesCloner;
        private readonly ITempDirConsoleApp tempDirConsoleApp;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IFileCloneComponent fileCloneComponent;

        public CloningProfileComponent(
            IProcessLauncher processLauncher,
            IFilteredDriveEntriesRetriever filteredFsEntriesRetriever,
            IFilteredDriveEntriesRemover filteredFsEntriesRemover,
            IFilteredDriveEntriesCloner filteredDriveEntriesCloner,
            ITempDirConsoleApp tempDirConsoleApp,
            IProgramArgsNormalizer programArgsNormalizer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IFileCloneComponent fileCloneComponent)
        {
            this.processLauncher = processLauncher ?? throw new ArgumentNullException(
                nameof(processLauncher));

            this.filteredFsEntriesRetriever = filteredFsEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredFsEntriesRetriever));

            this.filteredFsEntriesRemover = filteredFsEntriesRemover ?? throw new ArgumentNullException(
                nameof(filteredFsEntriesRemover));

            this.filteredDriveEntriesCloner = filteredDriveEntriesCloner ?? throw new ArgumentNullException(
                nameof(filteredDriveEntriesCloner));

            this.tempDirConsoleApp = tempDirConsoleApp ?? throw new ArgumentNullException(
                nameof(tempDirConsoleApp));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.fileCloneComponent = fileCloneComponent ?? throw new ArgumentNullException(
                nameof(fileCloneComponent));
        }

        public async Task RunAsync(
            ProgramArgs pgArgs,
            Profile profile)
        {
            await RunOnBeforeScripts(profile);

            await RunCoreAsync(
                pgArgs.LocalDevicePathsMap,
                profile);

            await RunOnAfterScripts(profile);
        }

        private async Task RunOnBeforeScripts(
            Profile profile)
        {
            foreach (var scriptGroup in profile.ScriptGroups)
            {
                await RunScriptsAsync(scriptGroup, scriptGroup.OnBeforeScripts);
            }
        }

        private async Task RunOnAfterScripts(
            Profile profile)
        {
            foreach (var scriptGroup in profile.ScriptGroups)
            {
                await RunScriptsAsync(scriptGroup, scriptGroup.OnAfterScripts);
            }
        }

        private async Task RunScriptsAsync(
            ScriptsGroup scriptsGroup,
            List<Script> scriptsList)
        {
            foreach (var script in scriptsList)
            {
                await processLauncher.Launch(
                    scriptsGroup.WorkDir,
                    script.Command,
                    script.Arguments);
            }
        }

        private async Task RunCoreAsync(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            Profile profile)
        {
            foreach (var filesGroup in profile.FileGroups)
            {
                CloneFilesIfReq(filesGroup);

                await CloneDirsIfReqAsync(
                    localDevicePathsMap,
                    filesGroup);
            }
        }

        private void CloneFilesIfReq(
            FilesGroup filesGroup)
        {
            if (filesGroup.Files != null)
            {
                foreach (var file in filesGroup.Files)
                {
                    RunCore(filesGroup, file);
                }
            }
        }

        private async Task CloneDirsIfReqAsync(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            FilesGroup filesGroup)
        {
            if (filesGroup.Dirs != null)
            {
                var dirsToArchiveArr = new List<DriveItem>();

                foreach (var dir in filesGroup.Dirs)
                {
                    dirsToArchiveArr.Add(await RunCore(dir));
                }

                if (filesGroup.CloneArchiveDirLocator != null)
                {
                    if (filesGroup.DfBeforeCloneArchiveDirCleanupFilter != null)
                    {
                        var destnFolder = await filteredFsEntriesRetriever.FindMatchingAsync(
                            new FilteredDriveRetrieverMatcherOpts
                            {
                                PrFolderIdnf = filesGroup.CloneArchiveDirLocator.EntryPath,
                                FsEntriesSerializableFilter = filesGroup.DfBeforeCloneArchiveDirCleanupFilter
                            });

                        await filteredFsEntriesRemover.RemoveEntriesAsync(
                            destnFolder);
                    }

                    string archiveFileName = string.Format(
                        filesGroup.CloneArchiveFileNameTpl,
                        DateTime.UtcNow);

                    string archiveFilePath = Path.Combine(
                        filesGroup.CloneArchiveDirLocator.EntryPath,
                        archiveFileName);

                    await tempDirConsoleApp.RunAsync(new TempDirAsyncConsoleAppOpts
                    {
                        Action = async tempDir =>
                        {
                            localDevicePathsMap.TurmerikTempDir = new LocalDevicePathsMap.FolderMtbl
                            {
                                DirPath = tempDir.DirPath,
                                VarName = "<$TURMERIK_TEMP_DIR>"
                            };

                            localDevicePathMacrosRetriever.Normalize(localDevicePathsMap);

                            for (int i = 0; i < dirsToArchiveArr.Count; i++)
                            {
                                var dirToArchive = dirsToArchiveArr[i];
                                var dirItem = filesGroup.Dirs[i];

                                var relPath = dirItem.CloneDirLocator.EntryRelPath ?? throw new InvalidOperationException(
                                    $"Clone dir locator entry rel path must be not null for every dir in file groups where an archive must be created");

                                var dirPath = Path.Combine(tempDir.DirPath, relPath);
                                Directory.CreateDirectory(dirPath);

                                await driveEntriesCloner.CopyItemsAsync(
                                    dirToArchive,
                                    new DriveItem
                                    {
                                        Idnf = dirPath
                                    });
                            }

                            if (filesGroup.DestnToArchiveDirs != null)
                            {
                                foreach (var dir in filesGroup.DestnToArchiveDirs)
                                {
                                    programArgsNormalizer.NormalizeDirArgs(
                                        localDevicePathsMap,
                                        filesGroup, dir, filesGroup.WorkDir);

                                    await RunCore(dir);
                                }
                            }

                            ZipFile.CreateFromDirectory(
                                tempDir.DirPath,
                                archiveFilePath);
                        },
                        RemoveTempDirAfterAction = true,
                        RemoveExistingTempDirsBeforeAction = true,
                        TempDirOpts = new Core.Utility.TrmrkUniqueDirOpts
                        {
                            DirNameType = GetType(),
                            PathPartsArr = [ "temp", Path.GetFileName(
                                filesGroup.CloneBaseDirLocator.EntryPath) ]
                        }
                    });
                }
            }
        }

        private void RunCore(
            FilesGroup filesGroup,
            FileArgs fileArgs)
        {
            fileCloneComponent.Run(new FileCloneArgs
            {
                File = fileArgs,
                CloneInputFile = true,
                WorkDir = filesGroup.WorkDir
            });
        }

        private async Task<DriveItem> RunCore(
            DirArgs dirArgs)
        {
            var srcFolder = await filteredFsEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = dirArgs.InputDirLocator.EntryPath,
                    FsEntriesSerializableFilter = dirArgs.InputDirFilter,
                });

            if (dirArgs.BeforeCloneDestnCleanupFilter != null)
            {
                var destnFolder = await filteredFsEntriesRetriever.FindMatchingAsync(
                    new FilteredDriveRetrieverMatcherOpts
                    {
                        PrFolderIdnf = dirArgs.CloneDirLocator.EntryPath,
                        FsEntriesSerializableFilter = dirArgs.BeforeCloneDestnCleanupFilter
                    });

                await filteredFsEntriesRemover.RemoveEntriesAsync(
                    destnFolder);
            }

            var clonedItems = await filteredDriveEntriesCloner.CopyFilteredItemsAsync(
                srcFolder, new DriveItem
                {
                    Idnf = dirArgs.CloneDirLocator.EntryPath
                });

            return clonedItems;
        }
    }
}

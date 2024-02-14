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
        private readonly IPowerShellAdapter powerShellAdapter;
        private readonly IFilteredDriveEntriesRetriever filteredFsEntriesRetriever;
        private readonly IFilteredDriveEntriesRemover filteredFsEntriesRemover;
        private readonly IFilteredDriveEntriesCloner filteredDriveEntriesCloner;
        private readonly IDriveEntriesCloner driveEntriesCloner;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IFileCloneComponent fileCloneComponent;

        public CloningProfileComponent(
            IProcessLauncher processLauncher,
            IPowerShellAdapter powerShellAdapter,
            IFilteredDriveEntriesRetriever filteredFsEntriesRetriever,
            IFilteredDriveEntriesRemover filteredFsEntriesRemover,
            IFilteredDriveEntriesCloner filteredDriveEntriesCloner,
            IProgramArgsNormalizer programArgsNormalizer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IFileCloneComponent fileCloneComponent)
        {
            this.processLauncher = processLauncher ?? throw new ArgumentNullException(
                nameof(processLauncher));

            this.powerShellAdapter = powerShellAdapter ?? throw new ArgumentNullException(
                nameof(powerShellAdapter));

            this.filteredFsEntriesRetriever = filteredFsEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredFsEntriesRetriever));

            this.filteredFsEntriesRemover = filteredFsEntriesRemover ?? throw new ArgumentNullException(
                nameof(filteredFsEntriesRemover));

            this.filteredDriveEntriesCloner = filteredDriveEntriesCloner ?? throw new ArgumentNullException(
                nameof(filteredDriveEntriesCloner));

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
            await RunCoreAsync(pgArgs, profile);
            await RunOnAfterScripts(profile);
        }

        private async Task RunOnBeforeScripts(
            Profile profile)
        {
            foreach (var scriptGroup in profile.ScriptGroups)
            {
                await RunScriptsAsync(scriptGroup.OnBeforeScripts);
            }
        }

        private async Task RunOnAfterScripts(
            Profile profile)
        {
            foreach (var scriptGroup in profile.ScriptGroups)
            {
                await RunScriptsAsync(scriptGroup.OnAfterScripts);
            }
        }

        private async Task RunScriptsAsync(
            List<Script> scriptsList)
        {
            if (scriptsList != null)
            {
                foreach (var script in scriptsList)
                {
                    if (script.PowerShellCmd != null)
                    {
                        powerShellAdapter.Invoke(
                            script.PowerShellCmd);
                    }
                    else
                    {
                        await processLauncher.Launch(
                            script.WinShellCmd);
                    }
                }
            }
        }

        private async Task RunCoreAsync(
            ProgramArgs pgArgs,
            Profile profile)
        {
            foreach (var filesGroup in profile.FileGroups)
            {
                CloneFilesIfReq(filesGroup);

                await CloneDirsIfReqAsync(
                    pgArgs, filesGroup);
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
            ProgramArgs pgArgs,
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
                    string archiveFileName = string.Format(
                        filesGroup.CloneArchiveFileNameTpl,
                        DateTime.UtcNow);

                    string archiveFilePath = Path.Combine(
                        filesGroup.CloneArchiveDirLocator.EntryPath,
                        archiveFileName);

                    localDevicePathMacrosRetriever.Normalize(
                        pgArgs.LocalDevicePathsMap);

                    for (int i = 0; i < dirsToArchiveArr.Count; i++)
                    {
                        var dirToArchive = dirsToArchiveArr[i];
                        var dirItem = filesGroup.Dirs[i];

                        var relPath = dirItem.CloneDirLocator.EntryRelPath ?? throw new InvalidOperationException(
                            $"Clone dir locator entry rel path must be not null for every dir in file groups where an archive must be created");

                        var dirPath = Path.Combine(pgArgs.TempDir.DirPath, relPath);
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
                                pgArgs.LocalDevicePathsMap,
                                filesGroup, dir, filesGroup.WorkDir);

                            await RunCore(dir);
                        }
                    }

                    ZipFile.CreateFromDirectory(
                        pgArgs.TempDir.DirPath,
                        archiveFilePath);
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

                if (dirArgs.OnBeforeCloneDestnPerformingCleanup != null)
                {
                    dirArgs.OnBeforeCloneDestnPerformingCleanup(
                        dirArgs.CloneDirLocator.EntryPath);
                }

                await filteredFsEntriesRemover.RemoveEntriesAsync(
                    destnFolder);

                if (dirArgs.OnBeforeCloneDestnPerformedCleanup != null)
                {
                    dirArgs.OnBeforeCloneDestnPerformedCleanup(
                        dirArgs.CloneDirLocator.EntryPath);
                }
            }

            if (dirArgs.OnPerformingCloneDestn != null)
            {
                dirArgs.OnPerformingCloneDestn(
                    dirArgs.CloneDirLocator.EntryPath);
            }

            var clonedItems = await filteredDriveEntriesCloner.CopyFilteredItemsAsync(
                srcFolder, new DriveItem
                {
                    Idnf = dirArgs.CloneDirLocator.EntryPath
                });

            if (dirArgs.OnPerformedCloneDestn != null)
            {
                dirArgs.OnPerformedCloneDestn(
                    dirArgs.CloneDirLocator.EntryPath);
            }

            return clonedItems;
        }
    }
}

using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Utility;
using Turmerik.Core.Text;
using static Turmerik.NetCore.ConsoleApps.LocalFilesCloner.ProgramConfig;
using System.IO.Compression;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
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
        private readonly IFileCloneComponent fileCloneComponent;
        private readonly IDriveExplorerService driveExplorerService;

        public CloningProfileComponent(
            IProcessLauncher processLauncher,
            IPowerShellAdapter powerShellAdapter,
            IFilteredDriveEntriesRetriever filteredFsEntriesRetriever,
            IFilteredDriveEntriesRemover filteredFsEntriesRemover,
            IFilteredDriveEntriesCloner filteredDriveEntriesCloner,
            IFileCloneComponent fileCloneComponent,
            IDriveExplorerService driveExplorerService)
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

            this.fileCloneComponent = fileCloneComponent ?? throw new ArgumentNullException(
                nameof(fileCloneComponent));

            this.driveExplorerService = driveExplorerService ?? throw new ArgumentNullException(
                nameof(driveExplorerService));
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
            if (profile.ScriptGroups != null)
            {
                foreach (var scriptGroup in profile.ScriptGroups)
                {
                    await RunScriptsAsync(scriptGroup.OnBeforeScripts);
                }
            }
        }

        private async Task RunOnAfterScripts(
            Profile profile)
        {
            if (profile.ScriptGroups != null)
            {
                foreach (var scriptGroup in profile.ScriptGroups)
                {
                    await RunScriptsAsync(scriptGroup.OnAfterScripts);
                }
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
                var prevCheckSums = new List<string>();

                foreach (var file in filesGroup.Files)
                {
                    string nextChecksum = RunCore(
                        filesGroup, file, prevCheckSums);

                    if (nextChecksum != null)
                    {
                        prevCheckSums.Add(nextChecksum);
                    }
                }
            }
        }

        private async Task CloneDirsIfReqAsync(
            ProgramArgs pgArgs,
            FilesGroup filesGroup)
        {
            if (filesGroup.Folders != null)
            {
                foreach (var dir in filesGroup.Folders)
                {
                    await RunCore(dir);
                }

                if (filesGroup.CloneArchiveDirPath != null)
                {
                    if (filesGroup.BeforeArchiveCleanupFilter != null)
                    {
                        var archiveFolder = await filteredFsEntriesRetriever.FindMatchingAsync(
                            new FilteredDriveRetrieverMatcherOpts
                            {
                                PrFolderIdnf = Path.GetFullPath(filesGroup.CloneArchiveDirPath),
                                FsEntriesSerializableFilter = filesGroup.BeforeArchiveCleanupFilter
                            });

                        await filteredFsEntriesRemover.RemoveEntriesAsync(
                            archiveFolder);
                    }

                    string archiveFileName = string.Format(
                        filesGroup.CloneArchiveFileNameTpl,
                        DateTime.UtcNow);

                    string archiveFilePath = Path.Combine(
                        filesGroup.CloneArchiveDirPath,
                        archiveFileName);

                    ZipFile.CreateFromDirectory(
                        pgArgs.TempDir.DirPath,
                        archiveFilePath);
                }
            }
        }

        private string RunCore(
            FilesGroup filesGroup,
            ProgramConfig.File fileArgs,
            List<string> prevCheckSums) => fileCloneComponent.Run(new FileCloneArgs
            {
                File = fileArgs,
                CloneInputFile = true,
            }, prevCheckSums);

        private async Task<DriveItem> RunCore(
            Folder dirArgs)
        {
            var srcFolder = await filteredFsEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = Path.GetFullPath(dirArgs.InputDirPath),
                    FsEntriesSerializableFilter = dirArgs.InputDirFilter,
                });

            if (dirArgs.BeforeCloneDestnCleanupFilter != null)
            {
                Directory.CreateDirectory(dirArgs.CloneDirPath);

                var destnFolder = await filteredFsEntriesRetriever.FindMatchingAsync(
                    new FilteredDriveRetrieverMatcherOpts
                    {
                        PrFolderIdnf = Path.GetFullPath(dirArgs.CloneDirPath),
                        FsEntriesSerializableFilter = dirArgs.BeforeCloneDestnCleanupFilter
                    });

                await filteredFsEntriesRemover.RemoveEntriesAsync(
                    destnFolder);
            }

            var clonedItems = await filteredDriveEntriesCloner.CopyFilteredItemsAsync(
                srcFolder, new DriveItem
                {
                    Idnf = dirArgs.CloneDirPath
                });

            return clonedItems;
        }
    }
}

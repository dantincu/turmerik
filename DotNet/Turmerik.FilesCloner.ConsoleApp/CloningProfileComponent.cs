using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;
using Turmerik.DriveExplorer;
using Turmerik.NetCore.Utility;
using static Turmerik.FilesCloner.ConsoleApp.ProgramConfig;

namespace Turmerik.FilesCloner.ConsoleApp
{
    public class CloningProfileComponent
    {
        private readonly IProcessLauncher processLauncher;
        private readonly IFilteredDriveEntriesRetriever filteredFsEntriesRetriever;
        private readonly FileCloneComponent fileCloneComponent;

        public CloningProfileComponent(
            IProcessLauncher processLauncher,
            IFilteredDriveEntriesRetriever filteredFsEntriesRetriever,
            FileCloneComponent fileCloneComponent)
        {
            this.processLauncher = processLauncher ?? throw new ArgumentNullException(
                nameof(processLauncher));

            this.filteredFsEntriesRetriever = filteredFsEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredFsEntriesRetriever));

            this.fileCloneComponent = fileCloneComponent ?? throw new ArgumentNullException(
                nameof(fileCloneComponent));
        }

        public async Task RunAsync(
            Profile profile)
        {
            await RunOnBeforeScripts(profile);
            RunCore(profile);
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

        private void RunCore(
            Profile profile)
        {
            foreach (var filesGroup in profile.FileGroups)
            {
                CloneFilesIfReq(filesGroup);
                CloneDirsIfReq(filesGroup);
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

        private void CloneDirsIfReq(
            FilesGroup filesGroup)
        {
            if (filesGroup.Dirs != null)
            {
                foreach (var dir in filesGroup.Dirs)
                {
                    RunCore(filesGroup, dir);
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

        private async void RunCore(
            FilesGroup filesGroup,
            DirArgs dirArgs)
        {
            var srcFolder = await filteredFsEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = dirArgs.InputDirLocator.EntryPath,
                    FsEntriesSerializableFilter = dirArgs.InputDirFilter,
                });

            var destnFolder = await filteredFsEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = dirArgs.CloneDirLocator.EntryPath,
                    FsEntriesSerializableFilter = dirArgs.BeforeCloneDestnCleanupFilter
                });
        }
    }
}

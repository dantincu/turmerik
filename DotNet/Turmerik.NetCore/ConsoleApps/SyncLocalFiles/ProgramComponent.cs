using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] args);

        Task RunAsync(ProgramArgs args);

        Task RunCoreAsync(ProgramArgs args);

        Task RunAsync(ProgramArgs args,
            ProgramConfig.SrcFolder srcFolder,
            ProgramConfig.DestnLocation destnFolder,
            KeyValuePair<string, ProgramConfig.DestnFolder> destnFolderKvp);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IFilteredDriveEntriesRetriever filteredFsEntriesRetriever;
        private readonly IFilteredDriveEntriesSynchronizer filteredDriveEntriesSynchronizer;

        public ProgramComponent(
            ITextMacrosReplacer textMacrosReplacer,
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IFilteredDriveEntriesRetriever filteredFsEntriesRetriever,
            IFilteredDriveEntriesSynchronizer filteredDriveEntriesSynchronizer)
        {
            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.filteredFsEntriesRetriever = filteredFsEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredFsEntriesRetriever));

            this.filteredDriveEntriesSynchronizer = filteredDriveEntriesSynchronizer ?? throw new ArgumentNullException(
                nameof(filteredDriveEntriesSynchronizer));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = programArgsRetriever.GetArgs(rawArgs);
            programArgsNormalizer.NormalizeArgs(args);

            await RunAsync(args);
        }

        public async Task RunAsync(ProgramArgs args)
        {
            await RunCoreAsync(args);

            if (args.FileSyncType == FileSyncType.Push && args.PropagatePush == true)
            {
                args.SrcFolders = null;
                programArgsNormalizer.NormalizeSrcFolders(args, args.Profile, true);

                args.FileSyncType = FileSyncType.Pull;
                await RunCoreAsync(args);
            }
        }

        public async Task RunCoreAsync(ProgramArgs args)
        {
            foreach (var srcFolder in args.SrcFolders)
            {
                foreach (var destnLocation in srcFolder.DestnLocations)
                {
                    foreach (var destnFolderKvp in destnLocation.FoldersMap)
                    {
                        await RunAsync(
                            args,
                            srcFolder,
                            destnLocation,
                            destnFolderKvp);
                    }
                }
            }
        }

        public async Task RunAsync(
            ProgramArgs args,
            ProgramConfig.SrcFolder srcFolder,
            ProgramConfig.DestnLocation destnFolder,
            KeyValuePair<string, ProgramConfig.DestnFolder> destnFolderKvp)
        {
            var srcEntriesObj = await filteredFsEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = Path.GetFullPath(srcFolder.DirPath),
                    FsEntriesSerializableFilter = destnFolderKvp.Value.SrcFilesFilter
                });

            var destnDirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                destnFolderKvp.Value.DirPath,
                destnFolder.DirPath);

            var destnEntriesObj = await filteredFsEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = Path.GetFullPath(destnDirPath),
                    FsEntriesSerializableFilter = destnFolderKvp.Value.DestnFilesFilter
                });

            await filteredDriveEntriesSynchronizer.SyncFilteredItemsAsync(
                new FilteredDriveEntriesSynchronizerOpts
                {
                    FileSyncType = args.FileSyncType
                });
        }
    }
}

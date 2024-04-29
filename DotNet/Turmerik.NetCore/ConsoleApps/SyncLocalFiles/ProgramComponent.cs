using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.LocalDeviceEnv;
using static Turmerik.NetCore.ConsoleApps.SyncLocalFiles.ProgramArgs;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] args);

        Task RunAsync(ProgramArgs args);

        Task RunCoreAsync(ProgramArgs args);

        Task RunAsync(ProgramArgs args,
            ProgramConfig.SrcFolder srcFolder,
            ProgramConfig.DestnLocation destnLocation,
            ProgramConfig.DestnFolder destnFolder);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IFilteredDriveEntriesRetriever filteredFsEntriesRetriever;
        private readonly IFilteredDriveEntriesSynchronizer filteredDriveEntriesSynchronizer;
        private readonly IDriveExplorerService driveExplorerService;

        public ProgramComponent(
            ITextMacrosReplacer textMacrosReplacer,
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IFilteredDriveEntriesRetriever filteredFsEntriesRetriever,
            IFilteredDriveEntriesSynchronizer filteredDriveEntriesSynchronizer,
            IDriveExplorerService driveExplorerService)
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

            this.driveExplorerService = driveExplorerService ?? throw new ArgumentNullException(
                nameof(driveExplorerService));
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
                foreach (var kvp in args.SrcFolderNamesMap)
                {
                    var list = kvp.Value;
                    var arr = list.ToArray();
                    list.Clear();

                    list.AddRange(args.Profile.DestnLocations.Where(
                        location => location.FoldersMap.Keys.Contains(
                            kvp.Key) && !arr.Contains(location.Name)).Select(
                        location => location.Name));
                }

                args.FileSyncType = FileSyncType.Pull;
                await RunCoreAsync(args);
            }
        }

        public async Task RunCoreAsync(ProgramArgs args)
        {
            foreach (var locKvp in args.SrcFolderNamesMap)
            {
                var srcFolder = args.Profile.SrcFolders.Single(
                    folder => folder.Name == locKvp.Key);

                foreach (var destnLocationName in locKvp.Value)
                {
                    var destnLocation = args.Profile.DestnLocations.Single(
                        location => location.Name == destnLocationName);

                    var destnFolder = destnLocation.FoldersMap[locKvp.Key];

                    await RunAsync(
                        args,
                        srcFolder,
                        destnLocation,
                        destnFolder);
                }
            }
        }

        public async Task RunAsync(
            ProgramArgs args,
            ProgramConfig.SrcFolder srcFolder,
            ProgramConfig.DestnLocation destnLocation,
            ProgramConfig.DestnFolder destnFolder)
        {
            var destnDirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                destnFolder.DirPath,
                destnLocation.DirPath);

            Directory.CreateDirectory(destnDirPath);

            if (args.OnBeforeSync != null)
            {
                await args.OnBeforeSync(
                    args,
                    srcFolder,
                    destnLocation,
                    destnFolder,
                    destnDirPath);
            }

            var srcEntriesObj = await filteredFsEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = srcFolder.DirPath,
                    FsEntriesSerializableFilter = destnFolder.SrcFilesFilter
                });

            var destnEntriesObj = await filteredFsEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = destnDirPath,
                    FsEntriesSerializableFilter = destnFolder.DestnFilesFilter
                });

            var diffResult = args.DiffResultFactory?.Invoke(
                args,
                srcFolder,
                destnLocation,
                destnFolder,
                destnDirPath,
                srcEntriesObj,
                destnEntriesObj);

            diffResult = await filteredDriveEntriesSynchronizer.SyncFilteredItemsAsync(
                new FilteredDriveEntriesSynchronizerOpts
                {
                    DiffResult = diffResult,
                    FileSyncType = args.FileSyncType,
                    TreatAllAsDiff = args.TreatAllAsDiff,
                    Interactive = args.Interactive,
                    RowsToPrint = args.RowsToPrint,
                    DeleteEmptyFolders = true,
                    SkipDiffPrinting = args.SkipDiffPrinting,
                    SrcFilteredEntries = srcEntriesObj,
                    DestnFilteredEntries = destnEntriesObj,
                    SrcName = srcFolder.Name,
                    DestnName = destnLocation.Name,
                    SrcDirPath = srcFolder.DirPath,
                    DestnDirPath = destnDirPath,
                });

            if (args.OnAfterSync != null)
            {
                await args.OnAfterSync(
                    args,
                    srcFolder,
                    destnLocation,
                    destnFolder,
                    destnDirPath,
                    srcEntriesObj,
                    destnEntriesObj,
                    diffResult);
            }
        }
    }
}

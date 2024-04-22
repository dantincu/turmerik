using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
{
    public interface IProgramArgsNormalizer
    {
        void NormalizeArgs(
            ProgramArgs args);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.SrcFolder srcFolder);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.SrcFolder srcFolder,
            ProgramConfig.DestnLocation destnFolder);

        void NormalizeSrcFolders(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            bool negativeFilter = false);
    }

    public class ProgramArgsNormalizer : IProgramArgsNormalizer
    {
        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;

        public ProgramArgsNormalizer(
            IProgramConfigRetriever programConfigRetriever,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever)
        {
            this.programConfigRetriever = programConfigRetriever ?? throw new ArgumentNullException(
                nameof(programConfigRetriever));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));
        }

        public void NormalizeArgs(ProgramArgs args)
        {
            switch (args.FileSyncType)
            {
                case FileSyncType.Diff:
                case FileSyncType.Pull:
                case FileSyncType.Push:
                    break;
                default:
                    throw new ArgumentException(nameof(args.FileSyncType));
            }

            args.WorkDir = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                args.WorkDir,
                null);

            NormalizeArgs(args, args.Profile);
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile)
        {
            args.SrcFolderNamesMap ??= profile.SrcFolders.ToDictionary(
                srcFolder => srcFolder.Name,
                srcFolder => srcFolder.DestnLocations.Select(
                    destnLocation => destnLocation.Name).ToArray());

            NormalizeSrcFolders(args, profile);

            profile.DirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                profile.DirPath,
                args.WorkDir);

            profile.DfSrcFilesFilter ??= DriveEntriesSerializableFilter.IncludeAll();
            profile.DfDestnFilesFilter ??= DriveEntriesSerializableFilter.IncludeAll();

            foreach (var srcFolder in profile.SrcFolders)
            {
                NormalizeArgs(args, profile, srcFolder);
            }
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.SrcFolder srcFolder)
        {
            srcFolder.DirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                srcFolder.DirPath,
                profile.DirPath);

            srcFolder.DfSrcFilesFilter ??= profile.DfSrcFilesFilter;
            srcFolder.DfDestnFilesFilter ??= profile.DfDestnFilesFilter;

            foreach (var destnFolder in srcFolder.DestnLocations)
            {
                NormalizeArgs(args, profile, srcFolder, destnFolder);
            }
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.SrcFolder srcFolder,
            ProgramConfig.DestnLocation destnFolder)
        {
            destnFolder.DirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                destnFolder.DirPath,
                srcFolder.DirPath);

            destnFolder.DfSrcFilesFilter ??= srcFolder.DfSrcFilesFilter;
            destnFolder.DfDestnFilesFilter ??= srcFolder.DfDestnFilesFilter;
        }

        public void NormalizeSrcFolders(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            bool negativeFilter = false)
        {
            args.SrcFolders ??= args.SrcFolderNamesMap.Select(
                kvp => new ProgramConfig.SrcFolder(
                    profile.SrcFolders.Single(
                        folder => folder.Name == kvp.Key)).ActWith(folder =>
                        {
                            folder.DestnLocations.RemoveWhere(
                                destnLocation => negativeFilter == kvp.Value.Contains(
                                    destnLocation.Name));

                            if (args.FileSyncType == FileSyncType.Push && folder.DestnLocations.Count > 1)
                            {
                                throw new InvalidOperationException(
                                    "Cannot perform push operation from multiple locations to a single source");
                            }
                        })).ToArray();
        }
    }
}

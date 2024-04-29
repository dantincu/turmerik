using Turmerik.Core.ConsoleApps;
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
            ProgramConfig.DestnLocation destnFolder);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.DestnLocation destnLocation,
            ProgramConfig.DestnFolder destnFolder);
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

            NormalizeArgs(args, args.Profile);
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile)
        {
            args.DestnLocationNamesList = args.DestnLocationNamesList.Distinct().ToList();

            foreach (var destnLocName in args.DestnLocationNamesList)
            {
                var destnLoc = profile.DestnLocations.Single(
                    loc => loc.Name == destnLocName);

                foreach (var destnKvp in destnLoc.FoldersMap)
                {
                    var srcFolderNamesList = args.SrcFolderNamesMap.GetOrAdd(
                        destnKvp.Key, key => new List<string>());

                    if (!srcFolderNamesList.Contains(destnLocName))
                    {
                        srcFolderNamesList.Add(destnLocName);
                    }
                }
            }

            if (args.SrcFolderNamesMap.None())
            {
                args.SrcFolderNamesMap = profile.SrcFolders.ToDictionary(
                    srcFolder => srcFolder.Name,
                    srcFolder => new List<string>());
            }

            if (args.FileSyncType == FileSyncType.Push)
            {
                foreach (var kvp in args.SrcFolderNamesMap)
                {
                    if (kvp.Value.Count != 1)
                    {
                        throw new InvalidOperationException(
                            "Cannot push from multiple locations into the same source folder");
                    }
                }
            }
            else
            {
                foreach (var kvp in args.SrcFolderNamesMap)
                {
                    if (kvp.Value.None())
                    {
                        kvp.Value.AddRange(profile.DestnLocations.Where(
                            destnLocation => destnLocation.FoldersMap.Keys.Contains(
                                kvp.Key)).Select(destnLocation => destnLocation.Name));
                    }
                }
            }

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

            foreach (var destnLocation in profile.DestnLocations)
            {
                NormalizeArgs(args, profile, destnLocation);
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
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.DestnLocation destnLocation)
        {
            destnLocation.DirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                destnLocation.DirPath,
                profile.DirPath);

            destnLocation.DfSrcFilesFilter ??= profile.DfSrcFilesFilter;
            destnLocation.DfDestnFilesFilter ??= profile.DfDestnFilesFilter;

            foreach (var destnFolderKvp in destnLocation.FoldersMap)
            {
                NormalizeArgs(
                    args,
                    profile,
                    destnLocation,
                    destnFolderKvp.Value);
            }
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.DestnLocation destnLocation,
            ProgramConfig.DestnFolder destnFolder)
        {
            destnFolder.DirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                destnFolder.DirPath,
                destnLocation.DirPath);

            destnFolder.SrcFilesFilter ??= destnLocation.DfSrcFilesFilter;
            destnFolder.DestnFilesFilter ??= destnLocation.DfDestnFilesFilter;
        }
    }
}

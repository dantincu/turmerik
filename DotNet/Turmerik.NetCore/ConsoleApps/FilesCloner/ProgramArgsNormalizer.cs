using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public interface IProgramArgsNormalizer
    {
        void NormalizeArgs(
            ProgramArgs args);

        void NormalizeDirArgs(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            ProgramConfig.FilesGroup filesGroup,
            DirArgs dirArgs,
            string workDir);
    }

    public class ProgramArgsNormalizer : IProgramArgsNormalizer
    {
        private readonly ITextMacrosReplacer textMacrosReplacer;

        public ProgramArgsNormalizer(
            ITextMacrosReplacer textMacrosReplacer)
        {
            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));
        }

        public void NormalizeArgs(
            ProgramArgs args)
        {
            args.WorkDir = args.SingleFileArgs?.WorkDir ?? Environment.CurrentDirectory;

            if (args.Profile != null)
            {
                NormalizeArgsProfile(args, args.Profile);
            }
            else
            {
                args.SingleFileArgs!.WorkDir ??= Environment.CurrentDirectory;

                if (args.SingleFileArgs.File != null)
                {
                    NormalizeFileCloneArgs(
                        args.LocalDevicePathsMap,
                        args.SingleFileArgs);
                }
            }
        }

        public void NormalizeDirArgs(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            ProgramConfig.FilesGroup filesGroup,
            DirArgs dirArgs,
            string workDir)
        {
            NormalizeFileLocators(
                localDevicePathsMap,
                dirArgs.InputDirLocator ??= new FsEntryLocator(),
                dirArgs.CloneDirLocator ??= new FsEntryLocator(),
                workDir);

            NormalizeFsEntriesFilterIfReq(
                dirArgs.InputDirFilter ??= DriveEntriesSerializableFilter.IncludeAll(),
                filesGroup.DfInputDirFilter);

            NormalizeFsEntriesFilterIfReq(
                dirArgs.BeforeCloneDestnCleanupFilter,
                filesGroup.DfBeforeCloneDestnCleanupFilter);
        }

        private void NormalizeArgsProfile(
            ProgramArgs args,
            ProgramConfig.Profile profile)
        {
            profile.ScriptGroups ??= new List<ProgramConfig.ScriptsGroup>();

            foreach (var scriptsGroup in profile.ScriptGroups)
            {
                scriptsGroup.WorkDir ??= args.WorkDir;
            }

            foreach (var filesGroup in profile.FileGroups)
            {
                NormalizeFilesGroup(
                    args.LocalDevicePathsMap,
                    filesGroup,
                    args.WorkDir);
            }
        }

        private void NormalizeFilesGroup(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            ProgramConfig.FilesGroup filesGroup,
            string workDir)
        {
            NormalizeFileLocators(
                localDevicePathsMap,
                filesGroup.InputBaseDirLocator ??= new FsEntryLocator(),
                filesGroup.CloneBaseDirLocator ??= new FsEntryLocator(),
                filesGroup.WorkDir ??= workDir);

            if (filesGroup.Files != null)
            {
                foreach (var file in filesGroup.Files)
                {
                    NormalizeFileArgs(
                        localDevicePathsMap,
                        file, filesGroup.WorkDir);
                }
            }

            NormalizeFsEntriesFilterIfReq(
                filesGroup.DfInputDirFilter ??= DriveEntriesSerializableFilter.IncludeAll());

            NormalizeFsEntriesFilterIfReq(
                filesGroup.DfBeforeCloneDestnCleanupFilter);

            if (filesGroup.Dirs != null)
            {
                foreach (var dir in filesGroup.Dirs)
                {
                    NormalizeDirArgs(
                        localDevicePathsMap,
                        filesGroup, dir, filesGroup.WorkDir);
                }
            }

            if (filesGroup.CloneArchiveDirLocator != null)
            {
                NormalizeFileLocator(
                localDevicePathsMap,
                    filesGroup.CloneArchiveDirLocator,
                    filesGroup.WorkDir);

                filesGroup.CloneArchiveFileNameTpl ??= "{0}.{2}";
            }
        }

        private void NormalizeFileCloneArgs(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            FileCloneArgs cloneArgs)
        {
            NormalizeFileArgs(
                localDevicePathsMap,
                cloneArgs.File,
                cloneArgs.WorkDir);
        }

        private void NormalizeFileArgs(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            FileArgs fileArgs,
            string workDir)
        {
            NormalizeFileLocators(
                localDevicePathsMap,
                fileArgs.InputFileLocator ??= new FsEntryLocator(),
                fileArgs.CloneDirLocator ??= new FsEntryLocator(),
                workDir);
        }

        private void NormalizeFileLocators(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            FsEntryLocator inputFileLocator,
            FsEntryLocator cloneFileLocator,
            string workDir)
        {
            NormalizeFileLocator(
                localDevicePathsMap,
                inputFileLocator,
                workDir);

            NormalizeFileLocator(
                localDevicePathsMap,
                cloneFileLocator,
                workDir,
                () => string.Empty);
        }

        private void NormalizeFileLocator(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            FsEntryLocator fileLocator,
            string workDir,
            Func<string> defaultEmptyRelPathFactory = null)
        {
            fileLocator.EntryBasePath = NormalizePathIfNotNull(
                localDevicePathsMap,
                fileLocator.EntryBasePath);

            fileLocator.EntryRelPath = NormalizePathIfNotNull(
                localDevicePathsMap,
                fileLocator.EntryRelPath);

            fileLocator.EntryPath = NormalizePathIfNotNull(
                localDevicePathsMap,
                fileLocator.EntryPath);

            fileLocator.Normalize(
                workDir, false,
                defaultEmptyRelPathFactory);
        }

        private string NormalizePathIfNotNull(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            string path)
        {
            if (path != null)
            {
                path = textMacrosReplacer.ReplacePathMacros(
                    new TextMacrosReplacerOpts
                    {
                        InputText = path,
                        MacrosMap = localDevicePathsMap.GetPathsMap(),
                    });
            }

            return path;
        }

        private void NormalizeFsEntriesFilterIfReq(
            DriveEntriesSerializableFilter filter,
            DriveEntriesSerializableFilter dfFilter = null)
        {
            if (filter != null)
            {
                filter.IncludedRelPathRegexes ??= new List<string>();
                filter.ExcludedRelPathRegexes ??= new List<string>();

                if (dfFilter != null)
                {
                    filter.IncludedRelPathRegexes.InsertRange(
                        0, dfFilter.IncludedRelPathRegexes);

                    filter.ExcludedRelPathRegexes.InsertRange(
                        0, dfFilter.ExcludedRelPathRegexes);
                }
            }
        }
    }
}

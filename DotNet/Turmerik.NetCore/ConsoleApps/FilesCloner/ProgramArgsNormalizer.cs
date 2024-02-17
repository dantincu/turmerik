using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using static Turmerik.NetCore.ConsoleApps.FilesCloner.ProgramConfig;

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
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;

        public ProgramArgsNormalizer(
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever)
        {
            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));
        }

        public void NormalizeArgs(
            ProgramArgs args)
        {
            args.LocalDevicePathsMap.TurmerikTempDir = new LocalDevicePathsMap.FolderMtbl
            {
                DirPath = args.TempDir.DirPath
            };

            localDevicePathMacrosRetriever.Normalize(args.LocalDevicePathsMap);

            args.WorkDir = NormalizePathIfNotNull(
                args.LocalDevicePathsMap, args.WorkDir ?? Environment.CurrentDirectory,
                () => Environment.CurrentDirectory);

            if (args.Profile != null)
            {
                NormalizeArgsProfile(args, args.Profile);
            }
            else
            {
                args.SingleFileArgs!.WorkDir = NormalizePathIfNotNull(
                    args.LocalDevicePathsMap, args.SingleFileArgs!.WorkDir ?? args.WorkDir,
                    () => args.WorkDir);

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
            FilesGroup filesGroup,
            DirArgs dirArgs,
            string workDir)
        {
            NormalizeFileLocators(
                localDevicePathsMap,
                dirArgs.InputDirLocator ??= FsEntryLocatorH.FromPath(string.Empty),
                dirArgs.CloneDirLocator ??= FsEntryLocatorH.FromPath(string.Empty),
                filesGroup.InputBaseDirLocator,
                filesGroup.CloneBaseDirLocator,
                workDir);

            NormalizeFsEntriesFilterIfReq(
                dirArgs.InputDirFilter ??= DriveEntriesSerializableFilter.IncludeAll(),
                filesGroup.DfInputDirFilter);

            NormalizeFsEntriesFilterIfReq(
                dirArgs.BeforeCloneDestnCleanupFilter ??= filesGroup.DfBeforeCloneDestnCleanupFilter?.Clone(),
                filesGroup.DfBeforeCloneDestnCleanupFilter);
        }

        private void NormalizeArgsProfile(
            ProgramArgs args,
            Profile profile)
        {
            profile.ScriptGroups ??= new List<ScriptsGroup>();

            foreach (var scriptsGroup in profile.ScriptGroups)
            {
                scriptsGroup.WorkDir = NormalizePathIfNotNull(
                    args.LocalDevicePathsMap, scriptsGroup.WorkDir ?? args.WorkDir,
                    () => args.WorkDir);

                NormalizeScriptsListIfNotNull(
                    args, scriptsGroup, scriptsGroup.OnBeforeScripts);

                NormalizeScriptsListIfNotNull(
                    args, scriptsGroup, scriptsGroup.OnAfterScripts);
            }

            foreach (var filesGroup in profile.FileGroups)
            {
                NormalizeFilesGroup(
                    args.LocalDevicePathsMap,
                    filesGroup,
                    args.WorkDir);
            }
        }

        private void NormalizeScriptsListIfNotNull(
            ProgramArgs args,
            ScriptsGroup scriptsGroup,
            List<Script> scriptsList)
        {
            if (scriptsList != null)
            {
                foreach (var script in scriptsList)
                {
                    script.WorkDir = NormalizePathIfNotNull(
                        args.LocalDevicePathsMap, script.WorkDir ?? scriptsGroup.WorkDir,
                        () => scriptsGroup.WorkDir);

                    if (script.PowerShellCmd != null)
                    {
                        script.PowerShellCmd.WorkDir ??= script.WorkDir;
                        script.PowerShellCmd.CreateRunSpace ??= true;
                        script.PowerShellCmd.ExecutionPolicy ??= Microsoft.PowerShell.ExecutionPolicy.Bypass;
                    }
                    else
                    {
                        script.WinShellCmd.WorkingDirectory ??= script.WorkDir;
                        script.WinShellCmd.UseShellExecute ??= true;
                    }
                }
            }
        }

        private void NormalizeFilesGroup(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            FilesGroup filesGroup,
            string workDir)
        {
            NormalizeFileLocators(
                localDevicePathsMap,
                filesGroup.InputBaseDirLocator ??= FsEntryLocatorH.FromPath(string.Empty),
                filesGroup.CloneBaseDirLocator ??= FsEntryLocatorH.FromPath(string.Empty),
                filesGroup.InputBaseDirLocator,
                filesGroup.CloneBaseDirLocator,
                filesGroup.WorkDir = NormalizePathIfNotNull(
                    localDevicePathsMap, filesGroup.WorkDir ?? workDir,
                    () => workDir));

            if (filesGroup.Files != null)
            {
                foreach (var file in filesGroup.Files)
                {
                    NormalizeFileArgs(
                        localDevicePathsMap,
                        file, filesGroup);
                }
            }

            NormalizeFsEntriesFilterIfReq(
                filesGroup.DfInputDirFilter ??= DriveEntriesSerializableFilter.IncludeAll());

            NormalizeFsEntriesFilterIfReq(
                filesGroup.DfBeforeCloneDestnCleanupFilter?.Clone());

            if (filesGroup.Dirs != null)
            {
                foreach (var dir in filesGroup.Dirs)
                {
                    NormalizeDirArgs(
                        localDevicePathsMap,
                        filesGroup, dir, filesGroup.WorkDir);
                }
            }

            if (filesGroup.DestnToArchiveDirs != null)
            {
                foreach (var dir in filesGroup.DestnToArchiveDirs)
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
                null,
                cloneArgs.WorkDir);
        }

        private void NormalizeFileArgs(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            FileArgs fileArgs,
            FilesGroup? filesGroup,
            string workDir = null)
        {
            fileArgs.CloneTplLines ??= new List<string> { "{0}" };

            NormalizeFileLocators(
                localDevicePathsMap,
                fileArgs.InputFileLocator ??= FsEntryLocatorH.FromPath(string.Empty),
                fileArgs.CloneDirLocator ??= FsEntryLocatorH.FromPath(string.Empty),
                filesGroup?.InputBaseDirLocator,
                filesGroup?.CloneBaseDirLocator,
                filesGroup?.WorkDir ?? workDir);
        }

        private void NormalizeFileLocators(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            FsEntryLocator inputFileLocator,
            FsEntryLocator cloneDirLocator,
            FsEntryLocator? inputBaseDirLocator,
            FsEntryLocator? cloneBaseDirLocator,
            string workDir = null)
        {
            NormalizeFileLocator(
                localDevicePathsMap,
                inputFileLocator,
                inputBaseDirLocator?.EntryPath ?? workDir);

            NormalizeFileLocator(
                localDevicePathsMap,
                cloneDirLocator,
                cloneBaseDirLocator?.EntryPath ?? workDir,
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
                fileLocator.EntryBasePath,
                () => null);

            fileLocator.EntryRelPath = NormalizePathIfNotNull(
                localDevicePathsMap,
                fileLocator.EntryRelPath,
                () => null);

            fileLocator.EntryPath = NormalizePathIfNotNull(
                localDevicePathsMap,
                fileLocator.EntryPath,
                () => null);

            fileLocator.Normalize(
                workDir, false,
                defaultEmptyRelPathFactory);
        }

        private string NormalizePathIfNotNull(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            string path,
            Func<string?> basePathFactory)
        {
            if (path != null)
            {
                path = textMacrosReplacer.ReplaceMacros(
                    new TextMacrosReplacerOpts
                    {
                        InputText = path,
                        MacrosMap = localDevicePathsMap.GetPathsMap(),
                    });

                if (!Path.IsPathRooted(path))
                {
                    string? basePath = basePathFactory();

                    if (basePath != null)
                    {
                        path = Path.Combine(
                            basePath,
                            path);
                    }
                }
            }

            return path;
        }

        private void NormalizeFsEntriesFilterIfReq(
            DriveEntriesSerializableFilter filter,
            DriveEntriesSerializableFilter dfFilter = null)
        {
            if (filter != null)
            {
                filter.IncludedRelPathRegexes ??= new List<string> { ".*" };
                filter.ExcludedRelPathRegexes ??= new List<string>();

                if (dfFilter != null)
                {
                    if (dfFilter.IncludedRelPathRegexes != null)
                    {
                        filter.IncludedRelPathRegexes.InsertRange(
                            0, dfFilter.IncludedRelPathRegexes.Except([ ".*" ]));
                    }

                    if (dfFilter.ExcludedRelPathRegexes != null)
                    {
                        filter.ExcludedRelPathRegexes.InsertRange(
                            0, dfFilter.ExcludedRelPathRegexes);
                    }
                }
            }
        }
    }
}

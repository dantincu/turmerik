using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public interface IProgramArgsNormalizer
    {
        void NormalizeArgs(
            ProgramArgs args);

        void NormalizeDirArgs(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            ProgramConfig.FilesGroup filesGroup,
            ProgramConfig.Folder dirArgs);
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

            localDevicePathMacrosRetriever.Normalize(
                args.LocalDevicePathsMap);

            if (args.Profile != null)
            {
                NormalizeArgsProfile(args, args.Profile);
            }
            else
            {
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
            ProgramConfig.Folder dirArgs)
        {
            dirArgs.InputDirPath = NormalizePath(
                localDevicePathsMap,
                dirArgs.InputDirPath,
                filesGroup?.InputDirPath);

            dirArgs.CloneDirPath = NormalizePath(
                localDevicePathsMap,
                dirArgs.CloneDirPath,
                filesGroup?.CloneDirPath);

            NormalizeFsEntriesFilterIfReq(
                dirArgs.InputDirFilter ??= DriveEntriesSerializableFilter.IncludeAll(),
                filesGroup.DfInputDirFilter);

            NormalizeFsEntriesFilterIfReq(
                dirArgs.BeforeCloneDestnCleanupFilter ??= filesGroup.DfBeforeCloneDestnCleanupFilter?.Clone(),
                filesGroup.DfBeforeCloneDestnCleanupFilter);
        }

        private void NormalizeArgsProfile(
            ProgramArgs args,
            ProgramConfig.Profile profile)
        {
            profile.ScriptGroups ??= new List<ProgramConfig.ScriptsGroup>();

            foreach (var scriptsGroup in profile.ScriptGroups)
            {
                scriptsGroup.WorkDir = NormalizePath(
                    args.LocalDevicePathsMap, scriptsGroup.WorkDir,
                    Environment.CurrentDirectory);

                NormalizeScriptsListIfNotNull(
                    args, scriptsGroup, scriptsGroup.OnBeforeScripts);

                NormalizeScriptsListIfNotNull(
                    args, scriptsGroup, scriptsGroup.OnAfterScripts);
            }

            foreach (var filesGroup in profile.FileGroups)
            {
                NormalizeFilesGroup(
                    args.LocalDevicePathsMap,
                    filesGroup);
            }
        }

        private void NormalizeScriptsListIfNotNull(
            ProgramArgs args,
            ProgramConfig.ScriptsGroup scriptsGroup,
            List<ProgramConfig.Script> scriptsList)
        {
            if (scriptsList != null)
            {
                foreach (var script in scriptsList)
                {
                    script.WorkDir = NormalizePath(
                        args.LocalDevicePathsMap, script.WorkDir,
                        scriptsGroup.WorkDir);

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
            ProgramConfig.FilesGroup filesGroup)
        {
            filesGroup.InputDirPath = NormalizePath(
                localDevicePathsMap,
                filesGroup.InputDirPath,
                filesGroup?.InputDirPath);

            filesGroup.CloneDirPath = NormalizePath(
                localDevicePathsMap,
                filesGroup.CloneDirPath,
                filesGroup?.CloneDirPath);

            if (filesGroup.CloneArchiveDirPath != null)
            {
                filesGroup.CloneArchiveDirPath = NormalizePath(
                    localDevicePathsMap,
                    filesGroup.CloneArchiveDirPath,
                    Environment.CurrentDirectory);
            }

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

            if (filesGroup.Folders != null)
            {
                foreach (var dir in filesGroup.Folders)
                {
                    NormalizeDirArgs(
                        localDevicePathsMap,
                        filesGroup, dir);
                }
            }

            if (filesGroup.CloneArchiveDirPath != null)
            {
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
                null);
        }

        private void NormalizeFileArgs(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            ProgramConfig.File fileArgs,
            ProgramConfig.FilesGroup? filesGroup)
        {
            fileArgs.CloneTplLines ??= new List<string> { "{0}" };

            fileArgs.InputFilePath = NormalizePath(
                localDevicePathsMap,
                fileArgs.InputFilePath,
                filesGroup?.InputDirPath);

            fileArgs.CloneDirPath = NormalizePath(
                localDevicePathsMap,
                fileArgs.CloneDirPath,
                filesGroup?.CloneDirPath);
        }

        private string NormalizePath(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            string? path,
            string? baseDirPath)
        {
            /* if (!string.IsNullOrWhiteSpace(path))
            {
                path = textMacrosReplacer.ReplaceMacros(
                    new TextMacrosReplacerOpts
                    {
                        InputText = path,
                        MacrosMap = localDevicePathsMap.GetPathsMap(),
                    });

                if (!Path.IsPathRooted(path))
                {
                    path = Path.Combine(
                        baseDirPath?.Nullify() ?? Environment.CurrentDirectory,
                        path);
                }
            }
            else
            {
                path = baseDirPath?.Nullify() ?? Environment.CurrentDirectory;
            }*/

            path = textMacrosReplacer.NormalizePath(
                localDevicePathsMap,
                path, baseDirPath);

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
                            0, dfFilter.IncludedRelPathRegexes.Except([".*"]));
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

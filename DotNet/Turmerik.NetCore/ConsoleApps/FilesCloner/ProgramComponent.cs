using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public class ProgramComponent
    {
        private const string CFG_FILE_NAME = "trmrk-filescloner-config.json";

        private readonly IConsoleArgsParser parser;
        private readonly IJsonConversion jsonConversion;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ILocalDevicePathMacrosReplacer localDevicePathMacrosReplacer;
        private readonly FileCloneComponent fileCloneComponent;
        private readonly CloningProfileComponent cloningProfileComponent;

        public ProgramComponent(
            IConsoleArgsParser parser,
            IJsonConversion jsonConversion,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ILocalDevicePathMacrosReplacer localDevicePathMacrosReplacer,
            FileCloneComponent fileCloneComponent,
            CloningProfileComponent cloningProfileComponent)
        {
            this.parser = parser ?? throw new ArgumentNullException(nameof(parser));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.localDevicePathMacrosReplacer = localDevicePathMacrosReplacer ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosReplacer));

            this.fileCloneComponent = fileCloneComponent ?? throw new ArgumentNullException(
                nameof(fileCloneComponent));

            this.cloningProfileComponent = cloningProfileComponent ?? throw new ArgumentNullException(
                nameof(cloningProfileComponent));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);
            NormalizeArgs(args);

            await RunAsync(args);
        }

        private ProgramArgs GetArgs(
            string[] rawArgs)
        {
            var args = new ProgramArgs
            {
                LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile(),
                Config = jsonConversion.Adapter.Deserialize<ProgramConfig>(
                    File.ReadAllText(Path.Combine(
                        ProgramH.ExecutingAssemmblyPath,
                        CFG_FILE_NAME)))
            };

            FileCloneArgs singleFileArgs = null;
            FileArgs singleFile = null;

            Action<ConsoleArgsParserData<ProgramArgs>> assureSingleFileArgsAssigned = (data) =>
            {
                data.Args.SingleFileArgs = (singleFileArgs ??= new FileCloneArgs());
            };

            Action assureSingleFileAssigned = () =>
            {
                singleFileArgs!.File = (singleFile ??= new FileArgs());
            };

            args = parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsFactory = () => args,
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = [
                                parser.ArgsItemOpts(data, data =>
                                {
                                    assureSingleFileArgsAssigned(data);
                                    singleFileArgs!.InputText = data.ArgItem;
                                })
                            ],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data, ["w"],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);

                                        singleFileArgs!.WorkDir = data.ArgFlagValue!.Single().Nullify(true)?.With(
                                            path => NormPathH.NormPath(path,
                                                (path, isRooted) => isRooted.If(
                                                    () => path, () => Path.GetFullPath(path))))!;
                                    }),
                                parser.ArgsFlagOpts(data, ["i"],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.InputFileLocator = FsEntryLocatorH.FromPath(
                                            data.ArgFlagValue!.SingleOrDefault() ?? throw new ArgumentNullException(
                                                nameof(singleFile.InputFileLocator)));
                                    }),
                                parser.ArgsFlagOpts(data, ["o"],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.CloneDirLocator = FsEntryLocatorH.FromPath(
                                            data.ArgFlagValue!.SingleOrDefault() ?? string.Empty);
                                    }),
                                parser.ArgsFlagOpts(data, ["t"],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.CloneFileNameTpl = data.ArgFlagValue!.SingleOrDefault()!;
                                    }),
                                parser.ArgsFlagOpts(data, ["p"],
                                    data =>
                                    {
                                        data.Args.Profile = data.Args.Config.Profiles.Single(
                                            profile => profile.ProfileName == data.ArgFlagValue!.Single());
                                    })
                            ]
                        })
                }).Args;

            return args;
        }

        private void NormalizeArgs(
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

        private void NormalizeDirArgs(
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
                path = localDevicePathMacrosReplacer.ReplacePathMacros(
                    path, localDevicePathsMap);
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

        private async Task RunAsync(
            ProgramArgs args)
        {
            if (args.SingleFileArgs != null)
            {
                fileCloneComponent.Run(args.SingleFileArgs);
            }
            else
            {
                await cloningProfileComponent.RunAsync(args.Profile);
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.ConsoleApps;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.Notes;
using Turmerik.Notes.Settings;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.MkFsNoteDirsPair.ConsoleApp
{
    public class ProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly INoteDirsPairCreator dirsPairCreator;
        private readonly AppConfigCoreMtbl appConfig;
        private readonly NoteDirsPairConfigMtbl config;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            INoteDirsPairCreatorFactory dirsPairCreatorFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            string configFilePath = Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                TrmrkNotesH.NOTES_CFG_FILE_NAME);

            appConfig = jsonConversion.Adapter.Deserialize<AppConfigCoreMtbl>(
                File.ReadAllText(configFilePath));

            config = appConfig.NoteDirPairs;
            dirsPairCreator = dirsPairCreatorFactory.Creator(config);
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);
            args.WorkDir ??= Environment.CurrentDirectory;

            var opts = GetOpts(args);

            await dirsPairCreator.CreateDirsPairAsync(opts);
        }

        private NoteDirsPairOpts GetOpts(
            ProgramArgs args) => new NoteDirsPairOpts
            {
                PrIdnf = args.WorkDir,
                Title = args.NoteTitle,
                SortIdx = args.SortIdx,
                IsPinned = args.IsPinned,
                OpenMdFile = args.OpenMdFile,
                CreateNoteBookDirsPair = args.CreateNoteBookDirsPair,
                CreateNoteFilesDirsPair = args.CreateNoteFilesDirsPair,
                CreateNoteInternalDirsPair = args.CreateNoteInternalDirsPair
            };

        private ProgramArgs GetArgs(
            string[] rawArgs) => parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = parser.ArgsItemOpts(
                                data, data => data.Args.NoteTitle = data.ArgItem).Arr(),
                            FlagHandlersMap = new Dictionary<string, ConsoleArgsFlagOpts<ProgramArgs>>
                            {
                                {
                                    config.ArgOpts.WorkDir,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.WorkDir = data.ArgFlagValue!.Single())
                                },
                                {
                                    config.ArgOpts.SortIdx,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.SortIdx = int.Parse(data.ArgFlagValue!.Single()))
                                },
                                {
                                    config.ArgOpts.OpenMdFile,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.OpenMdFile = true, true)
                                },
                                {
                                    config.ArgOpts.CreateNoteBookDirsPair,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.CreateNoteBookDirsPair = true, true)
                                },
                                {
                                    config.ArgOpts.CreateNoteFilesDirsPair,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.CreateNoteFilesDirsPair = true, true)
                                },
                                {
                                    config.ArgOpts.CreateNoteInternalDirsPair,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.CreateNoteInternalDirsPair = true, true)
                                }
                            }
                        })
                }).Args;
    }
}

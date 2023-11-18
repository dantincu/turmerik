using System;
using System.Collections.Generic;
using System.IO;
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

namespace Turmerik.Notes.ConsoleApps
{
    public class ProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly INoteDirsPairCreator dirsPairCreator;
        private readonly IAppConfigCore appConfig;
        private readonly INoteDirsPairConfig config;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            INoteDirsPairCreatorFactory dirsPairCreatorFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            string configFilePath = Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                TrmrkNotesH.NOTES_CFG_FILE_NAME);

            appConfig = jsonConversion.Adapter.Deserialize<AppConfigCoreMtbl>(
                File.ReadAllText(configFilePath));

            config = appConfig.GetNoteDirPairs();
            dirsPairCreator = dirsPairCreatorFactory.Creator(config);
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);

            args.DestnDirIdnf ??= Environment.CurrentDirectory;
            args.SrcDirIdnf ??= args.DestnDirIdnf;

            var opts = GetOpts(args);
            await dirsPairCreator.CreateDirsPairAsync(opts);
        }

        private NoteDirsPairOpts GetOpts(
            ProgramArgs args) => new NoteDirsPairOpts
            {
                PrIdnf = args.DestnDirIdnf,
                Title = args.NoteTitle,
                SortIdx = args.SortIdx,
                IsPinned = args.IsPinned,
                OpenMdFile = args.OpenMdFile,
                CreateNoteFilesDirsPair = args.CreateNoteFilesDirsPair,
                CreateNoteInternalDirsPair = args.CreateNoteInternalDirsPair,
                Command = args.Command,
                SrcNote = args.SrcNote,
                SrcNoteIdx = args.SrcNoteIdx,
                DestnNote = args.DestnNote,
                DestnNoteIdx = args.DestnNoteIdx
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
                                data, data =>
                                {
                                    var args = data.Args;
                                    string argItem = data.ArgItem;

                                    switch (data.TotalCount)
                                    {
                                        case 1:

                                            var matchingKvp = config.GetArgOpts().GetCommandsMap().SingleOrDefault(
                                                kvp => kvp.Value.ShortArgValue == argItem || kvp.Value.FullArgValue == argItem);

                                            if (matchingKvp.Key > 0)
                                            {
                                                args.Command = matchingKvp.Key;
                                            }
                                            else
                                            {
                                                throw new ArgumentException(
                                                    $"Unknown command name {argItem}");
                                            }
                                            break;
                                        case 2:
                                            args.NoteTitle = argItem;
                                            break;
                                        default:
                                            throw new ArgumentException(
                                                "Too many arguments: expected no more than 1 non-flag argument after the command name");
                                    }
                                }).Arr(),
                            FlagHandlersMap = new Dictionary<string, ConsoleArgsFlagOpts<ProgramArgs>>
                            {
                                {
                                    config.GetArgOpts().SrcNote,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.SrcNote = data.ArgFlagValue)
                                },
                                {
                                    config.GetArgOpts().SrcDirIdnf,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.SrcDirIdnf = data.ArgFlagValue!.Single())
                                },
                                {
                                    config.GetArgOpts().SrcNoteIdx,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.SrcNoteIdx = data.ArgFlagValue)
                                },
                                {
                                    config.GetArgOpts().DestnNote,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.DestnNote = data.ArgFlagValue)
                                },
                                {
                                    config.GetArgOpts().DestnDirIdnf,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.DestnDirIdnf = data.ArgFlagValue!.Single())
                                },
                                {
                                    config.GetArgOpts().DestnNoteIdx,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.DestnNoteIdx = data.ArgFlagValue)
                                },
                                {
                                    config.GetArgOpts().SortIdx,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.SortIdx = int.Parse(data.ArgFlagValue!.Single()))
                                },
                                {
                                    config.GetArgOpts().OpenMdFile,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.OpenMdFile = true, true)
                                },
                                {
                                    config.GetArgOpts().CreateNoteFilesDirsPair,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.CreateNoteFilesDirsPair = true, true)
                                },
                                {
                                    config.GetArgOpts().CreateNoteInternalDirsPair,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.CreateNoteInternalDirsPair = true, true)
                                },
                            }
                        })
                }).Args;
    }
}

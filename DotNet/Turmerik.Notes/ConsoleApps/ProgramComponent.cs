using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.Notes;
using Turmerik.Notes.Service;

namespace Turmerik.Notes.ConsoleApps
{
    public class ProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly INotesExplorerService notesExplorerService;
        private readonly INotesAppConfig appConfig;
        private readonly INoteDirsPairConfig config;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            INotesExplorerServiceFactory notesExplorerServiceFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            string configFilePath = Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                TrmrkNotesH.NOTES_CFG_FILE_NAME);

            appConfig = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(configFilePath));

            config = appConfig.GetNoteDirPairs();
            notesExplorerService = notesExplorerServiceFactory.Create(appConfig);
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);

            args.DestnDirIdnf ??= Environment.CurrentDirectory;
            args.SrcDirIdnf ??= args.DestnDirIdnf;

            await notesExplorerService.ExecuteAsync(args);
        }

        private NotesExplorerServiceArgs GetArgs(
            string[] rawArgs) => config.GetArgOpts().With(argOpts => parser.Parse(
                new ConsoleArgsParserOpts<NotesExplorerServiceArgs>(rawArgs)
                {
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<NotesExplorerServiceArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = parser.ArgsItemOpts(data, data =>
                                {
                                    string argItem = data.ArgItem;
                                    var commands = config.GetArgOpts().GetCommandsMap();

                                    var matchingKvp = commands.SingleOrDefault(
                                        kvp => kvp.Value.Matches(argItem));

                                    if (matchingKvp.Key > 0)
                                    {
                                        data.Args.Command = matchingKvp.Key;
                                    }
                                    else
                                    {
                                        throw new ArgumentException(
                                            $"Unknown command name {argItem}");
                                    }
                                }).Arr(parser.ArgsItemOpts(data, data =>
                                {
                                    data.Args.NoteTitle = data.ArgItem;
                                })),
                            FlagHandlersArr = [
                                ArgsFlagOpts(data, argOpts.GetSrcNote(),
                                    data => data.Args.SrcNote = data.ArgFlagValue),
                                ArgsFlagOpts(data, argOpts.GetSrcNote(),
                                    data => data.Args.SrcNote = data.ArgFlagValue),
                                ArgsFlagOpts(data, argOpts.GetSrcDirIdnf(),
                                    data => data.Args.SrcDirIdnf = data.ArgFlagValue!.Single()),
                                ArgsFlagOpts(data, argOpts.GetSrcNoteIdx(),
                                    data => data.Args.SrcNoteIdx = data.ArgFlagValue),
                                ArgsFlagOpts(data, argOpts.GetDestnNote(),
                                    data => data.Args.DestnNote = data.ArgFlagValue),
                                ArgsFlagOpts(data, argOpts.GetDestnDirIdnf(),
                                    data => data.Args.DestnDirIdnf = data.ArgFlagValue!.Single()),
                                ArgsFlagOpts(data, argOpts.GetDestnNoteIdx(),
                                    data => data.Args.DestnNoteIdx = data.ArgFlagValue),
                                ArgsFlagOpts(data, argOpts.GetNotesOrder(),
                                    data => data.Args.NotesOrder = data.ArgFlagValue),
                                ArgsFlagOpts(data, argOpts.GetNoteIdxesOrder(),
                                    data => data.Args.NoteIdxesOrder = data.ArgFlagValue),
                                ArgsFlagOpts(data, argOpts.GetIsPinned(),
                                    data => data.Args.IsPinned = true, true),
                                ArgsFlagOpts(data, argOpts.GetSortIdx(),
                                    data => data.Args.SortIdx = int.Parse(data.ArgFlagValue!.Single())),
                                ArgsFlagOpts(data, argOpts.GetOpenMdFile(),
                                    data => data.Args.OpenMdFile = true, true),
                                ArgsFlagOpts(data, argOpts.GetCreateNoteFilesDirsPair(),
                                    data => data.Args.CreateNoteFilesDirsPair = true, true),
                                ArgsFlagOpts(data, argOpts.GetCreateNoteInternalDirsPair(),
                                    data => data.Args.CreateNoteInternalDirsPair = true, true)
                            ]
                        })
                })).Args;

        private ConsoleArgsFlagOpts<NotesExplorerServiceArgs> ArgsFlagOpts(
            ConsoleArgsParserData<NotesExplorerServiceArgs> data,
            NoteDirsPairConfig.IArgOptionT option,
            Action<ConsoleArgsParserData<NotesExplorerServiceArgs>> action,
            bool shouldNotHaveValue = false) => parser.ArgsFlagOpts(data,
                option.ToStrArr(),
                action,
                shouldNotHaveValue);
    }
}

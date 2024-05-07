using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.NetCore.Config;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
{
    public interface IProgramArgsRetriever
    {
        ProgramArgs GetArgs(
            string[] rawArgs);
    }

    public class ProgramArgsRetriever : IProgramArgsRetriever
    {
        private const string DIFF = "diff";
        private const string PULL = "pull";
        private const string PUSH = "push";

        private const string HELP_FLAG_NAME = "h";
        private const string WORK_DIR_OPT_NAME = "wd";
        private const string CONFIG_FILE_PATH_OPT_NAME = "cfg";
        private const string PROFILE_NAME_OPT_NAME = "pf";
        private const string FILE_SYNC_TYPE_OPT_NAME = "fst";
        private const string ROWS_TO_PRINT_OPT_NAME = "rtp";
        private const string PROPAGATE_PUSH_FLAG_NAME = "ppgp";
        private const string SKIP_DIFF_PRINT_FLAG_NAME = "skdffprnt";
        private const string INTERACTIVE_FLAG_NAME = "i";
        private const string TREAT_ALL_AS_DIFF_FLAG_NAME = "alldff";
        private const string QUICK_DIFF_FLAG_NAME = "qdff";

        private readonly IConsoleArgsParser parser;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;

        public ProgramArgsRetriever(
            IConsoleArgsParser parser,
            ITextMacrosReplacer textMacrosReplacer,
            IProgramConfigRetriever programConfigRetriever,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IConsoleMsgPrinter consoleMsgPrinter)
        {
            this.parser = parser ?? throw new ArgumentNullException(
                nameof(parser));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.programConfigRetriever = programConfigRetriever ?? throw new ArgumentNullException(
                nameof(programConfigRetriever));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));
        }

        public ProgramArgs GetArgs(
            string[] rawArgs)
        {
            var args = new ProgramArgs
            {
                LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile(),
                SrcFolderNamesMap = new Dictionary<string, List<string>>(),
                DestnLocationNamesList = new List<string>()
            };

            args = parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsFactory = () => args,
                    ArgsBuilder = data =>
                    {
                        if (data.ArgFlagName == null)
                        {
                            var argItemTuple = GetArgItemTuple(
                                data.ArgItem);

                            if (argItemTuple.Item1 == "*")
                            {
                                data.Args.DestnLocationNamesList.AddRange(
                                    argItemTuple.Item2);
                            }
                            else
                            {
                                data.Args.SrcFolderNamesMap.Add(
                                    argItemTuple.Item1,
                                    argItemTuple.Item2);
                            }
                        }
                        else
                        {
                            parser.HandleArgs(
                                new ConsoleArgsParseHandlerOpts<ProgramArgs>
                                {
                                    Data = data,
                                    ThrowOnTooManyArgs = false,
                                    ThrowOnUnknownFlag = true,
                                    ItemHandlersArr = [],
                                    FlagHandlersArr = [
                                        parser.ArgsFlagOpts(data, [HELP_FLAG_NAME],
                                            data => data.Args.PrintHelpMessage = true, true),
                                        parser.ArgsFlagOpts(data, [WORK_DIR_OPT_NAME],
                                            data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                                        parser.ArgsFlagOpts(data, [CONFIG_FILE_PATH_OPT_NAME],
                                            data => data.Args.ConfigFilePath = data.ArgFlagValue!.Single()),
                                        parser.ArgsFlagOpts(data, [PROFILE_NAME_OPT_NAME],
                                            data => data.Args.ProfileName = data.ArgFlagValue!.Single()),
                                        parser.ArgsFlagOpts(data, [FILE_SYNC_TYPE_OPT_NAME],
                                            data => data.Args.FileSyncType = ParseFileSyncType(data.ArgFlagValue!.Single())),
                                        parser.ArgsFlagOpts(data, [ROWS_TO_PRINT_OPT_NAME],
                                            data => data.Args.RowsToPrint = int.Parse(data.ArgFlagValue!.Single())),
                                        parser.ArgsFlagOpts(data, [PROPAGATE_PUSH_FLAG_NAME],
                                            data => data.Args.PropagatePush = true, true),
                                        parser.ArgsFlagOpts(data, [INTERACTIVE_FLAG_NAME],
                                            data => data.Args.Interactive = true, true),
                                        parser.ArgsFlagOpts(data, [SKIP_DIFF_PRINT_FLAG_NAME],
                                            data => data.Args.SkipDiffPrinting = true, true),
                                        parser.ArgsFlagOpts(data, [TREAT_ALL_AS_DIFF_FLAG_NAME],
                                            data => data.Args.TreatAllAsDiff = true, true),
                                        parser.ArgsFlagOpts(data, [QUICK_DIFF_FLAG_NAME],
                                            data => data.Args.QuickDiff = true, true)
                                    ]
                                });
                        }
                    }
                }).Args;

            if (args.PrintHelpMessage == true)
            {
                PrintHelpMessage(args);
            }
            else
            {
                args.WorkDir = textMacrosReplacer.NormalizePath(
                    args.LocalDevicePathsMap,
                    args.WorkDir,
                    null);

                if (args.ConfigFilePath != null)
                {
                    args.ConfigFilePath = textMacrosReplacer.NormalizePath(
                        args.LocalDevicePathsMap,
                        args.ConfigFilePath,
                        args.WorkDir);
                }

                args.Config ??= programConfigRetriever.LoadProgramConfig(
                    args.ConfigFilePath);

                args.Profile = args.Config.Profiles.Single(
                    profile => profile.ProfileName == args.ProfileName);
            }

            return args;
        }

        private void PrintHelpMessage(
            ProgramArgs args)
        {
            var x = consoleMsgPrinter.GetDefaultExpressionValues();

            var msgTpl = (
                string text,
                string prefix = null) => ConsoleStrMsgTuple.New(
                    prefix ?? $"{{{x.Cyan}}}", text, x.Splitter);

            var optsHead = (string optsStr, string sffxStr, bool? required = null) =>
            {
                var retStr = string.Concat(
                    required == true ? $"{{{x.DarkRed}}}*" : string.Empty,
                    $"{{{x.DarkCyan}}}{optsStr}",
                    required == false ? $"{{{x.Cyan}}}?" : string.Empty,
                    $"{{{x.DarkGray}}}{sffxStr}{{{x.Splitter}}}");

                return retStr;
            };

            var m = new
            {
                ThisTool = msgTpl("this tool"),
                WorkingDirectory = msgTpl("working directory"),
                ConfigFilePath = msgTpl("config file path"),
                ProfileName = msgTpl("profile name"),
                FileSyncType = msgTpl("file sync type"),
                ThisHelpMessage = msgTpl("this help message")
            };

            string[] linesArr = [
                $"{{{x.Blue}}}Welcome to the Turmerik SyncLocalFiles tool{{{x.NewLine}}}",

                string.Join(" ", $"{m.ThisTool.U} helps you sync local files between",
                    "different locations on the local workstation. It's most usefull for syncing",
                    "source code folders when you just don't want to import the package or project like",
                    $"you would usually do in order to reuse code or components from that package or project.{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of argument options {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),
            
                string.Join(" ", optsHead($":{WORK_DIR_OPT_NAME}:", "<dir_path>"),
                    $"Change the {m.WorkingDirectory.L} that",
                    $"the profile relative path will be normalized with{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{CONFIG_FILE_PATH_OPT_NAME}:", "<file_path>"),
                    $"Provide a {m.ConfigFilePath.L}{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{PROFILE_NAME_OPT_NAME}:", "<profile_name>", true),
                    $"Provide the {m.ProfileName.L}{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{FILE_SYNC_TYPE_OPT_NAME}:", $"({DIFF}|{PULL}|{PUSH})"),
                    $"Provide the {m.FileSyncType.L} (the default value being",
                    $"{{{x.DarkGray}}}{DIFF}{{{x.Splitter}}}){{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{INTERACTIVE_FLAG_NAME}", ""),
                    $"Enables the interactive mode{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{ROWS_TO_PRINT_OPT_NAME}", ""),
                    $"Specify the number of rows to print after the user has asked for the next chunk of",
                    $"diffs (only has effect in the interactive mode){{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{PROPAGATE_PUSH_FLAG_NAME}", ""),
                    $"Specifies that the changes pushed from a destination folder to one ore more source folders",
                    $"should in term make their way in all the other destination folders that",
                    $"depend on those source folders to be synced (only has effect when the",
                    $"specified file sync type is {{{x.DarkGray}}}{DIFF}{{{x.Splitter}}})",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{SKIP_DIFF_PRINT_FLAG_NAME}", ""),
                    $"Disables printing the diff rows to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{TREAT_ALL_AS_DIFF_FLAG_NAME}", ""),
                    $"Specifies that each entry that exists both in the reference and the target folders",
                    $"should be overwritten in the target folder, even if there is no actual difference between",
                    $"their text contents",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{SKIP_DIFF_PRINT_FLAG_NAME}", ""),
                    $"Disables printing the diff rows to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{QUICK_DIFF_FLAG_NAME}", ""),
                    $"Disables the full diffing (which is usually done by reading the text contents",
                    $"of both the reference and the target files and then compare those text strings",
                    $"in order to decide whether to mark the pair of files as a diff row or not) and instead",
                    $"it just compares the last written time stamp and the file size in bytes",
                    $"and if any of those are different between the reference and the target, then the",
                    $"pair is marked as a diff. Otherwise, if those are equal, the actual text contents",
                    $"are NOT read and the pair is NOT marked as a diff row",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{HELP_FLAG_NAME}", ""),
                    $"Prints this help message to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                $"{{{x.Blue}}}You can find the source code for this tool at the following url:",
                string.Concat(
                    $"{{{x.DarkGreen}}}",
                    "https://github.com/dantincu/turmerik/tree/main/DotNet/Turmerik.SyncLocalFiles.ConsoleApp",
                    $"{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}")];

            consoleMsgPrinter.Print(linesArr, null, x);
        }

        private FileSyncType ParseFileSyncType(
            string argFlagValue) => argFlagValue.ToLowerInvariant() switch
            {
                DIFF => FileSyncType.Diff,
                PULL => FileSyncType.Pull,
                PUSH => FileSyncType.Push,
                _ => throw new ArgumentException(nameof(argFlagValue))
            };

        private Tuple<string, List<string>> GetArgItemTuple(
            string argItem)
        {
            var argItems = argItem.Split(':');

            var retTuple = Tuple.Create(
                argItems.First(),
                argItems.Skip(1).ToList());

            return retTuple;
        }
    }
}

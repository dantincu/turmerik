using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.NetCore.Config;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public interface IProgramArgsRetriever
    {
        ProgramArgs GetArgs(
            string[] rawArgs);
    }

    public class ProgramArgsRetriever : IProgramArgsRetriever
    {
        private const string INPUT_FILE_PATH_OPT_NAME = "i";
        private const string CLONE_DIR_PATH_OPT_NAME = "o";
        private const string CLONE_FILE_NAME_TPL_OPT_NAME = "t";
        private const string CHECK_SUM_OPT_NAME = "cksm";
        private const string PROFILE_NAME_OPT_NAME = "pf";
        private const string HELP_FLAG_NAME = "h";

        private readonly IConsoleArgsParser parser;
        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;

        public ProgramArgsRetriever(
            IConsoleArgsParser parser,
            IProgramConfigRetriever programConfigRetriever,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IConsoleMsgPrinter consoleMsgPrinter)
        {
            this.parser = parser ?? throw new ArgumentNullException(
                nameof(parser));

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
                Config = programConfigRetriever.LoadProgramConfig()
            };

            FileCloneArgs singleFileArgs = null;
            ProgramConfig.File singleFile = null;

            Action<ConsoleArgsParserData<ProgramArgs>> assureSingleFileArgsAssigned = (data) =>
            {
                data.Args.SingleFileArgs = (singleFileArgs ??= new FileCloneArgs
                {
                    CloneInputFile = true
                });
            };

            Action assureSingleFileAssigned = () =>
            {
                singleFileArgs!.File = (singleFile ??= new ProgramConfig.File());
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
                                parser.ArgsFlagOpts(data, [HELP_FLAG_NAME],
                                    data => data.Args.PrintHelpMessage = true, true),
                                parser.ArgsFlagOpts(data, [INPUT_FILE_PATH_OPT_NAME],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.InputFilePath = data.ArgFlagValue!.SingleOrDefault()!;
                                    }),
                                parser.ArgsFlagOpts(data, [CLONE_DIR_PATH_OPT_NAME],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.CloneDirPath = data.ArgFlagValue!.SingleOrDefault()!;
                                    }),
                                parser.ArgsFlagOpts(data, [CLONE_FILE_NAME_TPL_OPT_NAME],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.CloneFileNameTpl = data.ArgFlagValue!.SingleOrDefault()!;
                                    }),
                                parser.ArgsFlagOpts(data, [CHECK_SUM_OPT_NAME],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.UseChecksum = true;
                                    }, true),
                                parser.ArgsFlagOpts(data, [PROFILE_NAME_OPT_NAME],
                                    data =>
                                    {
                                        data.Args.Profile = data.Args.Config.Profiles.Single(
                                            profile => profile.ProfileName == data.ArgFlagValue!.Single());
                                    })
                            ]
                        })
                }).Args;

            if (args.PrintHelpMessage == true)
            {
                PrintHelpMessage(args);
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
                ProfileName = msgTpl("profile name"),
            };

            string[] linesArr = [
                $"{{{x.Blue}}}Welcome to the Turmerik LocalFilesCloner tool{{{x.NewLine}}}",

                string.Join(" ", $"{m.ThisTool.U} helps you copy files between",
                    $"different locations on the local workstation. It's most usefull for",
                    $"deploying binaries (or build files for web front-end apps)",
                    $"from build directories to deployment directories{{{x.NewLine}}}."),

                string.Join(" ", $"Here is a list of argument options {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{INPUT_FILE_PATH_OPT_NAME}", ""),
                    $"Provide the input file path{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{CLONE_DIR_PATH_OPT_NAME}", ""),
                    $"Provide the clone directory path{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{CLONE_FILE_NAME_TPL_OPT_NAME}", ""),
                    $"Provide the clone file name template{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{CHECK_SUM_OPT_NAME}", ""),
                    $"Specifies that the output file name should be appended a string",
                    $"consisting of the input file's contents checksum before the extension",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{PROFILE_NAME_OPT_NAME}:", "<profile_name>", true),
                    $"Provide the {m.ProfileName.L}{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{HELP_FLAG_NAME}", ""),
                    $"Prints this help message to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                $"{{{x.Blue}}}You can find the source code for this tool at the following url:",
                string.Concat(
                    $"{{{x.DarkGreen}}}",
                    "https://github.com/dantincu/turmerik/tree/main/DotNet/Turmerik.MkScripts.ConsoleApp",
                    $"{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}")];

            consoleMsgPrinter.Print(linesArr, null, x);
        }
    }
}

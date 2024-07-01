using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.Core.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramArgsRetriever
    {
        ProgramArgs GetArgs(
            string[] rawArgs);
    }

    public class ProgramArgsRetriever : IProgramArgsRetriever
    {
        private const string HELP_FLAG_NAME = "h";
        private const string PROFILE_NAME_OPT_NAME = "pf";
        private const string SECTION_NAMES_OPT_NAME = "sc";
        private const string INCLUDE_ALL_TYPES = "alltypes";

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
                            ItemHandlersArr = [],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data, [HELP_FLAG_NAME],
                                    data => data.Args.PrintHelpMessage = true, true),
                                parser.ArgsFlagOpts(data, [PROFILE_NAME_OPT_NAME],
                                    data => data.Args.ProfileName = data.ArgFlagValue!.Single()),
                                parser.ArgsFlagOpts(data, [SECTION_NAMES_OPT_NAME],
                                    data => data.Args.SectionNames = data.ArgFlagValue!),
                                parser.ArgsFlagOpts(data, [INCLUDE_ALL_TYPES],
                                    data => data.Args.IncludeAllTypes = true, true),
                            ]
                        })
                }).Args;

            if (args.PrintHelpMessage == true)
            {
                PrintHelpMessage(args);
            }
            else
            {
                args.Profile = args.Config.Profiles.Single(
                    profile => profile.ProfileName == args.ProfileName);

                if (args.SectionNames != null)
                {
                    args.Sections = args.SectionNames.Select(
                        sectionName => args.Profile.Sections.Single(
                            profile => profile.SectionName == sectionName)).ToArray();
                }
                else
                {
                    args.Sections = args.Profile.Sections.ToArray();
                }
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
                SectionNames = msgTpl("section names"),
                ArgFilters = msgTpl("arg filters"),
                PathFilters = msgTpl("path filters"),
                ThisHelpMessage = msgTpl("this help message"),
                LocalDeviceFilePaths = msgTpl(LocalDevicePathMacrosMapH.CONFIG_FILE_NAME)
            };

            string[] linesArr = [
                $"{{{x.Blue}}}Welcome to the Turmerik MkFiles tool{{{x.NewLine}}}",

                string.Join(" ", $"{m.ThisTool.U} helps you create files by specifying",
                    $"the javascript file containing the code that will generate the required",
                    $"files by interacting with the .NET environment using back-and-forth",
                    $"callbacks from javascript to .NET and from .NET to javascript.{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of argument options {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

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

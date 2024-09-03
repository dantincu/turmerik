using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Notes.Core;
using Turmerik.Core.DriveExplorer;
using System.Collections.ObjectModel;

namespace Turmerik.DirsPair.ConsoleApps.LsFsDirPairs
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly IConsoleArgsParser parser;
        private readonly DirsPairConfig config;
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly INotesAppConfigLoader notesAppConfigLoader;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;

        private readonly NoteDirsPairConfig.IDirNamesT noteDirNamesCfg;
        private readonly NoteDirsPairConfig.IDirNameIdxesT noteDirNameIdxesCfg;
        private readonly NoteDirsPairConfig.IDirNamePfxesT noteDirNamePfxesCfg;
        private readonly NoteDirsPairConfig.IDirNameIdxesT noteSectionDirNameIdxesCfg;
        private readonly NoteDirsPairConfig.IDirNamePfxesT noteSectionDirNamePfxesCfg;
        private readonly string joinStr;
        private readonly bool? incIdx;
        private readonly ReadOnlyCollection<NoteDirCategory> noteDirCats;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleMsgPrinter consoleMsgPrinter,
            IConsoleArgsParser consoleArgsParser,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory,
            IDirsPairConfigLoader dirsPairConfigLoader,
            INotesAppConfigLoader notesAppConfigLoader)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));

            parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            this.notesAppConfigLoader = notesAppConfigLoader ?? throw new ArgumentNullException(
                nameof(notesAppConfigLoader));

            config = dirsPairConfigLoader.LoadConfig();
            notesConfig = notesAppConfigLoader.LoadConfig();

            existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                notesConfig.GetNoteDirPairs());

            noteDirNamesCfg = notesConfig.GetNoteDirPairs().GetDirNames();
            noteDirNameIdxesCfg = notesConfig.GetNoteDirPairs().GetNoteDirNameIdxes();
            noteDirNamePfxesCfg = noteDirNamesCfg.GetNoteItemsPfxes();
            noteSectionDirNameIdxesCfg = notesConfig.GetNoteDirPairs().GetNoteSectionDirNameIdxes();
            noteSectionDirNamePfxesCfg = noteDirNamesCfg.GetNoteSectionsPfxes();
            joinStr = noteDirNamePfxesCfg.JoinStr;
            incIdx = noteDirNameIdxesCfg.IncIdx ?? true;

            noteDirCats = NoteDirCategory.Item.Arr(
                NoteDirCategory.Section).RdnlC();
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);

            if (args.PrintHelpMessage == true)
            {
                PrintHelpMessage(args);
            }
            else
            {
                NormalizeArgs(args);

                args.NoteItemsTuple = await existingDirPairsRetriever.GetNoteDirPairsAsync(args.WorkDir);
                Run(args);
            }
        }

        private void PrintHelpMessage(
            ProgramArgs args)
        {
            var x = consoleMsgPrinter.GetDefaultExpressionValues();
            var argOpts = config.ArgOpts;

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
            };

            string[] linesArr = [
                $"{{{x.Blue}}}Welcome to the Turmerik LsFsDirPairs tool{{{x.NewLine}}}",

                string.Join(" ", $"{m.ThisTool.U} helps you list and highlight the",
                    $"note items and note sections folder pairs {{{x.NewLine}}}."),

                string.Join(" ", $"Here is a list of argument options {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.ShowLastCreatedFirst}", ""),
                    $"Indicates that the list of folder pair names should be printed",
                    $"in the opposite order from how they would normally be printed",
                    $"which is in the ascending order of their short name indexes if",
                    $"the indexes are set to be descending or the descending order of their short name indexes",
                    $"if the indexes are set to be ascending, which largelly means that the",
                    $"first create pairs are shown first by default",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.ShowOtherDirNames}", ""),
                    $"Indicates that all file system entries are to be shown besides",
                    $"the folder pair names. This means that if there are folder (or file) names",
                    $"in the working directory that are not part of a valid pair of folders",
                    $"so normally would not be printed by this command, this flag indicates",
                    $"that those additional folder (or file) names should also be printed besides the folder pair names",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.PrintHelpMessage}", ""),
                    $"Prints this help message to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of arguments {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                $"{{{x.DarkBlue}}}1. {{{x.Splitter}}}The {{{x.Blue}}}work dir{{{x.Splitter}}}",
                $"changes the working directory from where the pairs of folders are listed{{{x.NewLine}}}{{{x.NewLine}}}",

                $"{{{x.Blue}}}You can find the source code for this tool at the following url:",
                string.Concat(
                    $"{{{x.DarkGreen}}}",
                    "https://github.com/dantincu/turmerik/tree/main/DotNet/Turmerik.LsFsDirPairs.ConsoleApp",
                    $"{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}")];

            consoleMsgPrinter.Print(linesArr, null, x);
        }

        private void NormalizeArgs(
            ProgramArgs args)
        {
            args.WorkDir ??= Environment.CurrentDirectory;
        }

        private void Run(
            ProgramArgs args)
        {
            SortTuples(args);
            var noteItemsTuple = args.NoteItemsTuple;
            WriteHeadingLineToConsole("Note Dir Pairs: ");

            foreach (var dirsPair in noteItemsTuple.DirsPairTuples)
            {
                if (dirsPair.NoteDirCat == NoteDirCategory.Item && dirsPair.FullDirNamePart != null)
                {
                    WriteWithForegroundsToConsole([
                        Tuple.Create(ConsoleColor.Magenta, dirsPair.ShortDirName),
                        Tuple.Create(ConsoleColor.Blue, joinStr),
                        Tuple.Create(ConsoleColor.Cyan, dirsPair.FullDirNamePart)
                    ]);
                }
            }

            WriteHeadingLineToConsole("Note Section Dir Pairs: ");

            foreach (var dirsPair in noteItemsTuple.DirsPairTuples)
            {
                if (dirsPair.NoteDirCat == NoteDirCategory.Section && dirsPair.FullDirNamePart != null)
                {
                    WriteWithForegroundsToConsole([
                        Tuple.Create(ConsoleColor.Magenta, dirsPair.ShortDirName),
                        Tuple.Create(ConsoleColor.Blue, joinStr),
                        Tuple.Create(ConsoleColor.Cyan, dirsPair.FullDirNamePart)
                    ]);
                }
            }

            if (args.ShowOtherDirNames ?? false)
            {
                WriteHeadingLineToConsole("Others full dir names: ",
                    foregroundColor: ConsoleColor.Red);

                foreach (var dirsPair in noteItemsTuple.DirsPairTuples)
                {
                    if (!noteDirCats.Contains(dirsPair.NoteDirCat) || dirsPair.FullDirNamePart == null)
                    {
                        foreach (var kvp in dirsPair.DirNamesMap)
                        {
                            if (kvp.Value != null)
                            {
                                WriteWithForegroundsToConsole([
                                    Tuple.Create(ConsoleColor.Magenta, dirsPair.ShortDirName),
                                    Tuple.Create(ConsoleColor.Blue, joinStr),
                                    Tuple.Create(ConsoleColor.DarkCyan, kvp.Value)]);
                            }
                            else
                            {
                                WriteWithForegroundsToConsole([
                                    Tuple.Create(ConsoleColor.Magenta, dirsPair.ShortDirName)]);
                            }
                        }

                        Console.WriteLine();
                    }
                }

                WriteHeadingLineToConsole("Other dir names: ", true,
                    foregroundColor: ConsoleColor.Red);

                foreach (string dirName in noteItemsTuple.OtherDirNames)
                {
                    WriteWithForegroundsToConsole([
                        Tuple.Create(ConsoleColor.Blue, dirName)]);
                }
            }
        }

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
                            ItemHandlersArr = [
                                parser.ArgsItemOpts(data, data => data.Args.WorkDir = data.ArgItem.Nullify(
                                    true)?.With(path => NormPathH.NormPath(
                                        path, (path, isRooted) => isRooted.If(
                                            () => path, () => Path.GetFullPath(
                                                path))))!)
                            ],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.PrintHelpMessage.Arr(),
                                    data => data.Args.PrintHelpMessage = true, true),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.ShowLastCreatedFirst.Arr(),
                                    data => data.Args.ShowLastCreatedFirst = true, true),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.ShowOtherDirNames.Arr(),
                                    data => data.Args.ShowOtherDirNames = true, true)
                            ]
                        })
                }).Args;

        private void SortTuples(
            ProgramArgs args)
        {
            Comparison<DirsPairTuple> comparison;

            if (args.ShowLastCreatedFirst ?? false)
            {
                args.NoteItemsTuple.DirsPairTuples.Reverse();
            }
        }

        private void WriteWithForegroundsToConsole(
            Tuple<ConsoleColor, string>[] tuplesArr,
            bool omitTrailingNewLine = false)
        {
            foreach (var tuple in tuplesArr)
            {
                Console.ForegroundColor = tuple.Item1;
                Console.Write(tuple.Item2);
            }

            Console.ResetColor();

            if (!omitTrailingNewLine)
            {
                Console.WriteLine();
            }
        }

        private void WriteHeadingLineToConsole(
            string headingCaption,
            bool omitStartingNewLine = false,
            bool omitTrailingNewLine = false,
            ConsoleColor? foregroundColor = null)
        {
            if (!omitStartingNewLine)
            {
                Console.WriteLine();
            }

            ConsoleH.WithColors(
                () => Console.WriteLine(headingCaption),
                (foregroundColor ?? ConsoleColor.White).Tuple());

            if (!omitTrailingNewLine)
            {
                Console.WriteLine();
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.ConsoleApps;
using Turmerik.DriveExplorer.DirsPair.ConsoleApps.RfDirsPairNames;
using Turmerik.DriveExplorer.Notes;
using Turmerik.Helpers;
using Turmerik.Text;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer.DirsPair.ConsoleApps.LsFsDirPairs
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;

        private readonly NoteDirsPairConfig.IDirNamesT noteDirNamesCfg;
        private readonly NoteDirsPairConfig.IDirNameIdxesT noteDirNameIdxesCfg;
        private readonly NoteDirsPairConfig.IDirNamePfxesT noteDirNamePfxesCfg;
        private readonly string joinStr;
        private readonly bool? incIdx;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME)));

            notesConfig = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    TrmrkNotesH.NOTES_CFG_FILE_NAME)));

            existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                notesConfig.GetNoteDirPairs());

            noteDirNamesCfg = notesConfig.GetNoteDirPairs().GetDirNames();
            noteDirNameIdxesCfg = notesConfig.GetNoteDirPairs().GetNoteDirNameIdxes();
            noteDirNamePfxesCfg = noteDirNamesCfg.GetNoteItemsPfxes();
            joinStr = noteDirNamePfxesCfg.JoinStr;
            incIdx = noteDirNameIdxesCfg.IncIdx ?? true;
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);
            NormalizeArgs(args);

            args.NoteItemsTuple = await existingDirPairsRetriever.GetNoteDirPairsAsync(args.WorkDir);
            Run(args);
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
                if (dirsPair.FullDirNamePart != null)
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
                WriteHeadingLineToConsole("Multiple full dir names: ",
                    foregroundColor: ConsoleColor.Red);

                foreach (var dirsPair in noteItemsTuple.DirsPairTuples)
                {
                    if (dirsPair.FullDirNamePart == null)
                    {
                        WriteWithForegroundsToConsole([
                            Tuple.Create(ConsoleColor.Magenta, dirsPair.ShortDirName),
                            Tuple.Create(ConsoleColor.Blue, joinStr)],
                                true);

                        foreach (var kvp in dirsPair.DirNamesMap)
                        {
                            WriteWithForegroundsToConsole([
                                Tuple.Create(ConsoleColor.DarkCyan, kvp.Value)]);
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

            if ((args.ShowLastCreatedFirst ?? false) != incIdx)
            {
                comparison = (tuple1, tuple2) => tuple1.NoteDirIdx.CompareTo(
                    tuple2.NoteDirIdx);
            }
            else
            {
                comparison = (tuple1, tuple2) => tuple2.NoteDirIdx.CompareTo(
                    tuple1.NoteDirIdx);
            }

            args.NoteItemsTuple.DirsPairTuples.Sort(comparison);
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
                foregroundColor ?? ConsoleColor.White);
            
            if (!omitTrailingNewLine)
            {
                Console.WriteLine();
            }
        }
    }
}

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
using Turmerik.DirsPair;
using Turmerik.DirsPair.ConsoleApps.RfDirsPairNames;
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
        private readonly IConsoleArgsParser parser;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;
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

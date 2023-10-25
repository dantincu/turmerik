using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface IDirPairsRetriever
    {
        DirPairsRetrieverResult GetResult(
            string workDir,
            bool printResult = false);

        DirPairsRetrieverResult GetResult(
            string[] existingDirsArr,
            bool printResult = false);

        void PrintResult(
            DirPairsRetrieverResult result);

        void PrintAmbgDirNamesIfReq(DirPairsRetrieverResult wka);
        void PrintAmbgDirPairsIfReq(DirPairsRetrieverResult wka);
        void PrintInternalNoteDirPairs(DirPairsRetrieverResult wka);
        void PrintNoteDirPairs(DirPairsRetrieverResult wka);
    }

    public class DirPairsRetriever : IDirPairsRetriever
    {
        public static readonly string NL = Environment.NewLine;

        private readonly INoteDirPairsRetriever noteDirPairsRetriever;
        private readonly IConsolePrinter consolePrinter;
        private readonly NoteDirsPairSettingsMtbl trmrk;

        private readonly string noteItemDirNamePfx;
        private readonly string noteInternalDirNamePfx;
        private readonly string joinStr;

        public DirPairsRetriever(
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory,
            IConsolePrinter consolePrinter,
            NoteDirsPairSettingsMtbl noteDirsPairSettings)
        {
            trmrk = noteDirsPairSettings ?? throw new ArgumentNullException(nameof(
                noteDirsPairSettings));

            noteDirPairsRetriever = noteDirsPairGeneratorFactory.PairsRetriever(
                trmrk.DirNames);

            this.consolePrinter = consolePrinter ?? throw new ArgumentNullException(
                nameof(consolePrinter));

            noteItemDirNamePfx = trmrk.DirNames.NoteItemsPfx;
            noteInternalDirNamePfx = trmrk.DirNames.NoteInternalsPfx;
            joinStr = trmrk.DirNames.JoinStr;
        }

        public DirPairsRetrieverResult GetResult(
            string workDir,
            bool printResult = true)
        {
            var result = GetResultCore(workDir);

            if (printResult)
            {
                PrintResult(result);
            }

            return result;
        }

        public DirPairsRetrieverResult GetResult(
            string[] existingDirsArr,
            bool printResult = false)
        {
            var result = GetResultCore(existingDirsArr);

            if (printResult)
            {
                PrintResult(result);
            }

            return result;
        }

        public void PrintResult(DirPairsRetrieverResult result)
        {
            consolePrinter.PrintWithHeaderAndFooter(wr =>
                {
                    PrintAmbgDirNamesIfReq(result);
                    PrintAmbgDirPairsIfReq(result);

                    PrintInternalNoteDirPairs(result);
                    PrintNoteDirPairs(result);
                },
                "START DIR ENTRIES FOR PATH",
                "END DIR ENTRIES FOR PATH",
                result.WorkDirPath);

            Console.WriteLine();
            Console.WriteLine();
        }

        public void PrintAmbgDirNamesIfReq(DirPairsRetrieverResult wka)
        {
            if (wka.AmbgEntryNames.Any())
            {
                consolePrinter.PrintDataWithColors(
                    wka.AmbgEntryNames,
                    text => text,
                    "Ambigous entry names: ",
                    ConsoleColor.DarkYellow,
                    ConsoleColor.Yellow);
            }
        }

        public void PrintAmbgDirPairsIfReq(DirPairsRetrieverResult wka)
        {
            if (wka.AmbgDirPairs.Any())
            {
                consolePrinter.PrintDataWithColors(
                    wka.AmbgDirPairs.Select(
                        kvp => kvp.Value.Select(
                            value => new KeyValuePair<string, NoteDirName>(
                                kvp.Key, value))).SelectMany(kvp => kvp),
                    kvp =>
                    {
                        var note = kvp.Value;

                        string shortDirName = note.ShortDirName ?? note.Prefix + kvp.Key;
                        string fullDirNamePart = note.FullDirNamePart;
                        string joinStr = note.JoinStr;

                        if (fullDirNamePart == null && !string.IsNullOrEmpty(note.FullDirName))
                        {
                            fullDirNamePart = note.FullDirName.Substring(
                                (shortDirName + note.JoinStr).Length);

                            joinStr = fullDirNamePart.First().ToString();
                            fullDirNamePart = fullDirNamePart.Substring(1);
                        }

                        return Tuple.Create(
                            shortDirName,
                            joinStr,
                            fullDirNamePart!);
                    },
                    "Ambigous dir pair names: ",
                    ConsoleColor.Red,
                    ConsoleColor.DarkRed);
            }
        }

        public void PrintInternalNoteDirPairs(DirPairsRetrieverResult wka)
        {
            consolePrinter.PrintDataWithColors(
                wka.InternalDirPairs,
                kvp => Tuple.Create(
                    kvp.Key,
                    joinStr,
                    kvp.Value.Select(
                        item => item.FullDirNamePart).NotNull(
                            ).Single()),
                "Note Internal Dir pairs:",
                ConsoleColor.Cyan,
                ConsoleColor.DarkCyan);
        }

        public void PrintNoteDirPairs(DirPairsRetrieverResult wka)
        {
            consolePrinter.PrintDataWithColors(
                wka.Notes,
                kvp => Tuple.Create(
                    noteItemDirNamePfx + kvp.Key,
                    joinStr,
                    kvp.Value.Title),
                "Note Dir pairs:",
                ConsoleColor.Green,
                ConsoleColor.DarkGreen);
        }

        private DirPairsRetrieverResult GetResultCore(
            string workDirPath)
        {
            workDirPath ??= Environment.CurrentDirectory;

            var existingDirsArr = Directory.GetDirectories(
                workDirPath).Select(dir => Path.GetFileName(dir)).ToArray();

            var wka = GetResultCore(
                existingDirsArr);

            wka.WorkDirPath = workDirPath;
            return wka;
        }

        private DirPairsRetrieverResult GetResultCore(
            string[] existingDirsArr) => new DirPairsRetrieverResult
            {
                ExistingDirsArr = existingDirsArr,
                Notes = noteDirPairsRetriever.GetNotes(
                    existingDirsArr,
                    out var noteDirsMap,
                    out var internalDirsMap,
                    out var ambgMap,
                    out var ambgEntryNames),
                NoteDirPairs = noteDirsMap,
                InternalDirPairs = internalDirsMap,
                AmbgDirPairs = ambgMap,
                AmbgEntryNames = ambgEntryNames
            };
    }
}

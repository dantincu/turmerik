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
            bool printResult = true);

        void PrintResult(
            DirPairsRetrieverResult result);
    }

    public class DirPairsRetriever : IDirPairsRetriever
    {
        public static readonly string NL = Environment.NewLine;

        private readonly INoteDirPairsRetriever noteDirPairsRetriever;
        private readonly NoteDirsPairSettings trmrk;

        private readonly string noteItemDirNamePfx;
        private readonly string noteInternalDirNamePfx;
        private readonly string joinStr;

        public DirPairsRetriever(
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory,
            NoteDirsPairSettings noteDirsPairSettings)
        {
            trmrk = noteDirsPairSettings ?? throw new ArgumentNullException(nameof(
                noteDirsPairSettings));

            noteDirPairsRetriever = noteDirsPairGeneratorFactory.PairsRetriever(
                trmrk.DirNames);

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

        public void PrintResult(DirPairsRetrieverResult result)
        {
            Console.Out.WithColors(
                wr => wr.Write($"{NL} <<<< <<<< <<<< <<<< {NL}START DIR ENTRIES FOR PATH <<<< {result.WorkDir}{NL} <<<< <<<< <<<< <<<< {NL}"),
                ConsoleColor.Black,
                ConsoleColor.White);

            PrintAmbgDirNamesIfReq(result);
            PrintAmbgDirPairsIfReq(result);

            PrintInternalNoteDirPairs(result);
            PrintNoteDirPairs(result);

            Console.Out.WithColors(
                wr => wr.Write($"{NL} >>>> >>>> >>>> >>>> {NL}END DIR ENTRIES FOR PATH >>>> {result.WorkDir}{NL} >>>> >>>> >>>> >>>> "),
                ConsoleColor.Black,
                ConsoleColor.White);

            Console.WriteLine();
            Console.WriteLine();
        }

        private DirPairsRetrieverResult GetResultCore(
            string workDir)
        {
            workDir ??= Environment.CurrentDirectory;

            var dirsArr = Directory.GetDirectories(workDir).Select(
                dir => Path.GetFileName(dir)).ToArray();

            var wka = new DirPairsRetrieverResult
            {
                WorkDir = workDir,
                ExistingDirsArr = dirsArr,
                Notes = noteDirPairsRetriever.GetNotes(
                    dirsArr,
                    out var noteDirsMap,
                    out var internalDirsMap,
                    out var ambgMap,
                    out var ambgEntryNames),
                NoteDirPairs = noteDirsMap,
                InternalDirPairs = internalDirsMap,
                AmbgDirPairs = ambgMap,
                AmbgEntryNames = ambgEntryNames
            };

            return wka;
        }

        private void PrintAmbgDirNamesIfReq(DirPairsRetrieverResult wka)
        {
            if (wka.AmbgEntryNames.Any())
            {
                Console.WriteLine();

                Console.Out.WithColors(
                    wr => wr.Write($"Ambigous entry names:"),
                    ConsoleColor.Black,
                    ConsoleColor.DarkYellow);

                Console.WriteLine();
                Console.WriteLine();

                Console.Out.WithColors(wr =>
                {
                    foreach (var name in wka.AmbgEntryNames)
                    {
                        wr.WriteLine(name);
                    }
                },
                    ConsoleColor.Yellow);
            }
        }

        private void PrintAmbgDirPairsIfReq(DirPairsRetrieverResult wka)
        {
            if (wka.AmbgDirPairs.Any())
            {
                Console.WriteLine();

                Console.Out.WithColors(
                    wr => wr.Write($"Ambigous dir pairs:"),
                    ConsoleColor.Black,
                    ConsoleColor.Red);

                Console.WriteLine();
                Console.WriteLine();

                foreach (var kvp in wka.AmbgDirPairs)
                {
                    var notesList = kvp.Value;

                    foreach (var note in notesList)
                    {
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

                        PrintDataWithColors(
                            shortDirName,
                            joinStr,
                            fullDirNamePart,
                            ConsoleColor.Red,
                            ConsoleColor.DarkRed,
                            ConsoleColor.DarkRed);
                    }
                }
            }
        }

        private void PrintInternalNoteDirPairs(DirPairsRetrieverResult wka)
        {
            Console.WriteLine();

            Console.Out.WithColors(
                wr => wr.Write("Note Internal Dir pairs:"),
                ConsoleColor.Black,
                ConsoleColor.Cyan);

            Console.WriteLine();
            Console.WriteLine();

            foreach (var kvp in wka.InternalDirPairs)
            {
                var dirName = kvp.Value;

                PrintDataWithColors(
                    kvp.Key,
                    joinStr,
                    dirName.Select(item => item.FullDirNamePart).NotNull().Single(),
                    ConsoleColor.Cyan,
                    ConsoleColor.DarkCyan,
                    ConsoleColor.DarkCyan);
            }
        }

        private void PrintNoteDirPairs(DirPairsRetrieverResult wka)
        {
            Console.WriteLine();

            Console.Out.WithColors(
                wr => wr.Write("Note Dir pairs:"),
                ConsoleColor.Black,
                ConsoleColor.Green);

            Console.WriteLine();
            Console.WriteLine();

            foreach (var kvp in wka.Notes)
            {
                var note = kvp.Value;

                PrintDataWithColors(
                    noteItemDirNamePfx + kvp.Key,
                    joinStr,
                    note.Title,
                    ConsoleColor.Green,
                    ConsoleColor.DarkGreen,
                    ConsoleColor.DarkGreen);
            }
        }

        private void PrintDataWithColors(
            string title,
            string joinStr,
            string content,
            ConsoleColor titleColor,
            ConsoleColor joinStrBackColor,
            ConsoleColor contentColor)
        {
            Console.Out.WithColors(
                wr => wr.Write(
                    title),
                titleColor);

            Console.Out.WithColors(
                wr => wr.Write(
                    joinStr),
                ConsoleColor.Black,
                joinStrBackColor);

            Console.Out.WithColors(
                wr => wr.WriteLine(
                    content),
                contentColor);
        }
    }
}

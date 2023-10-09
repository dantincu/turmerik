using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Text;

namespace Turmerik.LsDirPairs.ConsoleApp
{
    public class ProgramComponent
    {
        private static readonly string NL = Environment.NewLine;
        // private static readonly string NL = "\n";

        private readonly IJsonConversion jsonConversion;
        private readonly INoteDirPairsRetriever noteDirPairsRetriever;

        private readonly AppSettings appSettings;
        private readonly NoteDirsPairSettings trmrk;

        private readonly string noteItemsPfx;
        private readonly string joinStr;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            appSettings = jsonConversion.LoadConfig<AppSettings>();
            trmrk = appSettings.TrmrkDirPairs;

            this.noteDirPairsRetriever = noteDirsPairGeneratorFactory.PairsRetriever(
                trmrk.DirNames);

            noteItemsPfx = trmrk.DirNames.NoteItemsPfx;
            joinStr = trmrk.DirNames.JoinStr;
        }

        public void Run(string[] args)
        {
            var wka = GetWorkArgs(args);
            PrintAmbgDirNamesIfReq(wka);
            PrintDirPairs(wka);
            PrintAmbgDirPairsIfReq(wka);
        }

        private WorkArgs GetWorkArgs(
            string[] args)
        {
            var workDir = args.FirstOrDefault() ?? Environment.CurrentDirectory;

            var dirsArr = Directory.GetDirectories(workDir).Select(
                dir => Path.GetFileName(dir)).ToArray();

            var wka = new WorkArgs
            {
                WorkDir = workDir,
                ExistingDirsArr = dirsArr,
                Notes = noteDirPairsRetriever.GetNotes(
                    dirsArr, out var notesMap,
                    out var ambgMap, out var ambgEntryNames),
                NoteDirPairs = notesMap,
                AmbgDirPairs = ambgMap,
                AmbgEntryNames = ambgEntryNames
            };

            return wka;
        }

        private void PrintAmbgDirNamesIfReq(WorkArgs wka)
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

        private void PrintDirPairs(WorkArgs wka)
        {
            Console.WriteLine();

            Console.Out.WithColors(
                wr => wr.Write($"Dir pairs:"),
                ConsoleColor.Black,
                ConsoleColor.Cyan);

            Console.WriteLine();
            Console.WriteLine();

            foreach (var kvp in wka.Notes)
            {
                var note = kvp.Value;

                PrintDataWithColors(
                    noteItemsPfx + kvp.Key,
                    joinStr,
                    note.Title,
                    ConsoleColor.Cyan,
                    ConsoleColor.DarkCyan,
                    ConsoleColor.DarkCyan);
            }
        }

        private void PrintAmbgDirPairsIfReq(WorkArgs wka)
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
                        string shortDirName = noteItemsPfx + kvp.Key;
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

        private class WorkArgs
        {
            public string WorkDir { get; set; }
            public string[] ExistingDirsArr { get; set; }
            public Dictionary<int, NoteItemCore> Notes { get; set; }
            public Dictionary<int, List<NoteDirName>> NoteDirPairs { get; set; }
            public Dictionary<string, List<NoteDirName>> AmbgDirPairs { get; set; }
            public List<string> AmbgEntryNames { get; set; }
        }
    }
}

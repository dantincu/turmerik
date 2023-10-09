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
                DirPairs = noteDirPairsRetriever.GetNotes(
                    dirsArr, out var amgMap),
                AmbgDirPairs = amgMap
            };

            return wka;
        }

        private void PrintDirPairs(WorkArgs wka)
        {
            Console.Out.WithColors(
                wr => wr.WriteLine($"{NL}Dir pairs: {NL}"),
                ConsoleColor.Black,
                ConsoleColor.Cyan);

            foreach (var kvp in wka.DirPairs)
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
                Console.Out.WithColors(
                    wr => wr.WriteLine($"{NL}Ambigous dir pairs: {NL}"),
                    ConsoleColor.Black,
                    ConsoleColor.Red);

                foreach (var kvp in wka.AmbgDirPairs)
                {
                    var notesList = kvp.Value;

                    foreach (var note in notesList)
                    {
                        PrintDataWithColors(
                            noteItemsPfx + kvp.Key,
                            note.JoinStr,
                            note.FullDirNamePart,
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
            public Dictionary<int, NoteItemCore> DirPairs { get; set; }
            public Dictionary<int, List<NoteDirName>> AmbgDirPairs { get; set; }
        }
    }
}

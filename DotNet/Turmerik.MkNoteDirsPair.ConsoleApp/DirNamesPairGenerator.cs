using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Text;
using Turmerik.Utility;

namespace Turmerik.MkNoteDirsPair.ConsoleApp
{
    public class DirNamesPairGenerator : DirsPairInfoGeneratorBase, IDirsPairInfoGenerator
    {
        private readonly INoteDirsPairGenerator noteDirsPairGenerator;

        private readonly AppSettings appSettings;
        private readonly NoteDirsPairSettings trmrk;
        private readonly NoteDirsPairSettings.FileNamesT fileNames;

        private readonly string noteJsonFileName;
        private readonly string noteBookJsonFileName;

        public DirNamesPairGenerator(
            IJsonConversion jsonConversion,
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory,
            INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever) : base(
                noteDirsPairFullNamePartRetriever)
        {
            appSettings = jsonConversion.LoadConfig<AppSettings>();

            trmrk = appSettings.Trmrk;
            fileNames = trmrk.FileNames;

            this.noteDirsPairGenerator = noteDirsPairGeneratorFactory.Generator(trmrk);

            noteJsonFileName = string.Join(
                ".", fileNames.NoteFileName, "json");

            noteBookJsonFileName = string.Join(
                ".", fileNames.NoteBookFileName, "json");
        }

        public DirsPairInfo Generate(string[] args)
        {
            var wka = GetWorkArgs(args);

            var dirsPairInfo = GetDirsPairInfo(
                wka, out string shortDirName);

            PrintDataWithColors(
                "Short dir name: ",
                shortDirName);

            return dirsPairInfo;
        }

        private DirsPairInfo GetDirsPairInfo(
            WorkArgs wka, out string shortDirName)
        {
            DirsPairInfo info;

            if (wka.ProgArgs.CreateNote)
            {
                info = GetNoteDirsPairInfo(
                    wka, out shortDirName);
            }
            else
            {
                info = GetInternalDirsPairInfoCore(
                    wka, out shortDirName);
            }

            return info;
        }

        private DirsPairInfo GetNoteDirsPairInfo(
            WorkArgs wka, out string shortDirName)
        {
            var dirsList = noteDirsPairGenerator.Generate(
                new NoteDirsPairOpts
                {
                    Title = wka.ProgArgs.NoteName,
                    AltSpaceChar = ':',
                    DirCategory = wka.DirCat,
                    ExistingEntriesArr = wka.ExistingEntriesArr,
                    NoteBookJson = wka.NoteBookJson,
                    NoteItemJson = wka.NoteItemJson,
                    NoteInternalDirs = GetInternalDirNamesList(
                        wka.ProgArgs)
                },
                out shortDirName,
                out string docFileName);

            string docFilePath = Path.Combine(
                wka.WorkDir,
                shortDirName,
                docFileName);

            var retInfo = new DirsPairInfo(
                wka.WorkDir,
                wka.ExistingEntriesArr,
                dirsList,
                wka.ProgArgs.DoNotOpenCreatedDocFile ? null : docFilePath);

            return retInfo;
        }

        private DirsPairInfo GetInternalDirsPairInfoCore(
            WorkArgs wka, out string shortDirName) => new DirsPairInfo(
                wka.WorkDir,
                wka.ExistingEntriesArr,
                noteDirsPairGenerator.Generate(
                    new NoteDirsPairOpts
                    {
                        AltSpaceChar = ':',
                        DirCategory = wka.DirCat,
                        ExistingEntriesArr = wka.ExistingEntriesArr,
                        NoteBookJson = wka.NoteBookJson,
                        NoteItemJson = wka.NoteItemJson,
                        NoteInternalDirs = GetInternalDirNamesList(
                            wka.ProgArgs),
                        CreateNoteBook = wka.ProgArgs.CreateNoteBook
                    }, out shortDirName, out _),
                null);

        private NoteInternalDir[] GetInternalDirNamesList(
            ProgramArgs pga)
        {
            List<NoteInternalDir> fullDirNamesList = new();

            if (pga.CreateNoteFiles)
            {
                fullDirNamesList.Add(
                    NoteInternalDir.NoteFiles);
            }

            if (pga.CreateNoteInternals)
            {
                fullDirNamesList.Add(
                    NoteInternalDir.NoteInternals);
            }

            return fullDirNamesList.ToArray();
        }

        private WorkArgs GetWorkArgs(
            string[] args)
        {
            var pga = new ProgramArgsRetriever(
                ).Retrieve(args, appSettings);

            string workDir = Environment.CurrentDirectory;

            var wka = new WorkArgs
            {
                ProgArgs = pga,
                WorkDir = workDir,
                ExistingEntriesArr = Directory.EnumerateFileSystemEntries(
                    workDir).Select(entry => Path.GetFileName(entry)).ToArray(),
                DirCat = pga.CreateNote switch
                {
                    false => NoteDirCategory.TrmrkInternals,
                    true => NoteDirCategory.TrmrkNote
                },
            };

            LoadJsonIfReq(wka);
            return wka;
        }

        private void LoadJsonIfReq(WorkArgs wka)
        {
            if (trmrk.SerializeToJson == true)
            {
                if (TryLoadJson(
                    wka, noteJsonFileName, out string noteItemJson))
                {
                    wka.NoteItemJson = noteItemJson;
                }
                else if (TryLoadJson(
                    wka, noteBookJsonFileName, out string noteBookJson))
                {
                    wka.NoteBookJson = noteBookJson;
                }
            }
        }

        private bool TryLoadJson(
            WorkArgs wka,
            string fileName,
            out string json)
        {
            bool shouldLoad = wka.ExistingEntriesArr.Contains(fileName);

            if (shouldLoad)
            {
                string filePath = Path.Combine(
                    wka.WorkDir, fileName);

                json = File.ReadAllText(filePath);
            }
            else
            {
                json = null;
            }

            return shouldLoad;
        }

        private void PrintDataWithColors(
            string title,
            string content)
        {
            Console.Out.WithColors(
                wr => wr.Write(
                    title),
                ConsoleColor.DarkGreen);

            Console.Out.WithColors(
                wr => wr.WriteLine(
                    content),
                ConsoleColor.Cyan);
        }

        private class WorkArgs
        {
            public ProgramArgs ProgArgs { get; set; }
            public string WorkDir { get; set; }
            public string[] ExistingEntriesArr { get; set; }
            public NoteDirCategory DirCat { get; set; }
            public string NoteItemJson { get; set; }
            public string NoteBookJson { get; set; }
        }
    }
}

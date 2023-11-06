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
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Notes;
using Turmerik.Text;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.MkNoteDirsPair.ConsoleApp
{
    public class DirNamesPairGenerator : DirsPairInfoGeneratorBase, IDirsPairInfoGenerator
    {
        private readonly INoteDirNamesPairGenerator noteDirNamesPairGenerator;

        private readonly AppSettings appSettings;
        private readonly NoteDirsPairConfigMtbl trmrk;
        private readonly NoteDirsPairConfigMtbl.FileNamesT fileNames;

        private readonly string noteJsonFileName;
        private readonly string noteBookJsonFileName;

        public DirNamesPairGenerator(
            IJsonConversion jsonConversion,
            INoteDirNamesPairGeneratorFactory noteDirNamesPairGeneratorFactory,
            INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever) : base(
                noteDirsPairFullNamePartRetriever)
        {
            appSettings = jsonConversion.LoadConfig<AppSettings>();

            trmrk = appSettings.NoteDirPairs;
            fileNames = trmrk.FileNames;

            this.noteDirNamesPairGenerator = noteDirNamesPairGeneratorFactory.Create(trmrk);

            noteJsonFileName = noteDirNamesPairGenerator.NoteJsonFileName;
            noteBookJsonFileName = noteDirNamesPairGenerator.NoteBookJsonFileName;
        }

        public DirsPairInfo Generate(string[] args)
        {
            var wka = GetWorkArgs(args);

            var dirsPairInfo = noteDirNamesPairGenerator.GetDirsPairInfo(
                wka, out var pair);

            PrintDataWithColors(
                "Short dir name: ",
                pair.ShortDirName);

            return dirsPairInfo;
        }

        private MkNoteDirsPairWorkArgs GetWorkArgs(
            string[] args)
        {
            var pga = new ProgramArgsRetriever(
                ).Retrieve(args, appSettings);

            string workDir = Environment.CurrentDirectory;

            if (pga.WorkDir != null)
            {
                workDir = PathH.AssurePathRooted(pga.WorkDir, workDir);
            }

            var wka = new MkNoteDirsPairWorkArgs
            {
                ProgArgs = pga,
                WorkDir = workDir,
                ExistingEntriesArr = Directory.GetFileSystemEntries(
                    workDir).Select(entry => Path.GetFileName(entry)).ToArray(),
                DirCat = pga.CreateNote switch
                {
                    false => DirCategory.Internals,
                    true => DirCategory.Item
                },
            };

            LoadJsonIfReq(wka);
            return wka;
        }

        private void LoadJsonIfReq(MkNoteDirsPairWorkArgs wka)
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
            MkNoteDirsPairWorkArgs wka,
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
            ConsoleH.WithColors(
                () => Console.Write(
                    title),
                ConsoleColor.DarkGreen);

            ConsoleH.WithColors(
                () => Console.WriteLine(
                    content),
                ConsoleColor.Cyan);
        }
    }
}

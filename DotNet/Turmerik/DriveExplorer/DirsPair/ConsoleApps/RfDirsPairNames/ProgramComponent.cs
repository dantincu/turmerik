using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik;
using Turmerik.Helpers;
using Turmerik.Text;
using Turmerik.TextParsing.Md;

namespace Turmerik.DriveExplorer.DirsPair.ConsoleApps.RfDirsPairNames
{
    public class ProgramComponent
    {
        public void Run(string[] args)
        {
            var wka = GetWorkArgs(args);
            Run(wka);
        }

        private void Run(WorkArgs wka)
        {

        }

        private WorkArgs GetWorkArgs(string[] args)
        {
            var wka = new WorkArgs
            {
                ShortNameDirPath = args.FirstOrDefault()?.With(
                path => NormPathH.NormPath(
                    path, (path, isRooted) => isRooted.If(
                        () => path, () => Path.GetFullPath(
                            path.Nullify() ?? Environment.CurrentDirectory)))) ?? Environment.CurrentDirectory,
                MdFileName = args.Skip(1).FirstOrDefault()
            };

            NormalizeArgs(wka);
            return wka;
        }

        private void NormalizeArgs(WorkArgs wka)
        {
            if (Directory.Exists(wka.ShortNameDirPath))
            {
                if (wka.MdFileName != null)
                {
                    wka.MdFilePath = Path.Combine(
                        wka.ShortNameDirPath,
                        wka.MdFileName);
                }
            }
            else if (File.Exists(wka.ShortNameDirPath))
            {
                wka.MdFilePath = wka.ShortNameDirPath;

                wka.MdFileName = Path.GetFileName(
                    wka.MdFilePath);

                wka.ShortNameDirPath = Path.GetDirectoryName(
                    wka.MdFilePath);
            }
        }

        private string GetMdFile(
            string shortDirNamePath,
            out string mdTitle,
            bool autoChooseIfSingle)
        {
            string mdFileName = null;
            mdTitle = null;

            var tuplesArr = GetMdFiles(
                shortDirNamePath);

            if (tuplesArr.Any())
            {
                if (autoChooseIfSingle && tuplesArr.Length == 1)
                {
                    (mdFileName, mdTitle) = tuplesArr.Single();
                }

                Console.WriteLine("These are the .md files to set the title from");

                for (int i = 0; i < tuplesArr.Length; i++)
                {
                    (mdFileName, mdTitle) = tuplesArr[i];

                    Console.BackgroundColor = ConsoleColor.Magenta;
                    Console.ForegroundColor = ConsoleColor.Black;

                    Console.Write(i.ToString());
                    Console.ResetColor();
                    Console.Write(" > ");

                    Console.ForegroundColor = ConsoleColor.Blue;
                    Console.WriteLine(mdFileName);

                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.WriteLine(mdTitle);

                    Console.ResetColor();
                    Console.WriteLine();
                }

                Console.WriteLine("Please type in the index of the .md file to set the title from");
                int idx = int.Parse(Console.ReadLine());
                (mdFileName, mdTitle) = tuplesArr[idx];
            }
            else
            {
                throw new InvalidOperationException(
                    "Did not find any .md file containing a valid title");
            }

            return mdFileName;
        }

        private Tuple<string, string>[] GetMdFiles(
            string shortDirNamePath)
        {
            string mdFileName = null;

            string[] filesArr = Directory.GetFiles(
                shortDirNamePath, "*.md");

            var tuplesArr = filesArr.Select(
                file => Tuple.Create(
                    Path.GetFileName(file),
                    MdH.TryGetMdTitleFromFile(file))).Where(
                tuple => string.IsNullOrWhiteSpace(
                    tuple.Item2)).ToArray();

            return tuplesArr;
        }

        private class WorkArgs
        {
            public string ShortNameDirPath { get; set; }
            public string MdFilePath { get; set; }
            public string MdFileName { get; set; }
            public string MdTitle { get; set; }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Diagnostics;

namespace FsUtilsConsoleApp
{
    internal class ProgramComponent
    {
        private const string PFX = "@@";
        private const string NPP_PATH = @"C:\Program Files\Notepad++\notepad++.exe";

        public void Run(ProgramComponentArgs args)
        {
            string[] currentEntries = Directory.GetFileSystemEntries(
                args.ParentDirPath).Select(
                e => Path.GetFileName(e)).ToArray();

            int i = 1;
            var shortDirName = GetShortDirName(i);

            while (currentEntries.Contains(shortDirName))
            {
                i++;
                shortDirName = GetShortDirName(i);
            }

            string fullDirName = string.Join(' ', shortDirName, args.DirName);

            string shortDirPath = Path.Combine(args.ParentDirPath, shortDirName);
            string fullDirPath = Path.Combine(args.ParentDirPath, fullDirName);

            Directory.CreateDirectory(shortDirPath);
            Directory.CreateDirectory(fullDirPath);

            string fileName = $"{fullDirName}.md";
            string filePath = Path.Combine(shortDirPath, fileName);

            string fileNameContent = $"# {args.DirName}{Environment.NewLine}";
            File.WriteAllText(filePath, fileNameContent);

            string nppArgs = GetNppArgs(filePath);
            Process.Start(NPP_PATH, nppArgs);
        }

        private string GetShortDirName(int i)
        {
            string shortDirName = $"{PFX}{i}";
            return shortDirName;
        }

        private string GetNppArgs(string filePath)
        {
            filePath = $"\"{filePath}\"";
            return filePath;
        }
    }
}

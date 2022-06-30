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
        private const string NPP_PATH = @"C:\Program Files\Notepad++\notepad++.exe";
        private const string IDX_FMT = "D4";
        private const int DF_IDX = 8999;
        private const int DF_NOMD_IDX = 0199;
        private const int DF_INC_IDX = 1001;

        public void Run(ProgramComponentArgs args)
        {
            int idx = DF_IDX;
            bool incIdx = false;

            bool noMd = false;

            string dirName = args.DirName;
            int idxSepIdx = dirName.IndexOfAny(new char[] { '<', '>' });

            if (idxSepIdx >= 0)
            {
                char sepChar = dirName[idxSepIdx];
                incIdx = sepChar == '>';

                string idxStr = dirName.Substring(0, idxSepIdx);

                if (idxStr.EndsWith(":"))
                {
                    noMd = true;
                    idxStr = idxStr.Substring(0, idxSepIdx - 1);
                }

                if (idxStr.Any())
                {
                    idx = int.Parse(idxStr);
                }
                else if (noMd)
                {
                    idx = DF_NOMD_IDX;
                    incIdx = false;
                }
                else if (incIdx)
                {
                    idx = DF_INC_IDX;
                }

                dirName = dirName.Substring(idxSepIdx + 1);
            }

            string[] currentEntries = Directory.GetFileSystemEntries(
                args.ParentDirPath).Select(
                e => Path.GetFileName(e)).ToArray();

            int i = idx;
            var shortDirName = GetShortDirName(i);

            while (currentEntries.Contains(shortDirName))
            {
                if (incIdx)
                {
                    i++;
                }
                else
                {
                    i--;
                }
                
                shortDirName = GetShortDirName(i);
            }

            string fullDirName = string.Join(' ', shortDirName, dirName);

            string shortDirPath = Path.Combine(args.ParentDirPath, shortDirName);
            string fullDirPath = Path.Combine(args.ParentDirPath, fullDirName);

            Directory.CreateDirectory(shortDirPath);
            Directory.CreateDirectory(fullDirPath);

            if (!noMd)
            {
                string fileName = $"{dirName}.md";
                string filePath = Path.Combine(shortDirPath, fileName);

                string fileNameContent = $"# {dirName}  {Environment.NewLine}";
                File.WriteAllText(filePath, fileNameContent);

                string nppArgs = GetNppArgs(filePath);
                Process.Start(NPP_PATH, nppArgs);
            }
        }

        private string GetShortDirName(int i)
        {
            string shortDirName = i.ToString(IDX_FMT);
            return shortDirName;
        }

        private string GetNppArgs(string filePath)
        {
            filePath = $"\"{filePath}\"";
            return filePath;
        }
    }
}

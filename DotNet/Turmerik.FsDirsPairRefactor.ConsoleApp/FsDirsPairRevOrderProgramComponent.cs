using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.FsDirsPairRefactor.ConsoleApp
{
    public class FsDirsPairRevOrderProgramComponent
    {
        private readonly int noteIdxesFloor;
        private readonly int noteIdxesCeil;
        private readonly int noteIdxesMid;

        private readonly Regex shortDirNameRegex;
        private readonly Regex fullDirNameRegex;

        public FsDirsPairRevOrderProgramComponent()
        {
            noteIdxesFloor = 100;
            noteIdxesCeil = 800;
            noteIdxesMid = 450;

            shortDirNameRegex = new Regex(@"^[1-9]\d*$");
            fullDirNameRegex = new Regex(@"^[1-9]\d*\-");
        }

        public void Run(string[] args)
        {
            string rootDirPath = args.FirstOrDefault()?.Nullify(true)?.With(
                path => NormPathH.NormPath(
                    path, (path, isRooted) => isRooted.If(
                        () => path, () => Path.GetFullPath(
                            path)))) ?? Environment.CurrentDirectory;

            var wka = new WorkArgs
            {
                ParentDirPath = rootDirPath,
                DirNamesArr = Directory.GetDirectories(
                    rootDirPath).Select(
                        dirPath => Path.GetFileName(
                            dirPath)).ToArray(),
            };

            Run(wka);
        }

        private void Run(WorkArgs wka)
        {
            wka.DirPairs = GetDirPairs(wka);

            foreach (var kvp in wka.DirPairs)
            {
                int idx = kvp.Key;
                int newIdx = noteIdxesCeil - idx + noteIdxesFloor;

                (var shortDirName,
                    var shortNameDirPath,
                    var fullDirName,
                    var fullNameDirPath) = GetDirNames(
                        wka.ParentDirPath, kvp.Value, idx);

                (var newShortDirName,
                    var newShortNameDirPath,
                    var newFullDirName,
                    var newFullNameDirPath) = GetDirNames(
                        wka.ParentDirPath, kvp.Value, newIdx);

                string childFolderPath = shortNameDirPath;

                if (idx < noteIdxesMid)
                {
                    childFolderPath = newShortNameDirPath;

                    FsH.MoveDirectory(
                        shortNameDirPath,
                        newShortNameDirPath);

                    FsH.MoveDirectory(
                        fullNameDirPath,
                        newFullNameDirPath);
                }

                Run(new WorkArgs
                {
                    ParentDirPath = childFolderPath,
                    DirNamesArr = Directory.GetDirectories(
                        childFolderPath).Select(
                            dirPath => Path.GetFileName(
                                dirPath)).ToArray()
                });
            }
        }

        private Tuple<string, string, string, string> GetDirNames(
            string parentDirPath,
            string fullDirNamePart,
            int noteIdx)
        {
            string shortDirName = noteIdx.ToString();

            string fullDirName = string.Join(
                "-", shortDirName, fullDirNamePart);

            string shortNameDirPath = Path.Combine(
                parentDirPath, shortDirName);

            string fullNameDirPath = Path.Combine(
                parentDirPath, fullDirName);

            return Tuple.Create(
                shortDirName,
                shortNameDirPath,
                fullDirName,
                fullNameDirPath);
        }

        private Dictionary<int, string> GetDirPairs(
            WorkArgs wka)
        {
            var dirPairs = new Dictionary<int, string>();

            foreach (string dirName in wka.DirNamesArr)
            {
                if (TryGetDir(dirName,
                    out bool isShortDirName,
                    out int idx,
                    out string fullDirName))
                {
                    if (dirPairs.TryGetValue(idx,
                        out string existingFullDirName) && existingFullDirName != null)
                    {
                        throw new InvalidOperationException(
                            $"Ambigous entries in path {wka.ParentDirPath}: {dirName}");
                    }
                    else
                    {
                        dirPairs[idx] = fullDirName;
                    }
                }
            }

            return dirPairs;
        }

        private bool TryGetDir(
            string dirName,
            out bool isShortDirName,
            out int idx,
            out string fullDirNamePart)
        {
            isShortDirName = shortDirNameRegex.IsMatch(dirName);
            bool matchesAny = isShortDirName || fullDirNameRegex.IsMatch(dirName);

            idx = int.MinValue;
            fullDirNamePart = null;

            if (isShortDirName)
            {
                idx = int.Parse(dirName);
            }
            else if (matchesAny)
            {
                int idxOfDash = dirName.IndexOf('-');
                string str = dirName.Substring(0, idxOfDash);
                idx = int.Parse(str);
                fullDirNamePart = dirName.Substring(idxOfDash + 1);
            }

            return matchesAny;
        }

        private class WorkArgs
        {
            public string ParentDirPath { get; set; }
            public string[] DirNamesArr { get; set; }
            public Dictionary<int, string> DirPairs { get; set; }
        }
    }
}

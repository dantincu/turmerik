using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using RfDirsPairNames = Turmerik.DirsPair.ConsoleApps.RfDirsPairNames;

namespace Turmerik.FsDirsPairRefactor_AddSections.ConsoleApp
{
    public class ProgramComponent
    {
        private readonly RfDirsPairNames.IProgramComponent rfDirsPairNamesProgCompnt;

        private readonly Regex shortDirNameRegex = new Regex("^7[1-9][0-9]{2}$");
        private readonly Regex fullDirNameRegex = new Regex("^[1-9][0-9]{2}\\-.+$");

        private readonly Regex inputTypeHiddenRegex = new Regex(
            "<input\\s+type=['\"]hidden['\"]\\s+name=['\"][a-zA-Z_]+['\"]\\s+value=['\"][a-zA-Z0-9]+['\"]\\s+\\/>");

        private readonly Regex mdTitleRegex = new Regex(
            "^\\s*#\\s+");

        public ProgramComponent(
            RfDirsPairNames.IProgramComponent rfDirsPairNamesProgCompnt)
        {
            this.rfDirsPairNamesProgCompnt = rfDirsPairNamesProgCompnt ?? throw new ArgumentNullException(
                nameof(rfDirsPairNamesProgCompnt));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = new ProgramArgs
            {
                WorkDir = Path.GetFullPath(rawArgs[0]),
                Interactive = rawArgs.Contains(":i")
            };

            RunTestAssertions(args);

            await RunAsync(
                args,
                args.WorkDir,
                false,
                true);
        }

        private void RunTestAssertions(
            ProgramArgs args)
        {
            RunTestAssertion([799, 798, 797, 796, 795], 199, 999);
            RunTestAssertion([999, 997, 797, 796, 795], 199, 996);
            RunTestAssertion([798, 797, 796, 795, 198], 197, 999);
            RunTestAssertion([998, 996, 796, 795, 198], 197, 995);
        }

        private void RunTestAssertion(
            int[] idxesArr,
            int expectedFirstSectionIdx,
            int expectedFirstItemIdx)
        {
            RunTestAssertion(idxesArr, true, expectedFirstSectionIdx);
            RunTestAssertion(idxesArr, false, expectedFirstItemIdx);
        }

        private void RunTestAssertion(
            int[] idxesArr,
            bool isForSection,
            int expectedFirstIdx)
        {
            Console.WriteLine(string.Join(" ",
                "Test assertion for", idxesArr.Select(
                    idx => idx.ToString()).Aggregate(
                        (a, b) => string.Join(", ", a, b))));

            var idxesMap = idxesArr.ToDictionary(
                idx => idx, idx => string.Empty);

            int actualFirstIdx = isForSection switch
            {
                true => GetFirstSectionIdx(idxesMap),
                false => GetFirstItemIdx(idxesMap)
            };

            if (expectedFirstIdx != actualFirstIdx)
            {
                throw new InvalidOperationException(
                    $"Test assertion failed: expected {expectedFirstIdx} but obtained {actualFirstIdx}");
            }
            else
            {
                Console.WriteLine($"Result: {actualFirstIdx}");
                Console.WriteLine();
            }
        }

        private async Task<Tuple<string, Dictionary<int, string>>> RunAsync(
            ProgramArgs args,
            string dirPath,
            bool isListFolder = false,
            bool isRoot = false)
        {
            RunCore(args, dirPath, isListFolder, isRoot, out var fullDirNamePart);

            var sectionsDirNamesMap = GetDirNamesMap(
                dirPath, out var notesListKvp);

            var sectionDirNamesMapKeys = sectionsDirNamesMap.Keys.ToArray();

            foreach (var key in sectionDirNamesMapKeys)
            {
                var tuple = await RunAsync(args, Path.Combine(
                    dirPath, key.ToString()));

                sectionsDirNamesMap[key] = tuple.Item1;
            }

            string? notesDirPath = null;
            string? notesFullNameDirPath = null;
            Dictionary<int, string>? notesDirNamesMap = null;

            if (notesListKvp.Key > 0)
            {
                string notesListIdxStr = notesListKvp.Key.ToString();

                notesDirPath = Path.Combine(
                    dirPath, notesListIdxStr);

                notesFullNameDirPath = Path.Combine(
                    dirPath, string.Join("-", notesListIdxStr, notesListKvp.Value));

                notesDirNamesMap = GetDirNamesMap(
                    notesDirPath, out var subNotesListKvp);

                if (subNotesListKvp.Key > 0)
                {
                    throw new InvalidOperationException(
                        $"Should not have list folder nested directly in another list folder {notesDirPath}: {subNotesListKvp.Key}");
                }
            }

            int idx = -1;

            if (sectionsDirNamesMap.Any())
            {
                idx = GetFirstSectionIdx(sectionsDirNamesMap);

                foreach (var kvp in sectionsDirNamesMap)
                {
                    if (kvp.Key > 700 && kvp.Key < 800)
                    {
                        MoveFolders(args, dirPath, kvp, idx, dirPath);
                        idx--;
                    }
                }
            }

            if (notesDirNamesMap?.Any() == true)
            {
                idx = GetFirstItemIdx(sectionsDirNamesMap);

                var noteDirNamesMapKeys = notesDirNamesMap.Keys.ToArray();

                foreach (var key in noteDirNamesMapKeys)
                {
                    if (key > 700 && key < 800)
                    {
                        var tuple = await RunAsync(
                            args,
                            Path.Combine(
                                notesDirPath,
                                key.ToString()),
                            true);

                        notesDirNamesMap[key] = tuple.Item1;

                        MoveFolders(args, notesDirPath!, new KeyValuePair<int, string>(
                            key, tuple.Item1), idx, dirPath);
                        idx--;
                    }
                    else
                    {
                        throw new InvalidOperationException(
                            $"Should not have idx {key} in a list folder");
                    }
                }
            }

            if (notesDirPath != null)
            {
                Directory.Delete(notesDirPath, true);
            }

            if (notesFullNameDirPath != null)
            {
                Directory.Delete(notesFullNameDirPath, true);
            }

            return Tuple.Create(fullDirNamePart, sectionsDirNamesMap);
        }

        private int GetFirstSectionIdx(
            Dictionary<int, string> sectionsDirNamesMap) => Math.Min(200, sectionsDirNamesMap.Select(
                kvp => kvp.Key).Min()) - 1;

        private int GetFirstItemIdx(
            Dictionary<int, string> sectionsDirNamesMap) => Math.Min(1000, sectionsDirNamesMap.Select(
                    kvp => kvp.Key).Where(i => i > 800).OrderByDescending(i => i).LastOrDefault(
                        ).IfNotDefault<int, int?>(i => i) ?? 1000) - 1;

        private string RunCore(
            ProgramArgs args,
            string dirPath,
            bool isListFolder,
            bool isRoot,
            out string fullDirNamePart)
        {
            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.Write("Dir path: ");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write(dirPath);

            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine();
            string mdTitle = null;
            fullDirNamePart = null;

            if (!isRoot)
            {
                rfDirsPairNamesProgCompnt.Run([dirPath], out mdTitle, out fullDirNamePart);
                bool updateTitle = !isListFolder && mdTitle.ToLower().Contains("#list#");
                var mdFilePathsArr = Directory.GetFiles(dirPath);

                if (mdFilePathsArr.Length != 1)
                {
                    throw new InvalidOperationException(
                        $"Dir path with {mdFilePathsArr.Length} files");
                }

                var mdFilePath = mdFilePathsArr.Single();
                string[] textLinesArr = File.ReadAllLines(mdFilePath);
                bool isStart = true;
                bool hasDiff = false;

                var newTextLinesArr = textLinesArr.Where(textLine =>
                {
                    bool isWhiteSpace = string.IsNullOrWhiteSpace(textLine);
                    bool isHidden = !isWhiteSpace && inputTypeHiddenRegex.IsMatch(textLine);

                    bool exclude = isHidden || (isStart && isWhiteSpace);

                    if (!isWhiteSpace && !isHidden)
                    {
                        isStart = false;
                    }

                    hasDiff = hasDiff || exclude;
                    return !exclude;
                }).ToArray();

                if (updateTitle)
                {
                    newTextLinesArr = newTextLinesArr.Select(textLine =>
                    {
                        var match = mdTitleRegex.Match(textLine);
                        string retTextLine = textLine;

                        if (match.Success)
                        {
                            retTextLine = retTextLine.Trim(
                                ).TrimStart('#').TrimStart();

                            int idx = retTextLine.IndexOf("#list#", StringComparison.InvariantCultureIgnoreCase);

                            if (idx >= 0)
                            {
                                string textLineFirstPart = retTextLine.Substring(0, idx);
                                string textLineSecondPart = retTextLine.Substring(idx + "#list#".Length);

                                retTextLine = string.Concat(
                                    textLineFirstPart,
                                    textLineSecondPart);

                                retTextLine = retTextLine.Replace("  ", " ").Trim();
                                mdTitle = retTextLine;
                                retTextLine = $"# {retTextLine}  ";
                            }
                            else
                            {
                                throw new InvalidOperationException(
                                    $"Text line {retTextLine} should contain #list#");
                            }
                        }

                        return retTextLine;
                    }).ToArray();
                }

                if (hasDiff || updateTitle)
                {
                    Console.ForegroundColor = ConsoleColor.DarkBlue;
                    Console.Write("Replacing text from file ");

                    Console.ForegroundColor = ConsoleColor.Blue;
                    Console.Write(Path.GetFileName(mdFilePath));

                    Console.WriteLine();
                    Console.ForegroundColor = ConsoleColor.DarkRed;

                    foreach (var line in textLinesArr)
                    {
                        Console.WriteLine(line);
                    }

                    Console.WriteLine();
                    Console.ForegroundColor = ConsoleColor.DarkGreen;

                    foreach (var line in newTextLinesArr)
                    {
                        Console.WriteLine(line);
                    }

                    Console.ResetColor();
                    Console.WriteLine();

                    AskUserForConfirmationIfReq(args);
                    File.WriteAllLines(mdFilePath, newTextLinesArr);
                }

                if (updateTitle)
                {
                    rfDirsPairNamesProgCompnt.Run([dirPath], out var newMdTitle, out fullDirNamePart);

                    if (newMdTitle != mdTitle)
                    {
                        throw new InvalidOperationException(
                            $"Something went wrong: title {newMdTitle} is different from {mdTitle}");
                    }
                }
            }

            return mdTitle;
        }

        private string MoveFolders(
            ProgramArgs args,
            string parentDirPath,
            KeyValuePair<int, string> pairKvp,
            int newIdx,
            string newPrDifPath)
        {
            string shortDirName = pairKvp.Key.ToString();
            string newShortDirName = newIdx.ToString();

            string fullDirNamePart = pairKvp.Value;

            string fullDirName = string.Join("-",
                shortDirName, fullDirNamePart);

            string newFullDirName = string.Join("-",
                newShortDirName,
                fullDirNamePart);

            string shortDirPath = Path.Combine(
                parentDirPath, shortDirName);

            string fullDirPath = Path.Combine(
                parentDirPath, fullDirName);

            string newShortDirPath = Path.Combine(
                newPrDifPath, newShortDirName);

            string newFullDirPath = Path.Combine(
                newPrDifPath, newFullDirName);

            if (Directory.Exists(newShortDirPath))
            {
                throw new InvalidOperationException(
                    $"Destination path {newShortDirPath} already exists");
            }

            if (Directory.Exists(newFullDirPath))
            {
                throw new InvalidOperationException(
                    $"Destination path {newFullDirPath} already exists");
            }

            Console.ForegroundColor = ConsoleColor.Blue;
            Console.Write("Moving folder from ");

            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.Write(shortDirPath);

            Console.ForegroundColor = ConsoleColor.Blue;
            Console.Write(" to ");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write(newShortDirPath);
            Console.WriteLine();

            AskUserForConfirmationIfReq(args);
            Directory.Move(shortDirPath, newShortDirPath);

            Console.ForegroundColor = ConsoleColor.Blue;
            Console.Write("Moving folder from ");

            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.Write(fullDirPath);

            Console.ForegroundColor = ConsoleColor.Blue;
            Console.Write(" to ");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write(newFullDirPath);
            Console.WriteLine();

            AskUserForConfirmationIfReq(args);
            Directory.Move(fullDirPath, newFullDirPath);

            return newFullDirName;
        }

        private Dictionary<int, string> GetDirNamesMap(
            string dirPath,
            out KeyValuePair<int, string> notesListKvp)
        {
            var dirNamesArr = Directory.GetDirectories(
                dirPath).Select(dirName => Path.GetFileName(
                    dirName)).ToArray();

            Array.Sort(dirNamesArr, (a, b) => -1 * a.CompareTo(b));
            var dirNamesMap = new Dictionary<int, string>();

            foreach (var dir in dirNamesArr)
            {
                int idx = -1;
                string fullDirName = null;

                if (shortDirNameRegex.IsMatch(dir))
                {
                    idx = int.Parse(dir);

                    if (!dirNamesMap.ContainsKey(idx))
                    {
                        dirNamesMap[idx] = null;
                    }
                }
                else if (fullDirNameRegex.IsMatch(dir))
                {
                    var partsArr = dir.Split('-');
                    idx = int.Parse(partsArr[0]);

                    fullDirName = string.Join("-", partsArr.Skip(1));

                    if (!dirNamesMap.ContainsKey(idx))
                    {
                        dirNamesMap[idx] = fullDirName;
                    }
                    else
                    {
                        var existingFullDirName = dirNamesMap[idx];

                        if (existingFullDirName != null)
                        {
                            throw new InvalidOperationException(
                                string.Join(" ",
                                    $"Full dir name {dir} is ambigous with",
                                    $"{idx}-{existingFullDirName}"));
                        }
                    }
                }
            }

            notesListKvp = dirNamesMap.SingleOrDefault(
                kvp => kvp.Value.ToLower().Trim() == "#list#");

            if (notesListKvp.Key > 0)
            {
                dirNamesMap.Remove(notesListKvp.Key);
            }

            /* if (dirNamesMap.Any(kvp => kvp.Value.ToLower().Contains("#list#")))
            {
                throw new InvalidOperationException(
                    $"Invalid dir name {dirNamesMap.First(kvp => kvp.Value.ToLower().Contains("#list#"))}");
            } */

            return dirNamesMap;
        }

        private void AskUserForConfirmationIfReq(
            ProgramArgs args)
        {
            if (args.Interactive == true)
            {
                Console.WriteLine("Press the SPACE BAR to go on or any other key to exit the program");

                if (Console.ReadKey().Key != ConsoleKey.Spacebar)
                {
                    throw new Exception("User cancelled the program execution");
                }

                Console.WriteLine();
            }
        }
    }
}

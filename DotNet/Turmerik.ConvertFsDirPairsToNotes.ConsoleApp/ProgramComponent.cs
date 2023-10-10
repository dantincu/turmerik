using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Text;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;
using System.Collections.ObjectModel;

namespace Turmerik.ConvertFsDirPairsToNotes.ConsoleApp
{
    public class ProgramComponent
    {
        private static readonly string NL = Environment.NewLine;

        private static readonly ReadOnlyDictionary<int, string> commandNames;

        private readonly IJsonConversion jsonConversion;
        private readonly INoteDirPairsRetriever noteDirPairsRetriever;
        private readonly INoteDirsPairIdxRetriever noteDirsPairIdxRetriever;
        private readonly IDirPairsRetriever dirPairsRetriever;
        private readonly IConsolePrinter consolePrinter;

        private readonly AppSettings appSettings;
        private readonly ProgramSettings programSettings;
        private readonly NoteDirsPairSettings trmrk;

        private readonly string noteItemsPfx;
        private readonly string joinStr;

        static ProgramComponent()
        {
            commandNames = GetCommandNames();
        }

        public ProgramComponent(
            IJsonConversion jsonConversion,
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory,
            IDirPairsRetrieverFactory dirPairsRetrieverFactory,
            IConsolePrinter consolePrinter)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            appSettings = jsonConversion.LoadConfig<AppSettings>();
            trmrk = appSettings.TrmrkDirPairs;

            programSettings = jsonConversion.LoadConfig<ProgramSettings>(
                "programSettings.json");

            noteDirPairsRetriever = noteDirsPairGeneratorFactory.PairsRetriever(trmrk.DirNames);
            noteDirsPairIdxRetriever = noteDirsPairGeneratorFactory.IdxRetriever(trmrk.DirNames);
            dirPairsRetriever = dirPairsRetrieverFactory.Create(trmrk);

            this.consolePrinter = consolePrinter ?? throw new ArgumentNullException(
                nameof(consolePrinter));

            noteItemsPfx = trmrk.DirNames.NoteItemsPfx;
            joinStr = trmrk.DirNames.JoinStr;
        }

        public void Run(string[] args)
        {
            var wka = GetWorkArgs(args);
            wka.CurrentFsNodesWrapper = wka.RootFsNodesWrapper;

            RunCore(wka);
        }

        private void RunCore(
            WorkArgs wka)
        {
            var current = wka.CurrentFsNodesWrapper;
            AddFsNodeChildrenIfReq(current);
            SetSrcDirPairsIfReq(current);
            SetNotesIfReq(current);

            PrintFsEntryNames(current);
            ListCommandNames();
        }

        private void WaitForCommand()
        {

        }

        private void PrintFsEntryNames(
            FsNodesWrapper wrapper)
        {
            PrintPaths(wrapper, "<<<<");

            PrintEntryNames(
                wrapper.SrcChildrenNamesList,
                ConsoleColor.Cyan);

            PrintEntryNames(
                wrapper.DestnChildrenNamesList,
                ConsoleColor.Blue);

            PrintEntryNames(
                wrapper.NotesChildrenNamesList,
                ConsoleColor.Magenta);

            PrintPaths(wrapper, ">>>>");
        }

        private void PrintEntryNames(
            List<string> entryNamesList,
            ConsoleColor consoleColor)
        {
            Console.ForegroundColor = consoleColor;

            foreach (string entryName in entryNamesList)
            {
                Console.WriteLine(entryName);
            }

            Console.ResetColor();
            Console.WriteLine();
        }

        private void PrintPaths(
            FsNodesWrapper wrapper,
            string prefix)
        {
            Console.WriteLine();

            PrintPath(
                $" {prefix}   SRC PATH",
                wrapper.Src.FsPath,
                ConsoleColor.DarkCyan,
                ConsoleColor.Cyan);

            PrintPath(
                $" {prefix} DESTN PATH",
                wrapper.Destn.FsPath,
                ConsoleColor.DarkBlue,
                ConsoleColor.Blue);

            PrintPath(
                $" {prefix} NOTES PATH",
                wrapper.Notes.FsPath,
                ConsoleColor.DarkMagenta,
                ConsoleColor.Magenta);

            Console.WriteLine();
        }

        private void PrintPath(
            string caption,
            string fsPath,
            ConsoleColor headBackColor,
            ConsoleColor contentForeColor)
        {
            Console.Out.WithColors(
                () => Console.Write($"{caption}:"),
                ConsoleColor.Black,
                headBackColor);

            Console.Out.WithColors(
                () => Console.Write($" {fsPath}"),
                contentForeColor);

            Console.WriteLine();
        }

        private void SetNotesIfReq(
            FsNodesWrapper wrapper,
            bool forceRefresh = false)
        {
            if (forceRefresh || wrapper.NoteItemsList == null)
            {
                wrapper.NoteItemsList = noteDirPairsRetriever.GetNotes(
                    wrapper.DestnChildrenNamesList.ToArray());

                wrapper.NoteIdxes = wrapper.NoteItemsList.Keys.ToHashSet();
            }
        }

        private void SetSrcDirPairsIfReq(
            FsNodesWrapper wrapper,
            bool forceRefresh = false)
        {
            if (forceRefresh || wrapper.SrcDirPairs == null)
            {
                wrapper.SrcDirPairs = new Dictionary<string, string>();
                wrapper.SrcAmbgDirGroups = new Dictionary<string, List<string>>();

                wrapper.SrcUngrouppedDirNames = wrapper.Src.SubFolders.Select(
                    folder => folder.Name).ToList();

                int idx = 0;

                while (idx < wrapper.SrcUngrouppedDirNames.Count)
                {
                    string srcDirName = wrapper.SrcUngrouppedDirNames[idx];

                    int candIdx = 0;
                    var matchingDirNamesList = new List<string>();

                    while (candIdx < wrapper.SrcUngrouppedDirNames.Count)
                    {
                        if (candIdx != idx)
                        {
                            var candDirName = wrapper.SrcUngrouppedDirNames[candIdx];

                            if (candDirName.StartsWith(srcDirName))
                            {
                                matchingDirNamesList.Add(candDirName);
                                wrapper.SrcUngrouppedDirNames.RemoveAt(candIdx);

                                if (candIdx < idx)
                                {
                                    idx--;
                                }
                            }
                            else
                            {
                                candIdx++;
                            }
                        }
                        else
                        {
                            candIdx++;
                        }
                    }

                    int matchingDirNamesCount = matchingDirNamesList.Count;

                    if (matchingDirNamesCount > 0)
                    {
                        if (matchingDirNamesCount == 1)
                        {
                            wrapper.SrcDirPairs.Add(
                                srcDirName,
                                matchingDirNamesList.Single());
                        }
                        else
                        {
                            wrapper.SrcAmbgDirGroups.Add(
                                srcDirName,
                                matchingDirNamesList);
                        }

                        wrapper.SrcUngrouppedDirNames.RemoveAt(idx);
                    }
                    else
                    {
                        idx++;
                    }
                }
            }
        }

        private void AddFsNodeChildrenIfReq(
            FsNodesWrapper wrapper,
            bool forceRefresh = false)
        {
            var srcChildrenNamesList = AddFsNodeChildrenIfReq(
                wrapper.Src, forceRefresh);

            var destnChildrenNamesList = AddFsNodeChildrenIfReq(
                wrapper.Destn, forceRefresh);

            var notesChildrenNamesList = AddFsNodeChildrenIfReq(
                wrapper.Notes, forceRefresh);

            if (forceRefresh)
            {
                wrapper.SrcChildrenNamesList = srcChildrenNamesList;
                wrapper.DestnChildrenNamesList = destnChildrenNamesList;
                wrapper.NotesChildrenNamesList = notesChildrenNamesList;
            }
            else
            {
                wrapper.SrcChildrenNamesList ??= srcChildrenNamesList;
                wrapper.DestnChildrenNamesList ??= destnChildrenNamesList;
                wrapper.NotesChildrenNamesList ??= notesChildrenNamesList;
            }
        }

        private List<string> AddFsNodeChildrenIfReq(
            FsNode fsNode,
            bool forceRefresh = false) => fsNode.ShouldRefreshChildren(
                forceRefresh).With(refresh => refresh.If(() =>
                    {
                        var childrenNamesList = new List<string>();

                        fsNode.FolderFiles = GetFolderFilesArr(
                            fsNode, childrenNamesList);

                        fsNode.SubFolders = GetSubFoldersArr(
                            fsNode, childrenNamesList);

                        return childrenNamesList;
                    }));

        private List<FsNode> GetFolderFilesArr(
            FsNode fsNode,
            List<string> childrenNamesList) => GetChildNodes(
                fsNode, Directory.GetFiles,
                false, childrenNamesList);

        private List<FsNode> GetSubFoldersArr(
            FsNode fsNode,
            List<string> childrenNamesList) => GetChildNodes(
                fsNode, Directory.GetDirectories,
                true, childrenNamesList);

        private List<FsNode> GetChildNodes(
            FsNode fsNode,
            Func<string, string[]> childPathsRetriever,
            bool isFoldersList,
            List<string> childrenNamesList)
        {
            var fsNodesList = childPathsRetriever(fsNode.FsPath).Select(
                fsPath => GetFsNode(fsNode, fsPath, isFoldersList)).ToList();

            var childrenNamesArr = fsNodesList.Select(
                node => node.Name).ToArray();

            childrenNamesList.AddRange(
                childrenNamesArr);

            return fsNodesList;
        }

        private FsNode GetFsNode(
            FsNode parentNode,
            string fsPath,
            bool isFolder) => new FsNode(
                parentNode,
                Path.GetFileName(fsPath),
                isFolder);

        private WorkArgs GetWorkArgs(string[] args) => new WorkArgs
        {
            RootFsNodesWrapper = GetRootFsNodesWrppr()
        };

        private FsNodesWrapper GetRootFsNodesWrppr() => new FsNodesWrapper(
            GetRootFsNode(programSettings.SrcDirPath),
            GetRootFsNode(programSettings.DestnDirPath),
            GetRootFsNode(programSettings.NotesDirPath));

        private FsNode GetRootFsNode(
            string rootPath) => new FsNode(null, string.Empty, true, rootPath);

        private static ReadOnlyDictionary<int, string> GetCommandNames() => Enum.GetValues<Command>().ToDictionary(
            command => (int)command, command => command.ToString()).RdnlD();

        private void ListCommandNames()
        {
            Console.WriteLine();

            Console.Out.WithColors(
                () => Console.Write(" COMMANDS: <<<< "),
                ConsoleColor.Black, ConsoleColor.DarkBlue);

            int idx = 0;

            foreach (var kvp in commandNames)
            {
                Console.ForegroundColor = ConsoleColor.DarkBlue;
                Console.Write("    [");

                Console.ForegroundColor = ConsoleColor.Blue;
                Console.Write(kvp.Key);

                Console.ForegroundColor = ConsoleColor.DarkBlue;
                Console.Write("]:");

                Console.ForegroundColor = ConsoleColor.Blue;
                Console.Write(kvp.Value);

                Console.ForegroundColor = ConsoleColor.DarkBlue;
                Console.Write(";    ");

                if (++idx >= 4)
                {
                    idx = 0;
                    Console.ResetColor();
                    Console.WriteLine();
                }
            }

            Console.Out.WithColors(
                () => Console.Write(" >>>> :COMMANDS "),
                ConsoleColor.Black, ConsoleColor.DarkBlue);

            Console.WriteLine();
        }

        private enum Command
        {
            Default,
            ListEntries,
            ListSrcDirPairs,
            ListNotes,
            Refresh,
            HighlightNextPair,
            CreateNextNote
        }

        private class FsNodesWrapper
        {
            public FsNodesWrapper(FsNode src, FsNode destn, FsNode notes)
            {
                Src = src ?? throw new ArgumentNullException(nameof(src));
                Destn = destn ?? throw new ArgumentNullException(nameof(destn));
                Notes = notes ?? throw new ArgumentNullException(nameof(notes));
            }

            public FsNode Src { get; }
            public FsNode Destn { get; }
            public FsNode Notes { get; }

            public List<string> SrcChildrenNamesList { get; set; }
            public List<string> DestnChildrenNamesList { get; set; }
            public List<string> NotesChildrenNamesList { get; set; }

            public Dictionary<int, NoteItemCore> NoteItemsList { get; set; }
            public HashSet<int> NoteIdxes { get; set; }

            public Dictionary<string, string> SrcDirPairs { get; set; }
            public Dictionary<string, List<string>> SrcAmbgDirGroups { get; set; }
            public List<string> SrcUngrouppedDirNames { get; set; }
        }

        private class FsNode
        {
            public FsNode(
                FsNode parentFolder,
                string name,
                bool isFolder,
                string parentPath = null,
                string fsPath = null)
            {
                ParentFolder = parentFolder;
                ParentPath = parentPath ?? parentFolder.FsPath;
                Name = name;

                FsPath = fsPath ?? Path.Combine(
                    ParentPath, Name);

                IsFolder = isFolder;
            }

            public FsNode ParentFolder { get; }
            public string ParentPath { get; }
            public string Name { get; }
            public string FsPath { get; }
            public bool IsFolder { get; }
            public List<FsNode> SubFolders { get; set; }
            public List<FsNode> FolderFiles { get; set; }

            public bool ShouldRefreshChildren(
                bool forceRefresh = false) => IsFolder && (
                forceRefresh || !AreChildNodesAssigned());

            public bool AreChildNodesAssigned(
                ) => SubFolders != null && 
                    FolderFiles != null;
        }

        private class WorkArgs
        {
            public FsNodesWrapper RootFsNodesWrapper { get; init; }
            public FsNodesWrapper CurrentFsNodesWrapper { get; set; }
        }
    }
}

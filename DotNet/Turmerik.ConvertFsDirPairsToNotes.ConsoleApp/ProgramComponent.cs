using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Text;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;

namespace Turmerik.ConvertFsDirPairsToNotes.ConsoleApp
{
    public class ProgramComponent
    {
        private static readonly string NL = Environment.NewLine;

        private readonly IJsonConversion jsonConversion;
        private readonly INoteDirPairsRetriever noteDirPairsRetriever;
        private readonly INoteDirsPairIdxRetriever noteDirsPairIdxRetriever;

        private readonly AppSettings appSettings;
        private readonly ProgramSettings programSettings;
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

            programSettings = jsonConversion.LoadConfig<ProgramSettings>(
                "programSettings.json");

            this.noteDirPairsRetriever = noteDirsPairGeneratorFactory.PairsRetriever(
                trmrk.DirNames);

            this.noteDirsPairIdxRetriever = noteDirsPairGeneratorFactory.IdxRetriever(
                trmrk.DirNames);

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
            var src = current.Src;
            var destn = current.Destn;

            var destnExistingEntriesArr = Directory.GetFileSystemEntries(
                destn.FsPath);

            var currentNotes = noteDirPairsRetriever.GetNotes(
                    destnExistingEntriesArr,
                    out var noteDirsMap,
                    out var internalDirsMap,
                    out var ambgMap,
                    out var ambgEntryNames);

            AddSrcFsNodeChildren(src);
        }

        private FsNode AddSrcFsNodeChildren(FsNode srcFsNode)
        {
            var currentFileNodesArr = GetSrcFolderFilesArr(srcFsNode);
            srcFsNode.FolderFiles.AddRange(currentFileNodesArr);

            var currentFolderNodesArr = GetSrcSubFoldersArr(srcFsNode);
            srcFsNode.FolderFiles.AddRange(currentFolderNodesArr);

            return srcFsNode;
        }

        private FsNode[] GetSrcFolderFilesArr(FsNode srcFsNode)
        {
            var currentFilesArr = Directory.GetFiles(
                srcFsNode.FsPath);

            var currentFileNodesArr = currentFilesArr.Select(
                filePath => GetFsNode(srcFsNode, filePath, false)).ToArray();

            return currentFileNodesArr;
        }

        private FsNode[] GetSrcSubFoldersArr(FsNode srcFsNode)
        {
            var currentFoldersArr = Directory.GetDirectories(
                srcFsNode.FsPath);

            var currentFolderNodesArr = currentFoldersArr.Select(
                filePath => GetFsNode(srcFsNode, filePath, true)).ToArray();

            return currentFolderNodesArr;
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

                if (isFolder)
                {
                    SubFolders = new List<FsNode>();
                    FolderFiles = new List<FsNode>();
                }
            }

            public FsNode ParentFolder { get; }
            public string ParentPath { get; }
            public string Name { get; }
            public string FsPath { get; }
            public bool IsFolder { get; }
            public List<FsNode> SubFolders { get; }
            public List<FsNode> FolderFiles { get; }
        }

        private class WorkArgs
        {
            public FsNodesWrapper RootFsNodesWrapper { get; init; }
            public FsNodesWrapper CurrentFsNodesWrapper { get; set; }
        }
    }
}

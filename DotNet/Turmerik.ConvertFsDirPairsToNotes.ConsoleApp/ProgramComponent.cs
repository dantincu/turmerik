using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Text;
using Turmerik.Helpers;

namespace Turmerik.ConvertFsDirPairsToNotes.ConsoleApp
{
    public class ProgramComponent
    {
        private static readonly string NL = Environment.NewLine;

        private readonly IJsonConversion jsonConversion;
        private readonly INoteDirPairsRetriever noteDirPairsRetriever;

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

            noteItemsPfx = trmrk.DirNames.NoteItemsPfx;
            joinStr = trmrk.DirNames.JoinStr;
        }

        public void Run(string[] args)
        {
            string[] existingEntriesArr = Directory.GetFileSystemEntries(
                programSettings.SrcDirPath).Select(
                    entry => Path.GetFileName(entry)).ToArray();

            GetChildNodes(new Args(null,
                programSettings.SrcDirPath,
                true, programSettings.DestnDirPath),
                out var src, out var destn);
        }

        private void RunCore(string parentDirPath)
        {

        }

        private void GetChildNodes(
            Args args,
            out FsNode src,
            out FsNode destn)
        {
            src = new FsNode(
                args.SrcItemName,
                args.ParentWrppr?.Src,
                args.IsFolder);

            if (args.DestnItemPath != null)
            {
                destn = new FsNode(
                    Path.Combine(
                        args.DestnItemPath,
                        Path.GetFileName(args.SrcItemName)),
                    null, args.IsFolder);
            }
            else
            {
                destn = new FsNode(
                    args.SrcItemName,
                    args.ParentWrppr.Destn,
                    args.IsFolder);
            }
        }

        private class Args
        {
            public Args(
                FsNodesWrapper parentWrppr,
                string srcItemName,
                bool isFolder = false,
                string destnItemPath = null)
            {
                ParentWrppr = parentWrppr;
                SrcItemName = srcItemName;
                IsFolder = isFolder;
                DestnItemPath = destnItemPath;
            }

            public FsNodesWrapper ParentWrppr { get; }
            public string SrcItemName { get; }
            public bool IsFolder { get; }
            public string DestnItemPath { get; }
        }

        private class FsNodesWrapper
        {
            public FsNodesWrapper(
                FsNode src,
                FsNode destn,
                FsNode notes)
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
                string name,
                FsNode parent = null,
                bool isFolder = false)
            {
                Name = name ?? throw new ArgumentNullException(
                    nameof(name));

                Parent = parent;
                IsFolder = isFolder;
            }

            public string Name { get; }
            public FsNode Parent { get; }
            public bool IsFolder { get; }
            public List<FsNode> Children { get; set; }
            public Dictionary<int, NoteItem> ChildNotes { get; set; }
            public Dictionary<int, List<NoteDirName>> NotesMap { get; set; }
            public Dictionary<int, List<NoteDirName>> AmbgNotesMap { get; set; }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.Notes
{
    public abstract class NoteDirsPairGeneratorBase
    {
        protected IJsonConversion JsonConversion { get; }
        protected IFsEntryNameNormalizer FsEntryNameNormalizer { get; }
        protected INextNoteIdxRetriever NextNoteIdxRetriever { get; }
        protected IExistingNoteDirPairsRetriever ExistingNoteDirPairsRetriever { get; }
        protected INoteCfgValuesRetriever NoteCfgValuesRetriever { get; }

        public NoteDirsPairGeneratorBase(
            IJsonConversion jsonConversion,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            INextNoteIdxRetriever nextNoteIdxRetriever,
            IExistingNoteDirPairsRetriever existingNoteDirPairsRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever)
        {
            this.JsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.FsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.NextNoteIdxRetriever = nextNoteIdxRetriever ?? throw new ArgumentNullException(
                nameof(nextNoteIdxRetriever));

            this.ExistingNoteDirPairsRetriever = existingNoteDirPairsRetriever ?? throw new ArgumentNullException(
                nameof(existingNoteDirPairsRetriever));

            this.NoteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            Config = ExistingNoteDirPairsRetriever.Config;
            ArgOptsCfg = ExistingNoteDirPairsRetriever.ArgOptsCfg;
            DirNamesCfg = ExistingNoteDirPairsRetriever.DirNamesCfg;
            NoteDirNameIdxesCfg = ExistingNoteDirPairsRetriever.NoteDirNameIdxesCfg;
            NoteInternalDirNameIdxesCfg = ExistingNoteDirPairsRetriever.NoteInternalDirNameIdxesCfg;
            FileNamesCfg = ExistingNoteDirPairsRetriever.FileNamesCfg;
            FileContentsCfg = ExistingNoteDirPairsRetriever.FileContentsCfg;
        }

        public INoteDirsPairConfig Config { get; }
        public NoteDirsPairConfig.IArgOptionsT ArgOptsCfg { get; }
        public NoteDirsPairConfig.IDirNamesT DirNamesCfg { get; }
        public NoteDirsPairConfig.IDirNameIdxesT NoteDirNameIdxesCfg { get; }
        public NoteDirsPairConfig.IDirNameIdxesT NoteInternalDirNameIdxesCfg { get; }
        public NoteDirsPairConfig.IFileNamesT FileNamesCfg { get; }
        public NoteDirsPairConfig.IFileContentsT FileContentsCfg { get; }

        protected void GenerateNoteItem(
            Args args)
        {
            args.NoteItem = new NoteItemCore
            {
                Title = args.Opts.Title,
                TrmrkGuid = Trmrk.TrmrkGuid,
                ItemIdx = GenerateNoteItemCore(
                    args, out var fullDirNamePart),
                InternalDirs = new Dictionary<NoteInternalDir, int>()
            };

            int internalDirIdx = 1;
            var idxesList = new List<int>();

            AddInternalDirs(args.Opts,
                args.NoteItem.InternalDirs,
                idxesList, ref internalDirIdx);

            var shortNameDir = args.DirsList[0];
            shortNameDir.SubFolders = new List<DriveItemX>();

            shortNameDir.FolderFiles = GetNoteMdFile(
                args.Opts.Title,
                fullDirNamePart).Lst();

            Config.SerializeToJson?.ActIf(
                () => shortNameDir.FolderFiles.Add(
                    GetNoteJsonFile(
                        args.NoteItem)));

            GenerateInternalDirsCore(
                args.NoteItem.InternalDirs,
                shortNameDir.SubFolders);
        }

        protected int GenerateNoteItemCore(
            Args args,
            out string fullDirNamePart)
        {
            var noteIdx = NextNoteIdxRetriever.GetNextIdx(
                NoteDirNameIdxesCfg,
                args.ExistingDirPairs.AllExistingNoteDirIdxes.ToArray());

            string shortDirName = DirNamesCfg.NoteItemsPfx;
            shortDirName += noteIdx.ToString(
                NoteDirNameIdxesCfg.IdxFmt ?? "D1");

            fullDirNamePart = FsEntryNameNormalizer.NormalizeFsEntryName(args.Opts.Title,
                Config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH);

            AddDirsPair(
                args.DirsList,
                shortDirName,
                fullDirNamePart);

            return noteIdx;
        }

        protected void GenerateNoteBook(
            Args args)
        {
            if (args.Opts.CreateNoteInternalDirsPair || args.Opts.CreateNoteFilesDirsPair)
            {
                throw new InvalidOperationException(
                    "The create note book dirs pair flag cannot be provided along with other create note internal dirs pair flags");
            }

            args.NoteBook = new NoteBookCore
            {
                Title = args.Opts.Title,
                TrmrkGuid = Trmrk.TrmrkGuid,
                InternalDirs = new Dictionary<NoteInternalDir, int>()
            };

            (var idxesList, var idxesMap, var idx) = GetNoteInternalDirMap(
                args.ExistingDirPairs.AllExistingInternalDirIdxes);

            AddInternalDir(idxesMap, idxesList,
                args.Opts.CreateNoteBookDirsPair,
                NoteInternalDir.Root, ref idx);

            GenerateInternalDirsCore(
                idxesMap,
                args.DirsList);
        }

        protected Dictionary<NoteInternalDir, int> GenerateInternalDirs(
            Args args)
        {
            (var idxesList, var idxesMap, var idx) = GetNoteInternalDirMap(
                args.ExistingDirPairs.AllExistingInternalDirIdxes);

            AddInternalDirs(
                args.Opts, idxesMap,
                idxesList, ref idx);

            if (idx == 1)
            {
                throw new InvalidOperationException(
                    "Either the note title to be created as new or an internal note dirs pair flag must be provided");
            }

            GenerateInternalDirsCore(
                idxesMap,
                args.DirsList);

            return idxesMap;
        }

        protected void GenerateInternalDirsCore(
            Dictionary<NoteInternalDir, int> idxesMap,
            List<DriveItemX> itemsList)
        {
            foreach (var kvp in idxesMap)
            {
                GenerateInternalDirsCore(
                    kvp, itemsList);
            }
        }

        protected void GenerateInternalDirsCore(
            KeyValuePair<NoteInternalDir, int> kvp,
            List<DriveItemX> itemsList)
        {
            var cfg = DirNamesCfg;
            string shortDirName = cfg.NoteInternalsPfx;

            shortDirName += kvp.Value.ToString(
                NoteInternalDirNameIdxesCfg.IdxFmt ?? "D1");

            string fullDirNamePart = GetInternalDirFullNamePart(
                cfg, kvp.Key);

            AddDirsPair(itemsList,
                shortDirName, fullDirNamePart);
        }

        protected void AddInternalDirs(
            NoteDirsPairOpts opts,
            Dictionary<NoteInternalDir, int> idxesMap,
            List<int> idxesList,
            ref int idx)
        {
            AddInternalDir(idxesMap, idxesList,
                opts.CreateNoteInternalDirsPair,
                NoteInternalDir.Internals, ref idx);

            AddInternalDir(idxesMap, idxesList,
                opts.CreateNoteFilesDirsPair,
                NoteInternalDir.Files, ref idx);
        }

        protected bool AddInternalDir(
            Dictionary<NoteInternalDir, int> idxesMap,
            List<int> idxesList,
            bool condition,
            NoteInternalDir key,
            ref int idx)
        {
            if (condition)
            {
                idx = NextNoteIdxRetriever.GetNextIdx(
                    NoteInternalDirNameIdxesCfg,
                    idxesList.ToArray());

                idxesList.Add(idx);
                idxesMap.Add(key, idx);
            }

            return condition;
        }

        protected string GetInternalDirFullNamePart(
            NoteDirsPairConfig.IDirNamesT cfg,
            NoteInternalDir noteInternalDir) => noteInternalDir switch
            {
                NoteInternalDir.Root => cfg.NoteBook,
                NoteInternalDir.Internals => cfg.NoteInternals,
                NoteInternalDir.Files => cfg.NoteFiles
            };

        protected DriveItemX[] AddDirsPair(
            List<DriveItemX> itemsList,
            string shortDirName,
            string fullDirNamePart)
        {
            var dirsPair = GetDirsPair(
                shortDirName,
                fullDirNamePart);

            itemsList.AddRange(dirsPair);
            return dirsPair;
        }

        protected DriveItemX[] GetDirsPair(
            string shortDirName,
            string fullDirNamePart) => new DriveItemX
            {
                Name = shortDirName,
                IsFolder = true
            }.Arr(GetFullNameFolder(
                shortDirName,
                fullDirNamePart));

        protected DriveItemX GetFullNameFolder(
            string shortDirName,
            string fullDirNamePart) => new DriveItemX
            {
                Name = string.Join(
                    DirNamesCfg.JoinStr,
                    shortDirName,
                    fullDirNamePart),
                IsFolder = true,
                FolderFiles = GetKeepFileItem().Lst()
            };

        protected DriveItemX GetNoteJsonFile(
            NoteItemCore noteItem) => GetFile(
                FileNamesCfg.NoteItemJsonFileName,
                JsonConversion.Adapter.Serialize(
                    noteItem));

        protected DriveItemX GetNoteMdFile(
            string noteTitle,
            string fullDirNamePart) => GetFile(
                NoteCfgValuesRetriever.GetNoteMdFileName(
                    fullDirNamePart,
                    FileNamesCfg),
                NoteCfgValuesRetriever.GetNoteMdFileContents(
                    noteTitle,
                    FileContentsCfg,
                    Config.TrmrkGuidInputName));

        protected DriveItemX GetFile(
            string fileName,
            string fileContents) => new DriveItemX
            {
                Name = fileName,
                Data = new DriveItemXData
                {
                    TextFileContents = fileContents
                }
            };

        protected DriveItemX GetKeepFileItem() => GetFile(
            FileNamesCfg.KeepFileName,
            NoteCfgValuesRetriever.GetKeepFileContents(
                FileContentsCfg));

        private Tuple<List<int>, Dictionary<NoteInternalDir, int>, int> GetNoteInternalDirMap(
            HashSet<int> existingIdxes, int idx = 1) => Tuple.Create(
                existingIdxes.ToList(),
                new Dictionary<NoteInternalDir, int>(),
                idx);

        protected struct Args
        {
            public Args(
                NoteDirsPairOpts opts,
                List<DriveItemX> dirsList = null) : this()
            {
                Opts = opts;
                DirsList = dirsList ?? new List<DriveItemX>();
            }

            public NoteDirsPairOpts Opts { get; init; }
            public List<DriveItemX> DirsList { get; init; }
            public string PrIdnf { get; init; }
            public NoteDirPairsAgg ExistingDirPairs { get; init; }
            public NoteItemCore NoteItem { get; set; }
            public NoteBookCore NoteBook { get; set; }
        }
    }
}

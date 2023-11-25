using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.DriveExplorer.DirsPair
{
    public interface IExistingDirPairsRetriever
    {
        ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> DirNamesRegexMap { get; }
        INoteDirsPairConfig Config { get; }

        Task<NoteItemsTupleCore> GetNoteDirPairsAsync(
            string prIdnf);

        void GetNoteDirPairs(
            NoteItemsTupleCore tuple);

        DirsPairTuple HandleDir(
            NoteItemsTupleCore tuple,
            string dirName);

        public DirsPairTuple HandleDirMatch(
            NoteItemsTupleCore tuple,
            NoteDirMatchTuple match);

        public DirsPairTuple CreateDirsPairTuple(
            NoteItemsTupleCore tuple,
            NoteDirMatchTuple match);

        bool Matches(
            NoteItemsTupleCore tuple,
            NoteDirMatchTuple match,
            DirsPairTuple dirsPairTuple);
    }

    public class ExistingDirPairsRetriever : IExistingDirPairsRetriever
    {
        private readonly IDriveItemsRetriever driveItemsRetriever;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;
        private readonly INoteDirsPairIdxRetriever noteDirsPairIdxRetriever;

        public ExistingDirPairsRetriever(
            IDriveItemsRetriever driveItemsRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteDirsPairIdxRetriever noteDirsPairIdxRetriever,
            ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> dirNamesRegexMap,
            INoteDirsPairConfig config)
        {
            this.driveItemsRetriever = driveItemsRetriever ?? throw new ArgumentNullException(
                nameof(driveItemsRetriever));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            this.noteDirsPairIdxRetriever = noteDirsPairIdxRetriever ?? throw new ArgumentNullException(
                nameof(noteDirsPairIdxRetriever));

            this.DirNamesRegexMap = dirNamesRegexMap ?? throw new ArgumentNullException(
                nameof(dirNamesRegexMap));

            this.Config = config ?? throw new ArgumentNullException(
                nameof(config));

            ArgOptsCfg = Config.GetArgOpts();
            DirNamesCfg = Config.GetDirNames();
            NoteDirNameIdxesCfg = Config.GetNoteDirNameIdxes();
            NoteInternalDirNameIdxesCfg = Config.GetNoteInternalDirNameIdxes();
            FileNamesCfg = Config.GetFileNames();
            FileContentsCfg = Config.GetFileContents();
        }

        public ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> DirNamesRegexMap { get; }
        public INoteDirsPairConfig Config { get; }

        protected NoteDirsPairConfig.IArgOptionsAggT ArgOptsCfg { get; }
        protected NoteDirsPairConfig.IDirNamesT DirNamesCfg { get; }
        protected NoteDirsPairConfig.IDirNameIdxesT NoteDirNameIdxesCfg { get; }
        protected NoteDirsPairConfig.IDirNameIdxesT NoteInternalDirNameIdxesCfg { get; }
        protected NoteDirsPairConfig.IFileNamesT FileNamesCfg { get; }
        protected NoteDirsPairConfig.IFileContentsT FileContentsCfg { get; }

        public async Task<NoteItemsTupleCore> GetNoteDirPairsAsync(
            string prIdnf)
        {
            var tuple = NoteItemsTupleCore.Create(
                await driveItemsRetriever.GetFolderAsync(prIdnf));

            GetNoteDirPairs(tuple);
            return tuple;
        }

        public void GetNoteDirPairs(
            NoteItemsTupleCore tuple)
        {
            foreach (var folder in tuple.ParentFolder.SubFolders)
            {
                HandleDir(tuple, folder.Name);
            }

            foreach (var dirsPairTuple in tuple.DirsPairTuples)
            {
                if (dirsPairTuple.DirNamesMap.Count == 2 && dirsPairTuple.DirNamesMap.Where(
                    kvp => kvp.Value == null).Count() == 1)
                {
                    var fullNameDirKvp = dirsPairTuple.DirNamesMap.Single(
                        kvp => kvp.Value != null);

                    dirsPairTuple.FullDirName = fullNameDirKvp.Key;
                    dirsPairTuple.FullDirNamePart = fullNameDirKvp.Value;
                }
            }
        }

        public DirsPairTuple HandleDir(
            NoteItemsTupleCore tuple,
            string dirName)
        {
            DirsPairTuple dirsPairTuple = null;

            if (noteDirsPairIdxRetriever.TryGetNoteDirsPairIdx(
                DirNamesRegexMap, dirName,
                DirNamesCfg, out var match))
            {
                dirsPairTuple = HandleDirMatch(
                    tuple, match);
            }
            else
            {
                tuple.OtherDirNames.Add(
                    dirName);
            }

            return dirsPairTuple;
        }

        public DirsPairTuple HandleDirMatch(
            NoteItemsTupleCore tuple,
            NoteDirMatchTuple match)
        {
            var dirsPairTuple = tuple.DirsPairTuples.FirstOrDefault(
                candTuple => Matches(tuple, match, candTuple));

            if (dirsPairTuple != null)
            {
                dirsPairTuple.DirNamesMap.Add(
                    match.DirName, match.FullDirNamePart);
            }
            else
            {
                dirsPairTuple = CreateDirsPairTuple(
                    tuple, match);

                tuple.DirsPairTuples.Add(dirsPairTuple);
            }

            return dirsPairTuple;
        }

        public DirsPairTuple CreateDirsPairTuple(
            NoteItemsTupleCore tuple,
            NoteDirMatchTuple match)
        {
            var dirTypeTuple = match.DirTypeTuple;

            var dirsPairTuple = new DirsPairTuple
            {
                NoteDirCat = dirTypeTuple.DirCat,
                NoteDirPfxType = dirTypeTuple.DirPfxType,
                NoteIdx = match.NoteIdx,
                DirNamesMap = new Dictionary<string, string>
                {
                    { match.DirName, match.FullDirNamePart },
                },
                ShortDirName = match.ShortDirName
            };

            return dirsPairTuple;
        }

        public bool Matches(
            NoteItemsTupleCore tuple,
            NoteDirMatchTuple match,
            DirsPairTuple dirsPairTuple)
        {
            var noteDirTypeTuple = match.DirTypeTuple;
            bool matches = dirsPairTuple.NoteIdx == match.NoteIdx;
            matches = matches && dirsPairTuple.NoteInternalDir == match.NoteInternalDir;

            matches = matches && dirsPairTuple.NoteDirCat == noteDirTypeTuple.DirCat;
            matches = matches && dirsPairTuple.NoteDirPfxType == noteDirTypeTuple.DirPfxType;

            return matches;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Notes.Core;

namespace Turmerik.DirsPair
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
            List<DirsPairTuple> tuplesList,
            List<string> otherDirNamesList,
            string dirName);

        DirsPairTuple HandleDirMatch(
            List<DirsPairTuple> tuplesList,
            NoteDirMatchTuple match);

        DirsPairTuple CreateDirsPairTuple(
            NoteDirMatchTuple match);

        bool Matches(
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

            DirNamesRegexMap = dirNamesRegexMap ?? throw new ArgumentNullException(
                nameof(dirNamesRegexMap));

            Config = config ?? throw new ArgumentNullException(
                nameof(config));

            ArgOptsCfg = Config.GetArgOpts();
            DirNamesCfg = Config.GetDirNames();
            NoteDirNameIdxesCfg = Config.GetNoteDirNameIdxes();
            NoteSectionDirNameIdxesCfg = Config.GetNoteSectionDirNameIdxes();
            NoteInternalDirNameIdxesCfg = Config.GetNoteInternalDirNameIdxes();
            FileNamesCfg = Config.GetFileNames();
            FileContentsCfg = Config.GetFileContents();
        }

        public ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> DirNamesRegexMap { get; }
        public INoteDirsPairConfig Config { get; }

        protected NoteDirsPairConfig.IArgOptionsAggT ArgOptsCfg { get; }
        protected NoteDirsPairConfig.IDirNamesT DirNamesCfg { get; }
        protected NoteDirsPairConfig.IDirNameIdxesT NoteDirNameIdxesCfg { get; }
        protected NoteDirsPairConfig.IDirNameIdxesT NoteSectionDirNameIdxesCfg { get; }
        protected NoteDirsPairConfig.IDirNameIdxesT NoteInternalDirNameIdxesCfg { get; }
        protected NoteDirsPairConfig.IFileNamesT FileNamesCfg { get; }
        protected NoteDirsPairConfig.IFileContentsT FileContentsCfg { get; }

        public async Task<NoteItemsTupleCore> GetNoteDirPairsAsync(
            string prIdnf)
        {
            var tuple = NoteItemsTupleCore.Create(
                await driveItemsRetriever.GetFolderAsync(prIdnf, false));

            GetNoteDirPairs(tuple);

            int noteDirNameIncIdx = (NoteDirNameIdxesCfg.IncIdx ?? true) ? 1 : -1;
            int noteInternalDirNameIncIdx = (NoteInternalDirNameIdxesCfg.IncIdx ?? true) ? 1 : -1;

            Comparison<DirsPairTuple> comparison = (n1, n2) =>
            {
                int retVal;

                if (n1.NoteDirCat == NoteDirCategory.Item)
                {
                    if (n2.NoteDirCat == NoteDirCategory.Item)
                    {
                        retVal = n1.NoteDirIdx.CompareTo(n2.NoteDirIdx) * noteDirNameIncIdx;
                    }
                    else
                    {
                        retVal = 1;
                    }
                }
                else
                {
                    if (n2.NoteDirCat == NoteDirCategory.Item)
                    {
                        retVal = -1;
                    }
                    else
                    {
                        retVal = n1.NoteDirIdx.CompareTo(n2.NoteDirIdx) * noteInternalDirNameIncIdx;
                    }
                }

                return retVal;
            };

            tuple.DirsPairTuples.Sort(comparison);
            tuple.FileDirsPairTuples.Sort(comparison);

            return tuple;
        }

        public void GetNoteDirPairs(
            NoteItemsTupleCore tuple)
        {
            foreach (var folder in tuple.ParentFolder.SubFolders)
            {
                HandleDir(
                    tuple.DirsPairTuples,
                    tuple.OtherDirNames,
                    folder.Name);
            }

            foreach (var file in tuple.ParentFolder.FolderFiles)
            {
                HandleDir(
                    tuple.FileDirsPairTuples,
                    tuple.OtherFileNames,
                    file.Name);
            }

            foreach (var dirsPairTuple in tuple.DirsPairTuples)
            {
                UpdateExistingIdxes(tuple, dirsPairTuple);

                if (dirsPairTuple.DirNamesMap.Count == 2 && dirsPairTuple.DirNamesMap.Where(
                    kvp => kvp.Value == null).Count() == 1)
                {
                    var fullNameDirKvp = dirsPairTuple.DirNamesMap.Single(
                        kvp => kvp.Value != null);

                    dirsPairTuple.FullDirName = fullNameDirKvp.Key;
                    dirsPairTuple.FullDirNamePart = fullNameDirKvp.Value;
                }
            }

            foreach (var dirsPairTuple in tuple.FileDirsPairTuples)
            {
                UpdateExistingIdxes(tuple, dirsPairTuple);
            }
        }

        public DirsPairTuple HandleDir(
            List<DirsPairTuple> tuplesList,
            List<string> otherDirNamesList,
            string dirName)
        {
            DirsPairTuple dirsPairTuple = null;

            if (noteDirsPairIdxRetriever.TryGetNoteDirsPairIdx(
                DirNamesRegexMap, dirName,
                DirNamesCfg, out var match))
            {
                dirsPairTuple = HandleDirMatch(
                    tuplesList, match);
            }
            else
            {
                otherDirNamesList.Add(
                    dirName);
            }

            return dirsPairTuple;
        }

        public DirsPairTuple HandleDirMatch(
            List<DirsPairTuple> tuplesList,
            NoteDirMatchTuple match)
        {
            var dirsPairTuple = tuplesList.FirstOrDefault(
                candTuple => Matches(match, candTuple));

            if (dirsPairTuple != null)
            {
                dirsPairTuple.DirNamesMap.Add(
                    match.DirName,
                    match.FullDirNamePart);
            }
            else
            {
                dirsPairTuple = CreateDirsPairTuple(match);
                tuplesList.Add(dirsPairTuple);
            }

            return dirsPairTuple;
        }

        public DirsPairTuple CreateDirsPairTuple(
            NoteDirMatchTuple match)
        {
            var dirTypeTuple = match.DirTypeTuple;

            var dirsPairTuple = new DirsPairTuple
            {
                NoteDirCat = dirTypeTuple.DirCat,
                NoteDirPfxType = dirTypeTuple.DirPfxType,
                NoteDirIdx = match.NoteDirIdx,
                DirNamesMap = new Dictionary<string, string>
                {
                    { match.DirName, match.FullDirNamePart },
                },
                ShortDirName = match.ShortDirName
            };

            return dirsPairTuple;
        }

        public bool Matches(
            NoteDirMatchTuple match,
            DirsPairTuple dirsPairTuple)
        {
            var noteDirTypeTuple = match.DirTypeTuple;
            bool matches = dirsPairTuple.NoteDirIdx == match.NoteDirIdx;
            // matches = matches && dirsPairTuple.NoteInternalDir == match.NoteInternalDir;

            matches = matches && dirsPairTuple.NoteDirCat == noteDirTypeTuple.DirCat;
            matches = matches && dirsPairTuple.NoteDirPfxType == noteDirTypeTuple.DirPfxType;

            return matches;
        }

        private void UpdateExistingIdxes(
            NoteItemsTupleCore noteItemsTuple,
            DirsPairTuple dirsPairTuple)
        {
            if (dirsPairTuple.NoteDirCat == NoteDirCategory.Item)
            {
                noteItemsTuple.ExistingNoteDirIdxes.Add(
                    dirsPairTuple.NoteDirIdx);
            }
            else
            {
                noteItemsTuple.ExistingInternalDirIdxes.Add(
                    dirsPairTuple.NoteDirIdx);
            }
        }
    }
}

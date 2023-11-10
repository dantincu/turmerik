using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes
{
    public interface IExistingNoteDirPairsRetriever
    {
        INoteDirsPairConfig Config { get; }
        NoteDirsPairConfig.IArgOptionsT ArgOptsCfg { get; }
        NoteDirsPairConfig.IDirNamesT DirNamesCfg { get; }
        NoteDirsPairConfig.IDirNameIdxesT NoteDirNameIdxesCfg { get; }
        NoteDirsPairConfig.IDirNameIdxesT NoteInternalDirNameIdxesCfg { get; }
        NoteDirsPairConfig.IFileNamesT FileNamesCfg { get; }
        NoteDirsPairConfig.IFileContentsT FileContentsCfg { get; }
        ReadOnlyDictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>> DirNamesRegexMap { get; }

        Task<NoteDirPairsAgg> GetNoteDirPairsAsync(
            string prIdnf);
    }

    public class ExistingNoteDirPairsRetriever : IExistingNoteDirPairsRetriever
    {
        private readonly IDriveExplorerService dvExplrSvc;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;

        public ExistingNoteDirPairsRetriever(
            IDriveExplorerService dvExplrSvc,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteDirsPairConfig config,
            ReadOnlyDictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>> dirNamesRegexMap)
        {
            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(
                nameof(dvExplrSvc));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            this.Config = config ?? throw new ArgumentNullException(
                nameof(config));

            ArgOptsCfg = Config.GetArgOpts();
            DirNamesCfg = Config.GetDirNames();
            NoteDirNameIdxesCfg = Config.GetNoteDirNameIdxes();
            NoteInternalDirNameIdxesCfg = Config.GetNoteInternalDirNameIdxes();
            FileNamesCfg = Config.GetFileNames();
            FileContentsCfg = Config.GetFileContents();

            this.DirNamesRegexMap = dirNamesRegexMap ?? throw new ArgumentNullException(
                nameof(dirNamesRegexMap));
        }

        public INoteDirsPairConfig Config { get; }
        public NoteDirsPairConfig.IArgOptionsT ArgOptsCfg { get; }
        public NoteDirsPairConfig.IDirNamesT DirNamesCfg { get; }
        public NoteDirsPairConfig.IDirNameIdxesT NoteDirNameIdxesCfg { get; }
        public NoteDirsPairConfig.IDirNameIdxesT NoteInternalDirNameIdxesCfg { get; }
        public NoteDirsPairConfig.IFileNamesT FileNamesCfg { get; }
        public NoteDirsPairConfig.IFileContentsT FileContentsCfg { get; }
        public ReadOnlyDictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>> DirNamesRegexMap { get; }

        public async Task<NoteDirPairsAgg> GetNoteDirPairsAsync(
            string prIdnf)
        {
            var prFolder = await dvExplrSvc.GetFolderAsync(prIdnf);

            var retObj = new NoteDirPairsAgg();

            throw new NotImplementedException();
        }

        public Tuple<string, NoteItemCore> GetNoteJsonFile(
            string[] fileNamesArr)
        {
            string bestFileName = fileNamesArr.SingleOrDefault(
                fileName => fileName == FileNamesCfg.NoteJsonFileName);

            if (bestFileName != null)
            {

            }

            throw new NotImplementedException();
        }

        public Tuple<NoteItemCore, bool> TryGetNoteItem(
            string fileContents)
        {
            NoteItemCore item;

            try
            {
                // item = this.GetNoteJsonFile
            }
            catch (Exception ex)
            {
                throw;
            }

            throw new NotImplementedException();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
            var parentFolder = await driveItemsRetriever.GetFolderAsync(prIdnf);

            var retObj = new NoteItemsTupleCore
            {
                ParentFolder = parentFolder.ToItemX(-1)
            };

            throw new NotImplementedException();
        }

        
    }
}

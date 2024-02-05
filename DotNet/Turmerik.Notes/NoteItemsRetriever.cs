using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.TextSerialization;
using Turmerik.Md;
using Turmerik.Core.Utility;
using Turmerik.DirsPair;
using Turmerik.Notes.Core;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.Notes
{
    public interface INoteItemsRetriever
    {
        ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> DirNamesRegexMap { get; }
        INoteDirsPairConfig Config { get; }

        Task<NoteItemsTuple> GetNoteDirPairsAsync(
            string prIdnf);
    }

    public class NoteItemsRetriever : INoteItemsRetriever
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IDriveItemsRetriever driveItemsRetriever;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;
        private readonly INoteJsonDeserializer noteJsonDeserializer;

        public NoteItemsRetriever(
            IJsonConversion jsonConversion,
            IDriveItemsRetriever driveItemsRetriever,
            IExistingDirPairsRetriever existingDirPairsRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteJsonDeserializer noteJsonDeserializer,
            INoteDirsPairConfig config,
            ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> dirNamesRegexMap)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.driveItemsRetriever = driveItemsRetriever ?? throw new ArgumentNullException(
                nameof(driveItemsRetriever));

            this.existingDirPairsRetriever = existingDirPairsRetriever ?? throw new ArgumentNullException(
                nameof(existingDirPairsRetriever));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            this.noteJsonDeserializer = noteJsonDeserializer ?? throw new ArgumentNullException(
                nameof(noteJsonDeserializer));

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

        public async Task<NoteItemsTuple> GetNoteDirPairsAsync(
            string prIdnf)
        {
            var tupleCore = await existingDirPairsRetriever.GetNoteDirPairsAsync(prIdnf);

            var retTuple = new NoteItemsTuple(tupleCore)
            {
            };

            throw new NotImplementedException();
        }
    }
}

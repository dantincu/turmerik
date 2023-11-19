﻿using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Notes.Md;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.Notes
{
    public interface INoteItemsRetriever
    {
        INoteDirsPairConfig Config { get; }
        NoteDirsPairConfig.IArgOptionsAggT ArgOptsCfg { get; }
        NoteDirsPairConfig.IDirNamesT DirNamesCfg { get; }
        NoteDirsPairConfig.IDirNameIdxesT NoteDirNameIdxesCfg { get; }
        NoteDirsPairConfig.IDirNameIdxesT NoteInternalDirNameIdxesCfg { get; }
        NoteDirsPairConfig.IFileNamesT FileNamesCfg { get; }
        NoteDirsPairConfig.IFileContentsT FileContentsCfg { get; }
        ReadOnlyDictionary<NoteDirTypeTuple, Regex> DirNamesRegexMap { get; }

        Task<NoteItemsTuple> GetNoteDirPairsAsync(
            string prIdnf);
    }

    public class NoteItemsRetriever : INoteItemsRetriever
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IDriveItemsRetriever driveItemsRetriever;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;
        private readonly INoteJsonDeserializer noteJsonDeserializer;

        public NoteItemsRetriever(
            IJsonConversion jsonConversion,
            IDriveItemsRetriever driveItemsRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteJsonDeserializer noteJsonDeserializer,
            INoteDirsPairConfig config,
            ReadOnlyDictionary<NoteDirTypeTuple, Regex> dirNamesRegexMap)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.driveItemsRetriever = driveItemsRetriever ?? throw new ArgumentNullException(
                nameof(driveItemsRetriever));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            this.noteJsonDeserializer = noteJsonDeserializer ?? throw new ArgumentNullException(
                nameof(noteJsonDeserializer));

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
        public NoteDirsPairConfig.IArgOptionsAggT ArgOptsCfg { get; }
        public NoteDirsPairConfig.IDirNamesT DirNamesCfg { get; }
        public NoteDirsPairConfig.IDirNameIdxesT NoteDirNameIdxesCfg { get; }
        public NoteDirsPairConfig.IDirNameIdxesT NoteInternalDirNameIdxesCfg { get; }
        public NoteDirsPairConfig.IFileNamesT FileNamesCfg { get; }
        public NoteDirsPairConfig.IFileContentsT FileContentsCfg { get; }
        public ReadOnlyDictionary<NoteDirTypeTuple, Regex> DirNamesRegexMap { get; }

        public async Task<NoteItemsTuple> GetNoteDirPairsAsync(
            string prIdnf)
        {
            var parentFolder = await driveItemsRetriever.GetFolderAsync(prIdnf);

            var retObj = new NoteItemsTuple
            {
                ParentFolder = parentFolder.ToItemX(-1)
            };

            throw new NotImplementedException();
        }
    }
}
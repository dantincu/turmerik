using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.DirsPair;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.Notes
{
    public interface INoteItemsRetrieverFactory
    {
        INoteItemsRetriever Retriever(
            INoteDirsPairConfig config);
    }

    public class NoteItemsRetrieverFactory : INoteItemsRetrieverFactory
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IDriveItemsRetriever dvItemsRetriever;
        private readonly IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;
        private readonly INoteJsonDeserializer noteJsonDeserializer;

        public NoteItemsRetrieverFactory(
            IJsonConversion jsonConversion,
            IDriveItemsRetriever dvExplrSvc,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteJsonDeserializer noteJsonDeserializer)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.dvItemsRetriever = dvExplrSvc ?? throw new ArgumentNullException(
                nameof(dvExplrSvc));

            this.existingDirPairsRetrieverFactory = existingDirPairsRetrieverFactory ?? throw new ArgumentNullException(
                nameof(existingDirPairsRetrieverFactory));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            this.noteJsonDeserializer = noteJsonDeserializer ?? throw new ArgumentNullException(
                nameof(noteJsonDeserializer));
        }

        public INoteItemsRetriever Retriever(
            INoteDirsPairConfig config) => new NoteItemsRetriever(
                jsonConversion,
                dvItemsRetriever,
                existingDirPairsRetrieverFactory.Retriever(config),
                noteCfgValuesRetriever,
                noteJsonDeserializer,
                config,
                noteCfgValuesRetriever.GetDirNamesRegexMap(
                    config.GetDirNames()));
    }
}

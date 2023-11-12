using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.TextSerialization;

namespace Turmerik.Notes
{
    public interface IExistingNoteDirPairsRetrieverFactory
    {
        IExistingNoteDirPairsRetriever Retriever(
            INoteDirsPairConfig config);
    }

    public class ExistingNoteDirPairsRetrieverFactory : IExistingNoteDirPairsRetrieverFactory
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IDriveItemsRetriever dvExplrSvc;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;
        private readonly INoteJsonDeserializer noteJsonDeserializer;

        public ExistingNoteDirPairsRetrieverFactory(
            IJsonConversion jsonConversion,
            IDriveItemsRetriever dvExplrSvc,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteJsonDeserializer noteJsonDeserializer)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(
                nameof(dvExplrSvc));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            this.noteJsonDeserializer = noteJsonDeserializer ?? throw new ArgumentNullException(
                nameof(noteJsonDeserializer));
        }

        public IExistingNoteDirPairsRetriever Retriever(
            INoteDirsPairConfig config) => new ExistingNoteDirPairsRetriever(
                jsonConversion,
                dvExplrSvc,
                noteCfgValuesRetriever,
                noteJsonDeserializer,
                config,
                noteCfgValuesRetriever.GetDirNamesRegexMap(
                    config.GetDirNames()));
    }
}

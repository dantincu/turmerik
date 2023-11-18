using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.TextSerialization;

namespace Turmerik.Notes
{
    public interface INoteDirsPairGeneratorFactory
    {
        INoteDirsPairGenerator Generator(
            INoteDirsPairConfig config);
    }

    public class NoteDirsPairGeneratorFactory : INoteDirsPairGeneratorFactory
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly INextNoteIdxRetriever nextNoteIdxRetriever;
        private readonly INoteItemsRetrieverFactory existingNoteDirPairsRetrieverFactory;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;

        public NoteDirsPairGeneratorFactory(
            IJsonConversion jsonConversion,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            INextNoteIdxRetriever nextNoteIdxRetriever,
            INoteItemsRetrieverFactory existingNoteDirPairsRetrieverFactory,
            INoteCfgValuesRetriever noteCfgValuesRetriever)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.nextNoteIdxRetriever = nextNoteIdxRetriever ?? throw new ArgumentNullException(
                nameof(nextNoteIdxRetriever));

            this.existingNoteDirPairsRetrieverFactory = existingNoteDirPairsRetrieverFactory ?? throw new ArgumentNullException(
                nameof(existingNoteDirPairsRetrieverFactory));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));
        }

        public INoteDirsPairGenerator Generator(
            INoteDirsPairConfig config) => new NoteDirsPairGenerator(
                jsonConversion,
                fsEntryNameNormalizer,
                nextNoteIdxRetriever,
                existingNoteDirPairsRetrieverFactory.Retriever(config),
                noteCfgValuesRetriever);
    }
}

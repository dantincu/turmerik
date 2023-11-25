using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.DriveExplorer.DirsPair
{
    public interface IDirsPairGeneratorFactory
    {
        DirsPairGenerator Create(
            INoteDirsPairConfig notesConfig);
    }

    public class DirsPairGeneratorFactory : IDirsPairGeneratorFactory
    {
        private readonly IDriveExplorerService dvExplrSvc;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory;
        private readonly INextNoteIdxRetriever nextNoteIdxRetriever;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;

        public DirsPairGeneratorFactory(
            IDriveExplorerService dvExplrSvc,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory,
            INextNoteIdxRetriever nextNoteIdxRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever)
        {
            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(
                nameof(dvExplrSvc));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.existingDirPairsRetrieverFactory = existingDirPairsRetrieverFactory ?? throw new ArgumentNullException(
                nameof(existingDirPairsRetrieverFactory));

            this.nextNoteIdxRetriever = nextNoteIdxRetriever ?? throw new ArgumentNullException(
                nameof(nextNoteIdxRetriever));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));
        }
        public DirsPairGenerator Create(
            INoteDirsPairConfig notesConfig) => new DirsPairGenerator(
                dvExplrSvc,
                fsEntryNameNormalizer,
                existingDirPairsRetrieverFactory.Retriever(
                    notesConfig),
                nextNoteIdxRetriever,
                noteCfgValuesRetriever);
    }
}

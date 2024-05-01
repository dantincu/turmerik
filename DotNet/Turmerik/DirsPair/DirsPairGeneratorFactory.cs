using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.TextSerialization;
using Turmerik.Notes.Core;

namespace Turmerik.DirsPair
{
    public interface IDirsPairGeneratorFactory
    {
        DirsPairGenerator Create(
            INoteDirsPairConfig notesConfig);
    }

    public class DirsPairGeneratorFactory : IDirsPairGeneratorFactory
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IDriveExplorerService dvExplrSvc;
        private readonly IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory;
        private readonly INextNoteIdxRetriever nextNoteIdxRetriever;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;

        public DirsPairGeneratorFactory(
            IJsonConversion jsonConversion,
            IDriveExplorerService dvExplrSvc,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory,
            INextNoteIdxRetriever nextNoteIdxRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(
                nameof(dvExplrSvc));

            this.existingDirPairsRetrieverFactory = existingDirPairsRetrieverFactory ?? throw new ArgumentNullException(
                nameof(existingDirPairsRetrieverFactory));

            this.nextNoteIdxRetriever = nextNoteIdxRetriever ?? throw new ArgumentNullException(
                nameof(nextNoteIdxRetriever));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));
        }

        public DirsPairGenerator Create(
            INoteDirsPairConfig notesConfig) => new DirsPairGenerator(
                jsonConversion,
                dvExplrSvc,
                existingDirPairsRetrieverFactory.Retriever(
                    notesConfig),
                nextNoteIdxRetriever,
                noteCfgValuesRetriever,
                notesConfig);
    }
}

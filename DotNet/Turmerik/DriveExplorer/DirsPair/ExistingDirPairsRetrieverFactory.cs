using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.DriveExplorer.DirsPair
{
    public interface IExistingDirPairsRetrieverFactory
    {
        IExistingDirPairsRetriever Retriever(
            INoteDirsPairConfig notesConfig);
    }

    public class ExistingDirPairsRetrieverFactory : IExistingDirPairsRetrieverFactory
    {
        private readonly IDriveItemsRetriever driveItemsRetriever;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;
        private readonly INoteDirsPairIdxRetriever noteDirsPairIdxRetriever;

        public ExistingDirPairsRetrieverFactory(
            IDriveItemsRetriever driveItemsRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteDirsPairIdxRetriever noteDirsPairIdxRetriever)
        {
            this.driveItemsRetriever = driveItemsRetriever ?? throw new ArgumentNullException(
                nameof(driveItemsRetriever));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            this.noteDirsPairIdxRetriever = noteDirsPairIdxRetriever ?? throw new ArgumentNullException(
                nameof(noteDirsPairIdxRetriever));
        }

        public IExistingDirPairsRetriever Retriever(
            INoteDirsPairConfig config) => new ExistingDirPairsRetriever(
                driveItemsRetriever,
                noteCfgValuesRetriever,
                noteDirsPairIdxRetriever,
                noteCfgValuesRetriever.GetDirNamesRegexMap(
                    config.GetDirNames()),
                config);
    }
}

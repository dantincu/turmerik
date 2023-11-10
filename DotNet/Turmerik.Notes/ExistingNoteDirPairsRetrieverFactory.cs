using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes
{
    public interface IExistingNoteDirPairsRetrieverFactory
    {
        IExistingNoteDirPairsRetriever Retriever(
            INoteDirsPairConfig config);
    }

    public class ExistingNoteDirPairsRetrieverFactory : IExistingNoteDirPairsRetrieverFactory
    {
        private readonly IDriveExplorerService dvExplrSvc;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;

        public ExistingNoteDirPairsRetrieverFactory(
            IDriveExplorerService dvExplrSvc,
            INoteCfgValuesRetriever noteCfgValuesRetriever)
        {
            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(nameof(dvExplrSvc));
            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(nameof(noteCfgValuesRetriever));
        }

        public IExistingNoteDirPairsRetriever Retriever(
            INoteDirsPairConfig config) => new ExistingNoteDirPairsRetriever(
                dvExplrSvc,
                noteCfgValuesRetriever,
                config,
                noteCfgValuesRetriever.GetDirNamesRegexMap(
                    config.GetDirNames()));
    }
}

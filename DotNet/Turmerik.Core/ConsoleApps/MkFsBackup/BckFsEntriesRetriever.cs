using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.FileSystem;

namespace Turmerik.Core.ConsoleApps.MkFsBackup
{
    public interface IBckFsEntriesRetriever
    {
        BckFsEntriesRetrieverResult Retrieve(
            BckFsEntriesRetrieverOpts opts);
    }

    public class BckFsEntriesRetriever : IBckFsEntriesRetriever
    {
        private IFilteredFsEntriesRetriever filteredFsEntriesRetriever;

        public BckFsEntriesRetriever(
            IFilteredFsEntriesRetriever filteredFsEntriesRetriever)
        {
            this.filteredFsEntriesRetriever = filteredFsEntriesRetriever ?? throw new ArgumentNullException(nameof(filteredFsEntriesRetriever));
        }

        public BckFsEntriesRetrieverResult Retrieve(
            BckFsEntriesRetrieverOpts opts)
        {
            throw new NotImplementedException();
        }
    }
}

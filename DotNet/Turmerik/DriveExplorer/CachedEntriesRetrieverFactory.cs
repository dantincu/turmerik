using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public interface ICachedEntriesRetrieverFactory
    {
        ICachedFsEntriesRetriever FsEntriesRetriever(
            DriveItem rootFolder,
            char dirSeparator);

        ICachedCsEntriesRetriever FsEntriesRetriever(
            DriveItem rootFolder);
    }

    public class CachedEntriesRetrieverFactory : ICachedEntriesRetrieverFactory
    {
        public ICachedFsEntriesRetriever FsEntriesRetriever(
            DriveItem rootFolder,
            char dirSeparator) => new CachedFsEntriesRetriever(
                rootFolder, dirSeparator);

        public ICachedCsEntriesRetriever FsEntriesRetriever(
            DriveItem rootFolder) => new CachedCsEntriesRetriever(
                rootFolder);
    }
}

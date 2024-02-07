using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFsExplorerServiceFactory
    {
        IFsItemsRetriever Retriever(
            bool allowSysFolders = false,
            string rootDirPath = null);

        IFsExplorerService Explorer(
            bool allowSysFolders = false,
            string rootDirPath = null);
    }

    public class FsExplorerServiceFactory : IFsExplorerServiceFactory
    {
        private readonly ITimeStampHelper timeStampHelper;

        public FsExplorerServiceFactory(
            ITimeStampHelper timeStampHelper)
        {
            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(nameof(timeStampHelper));
        }

        public IFsItemsRetriever Retriever(
            bool allowSysFolders = false,
            string rootDirPath = null) => new FsItemsRetriever(
                timeStampHelper)
            {
                AllowSysFolders = allowSysFolders,
                RootDirPath = rootDirPath
            };

        public IFsExplorerService Explorer(
            bool allowSysFolders = false,
            string rootDirPath = null) => new FsExplorerService(
                timeStampHelper)
            {
                AllowSysFolders = allowSysFolders,
                RootDirPath = rootDirPath
            };
    }
}

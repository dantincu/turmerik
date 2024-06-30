using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.TextParsing;
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
        private readonly IPascalOrCamelCaseToWordsConverter pascalOrCamelCaseToWordsConverter;

        public FsExplorerServiceFactory(
            ITimeStampHelper timeStampHelper,
            IPascalOrCamelCaseToWordsConverter pascalOrCamelCaseToWordsConverter)
        {
            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(
                nameof(timeStampHelper));

            this.pascalOrCamelCaseToWordsConverter = pascalOrCamelCaseToWordsConverter ?? throw new ArgumentNullException(
                nameof(pascalOrCamelCaseToWordsConverter));
        }

        public IFsItemsRetriever Retriever(
            bool allowSysFolders = false,
            string rootDirPath = null) => new FsItemsRetriever(
                timeStampHelper,
                pascalOrCamelCaseToWordsConverter)
            {
                AllowSysFolders = allowSysFolders,
                RootDirPath = rootDirPath
            };

        public IFsExplorerService Explorer(
            bool allowSysFolders = false,
            string rootDirPath = null) => new FsExplorerService(
                timeStampHelper,
                pascalOrCamelCaseToWordsConverter)
            {
                AllowSysFolders = allowSysFolders,
                RootDirPath = rootDirPath
            };
    }
}

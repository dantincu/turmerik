using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFilteredDriveEntriesRetriever
    {
        Task<DataTreeNodeMtbl<FilteredDriveEntries>> FindMatchingAsync(
            FilteredDriveRetrieverMatcherOpts opts);
    }

    public class FilteredDriveEntriesRetriever : IFilteredDriveEntriesRetriever
    {
        private readonly IDriveItemsRetriever driveItemsRetriever;

        public FilteredDriveEntriesRetriever(
            IDriveItemsRetriever driveItemsRetriever)
        {
            this.driveItemsRetriever = driveItemsRetriever ?? throw new ArgumentNullException(
                nameof(driveItemsRetriever));
        }

        public async Task<DataTreeNodeMtbl<FilteredDriveEntries>> FindMatchingAsync(
            FilteredDriveRetrieverMatcherOpts opts)
        {
            opts = NormalizeOpts(opts);

            var prFolder = await driveItemsRetriever.GetFolderAsync(
                opts.PrFolderIdnf, false);

            var retNode = ToDataTreeNode(prFolder);
            await FindMatchingAsync(opts, retNode, "/");

            if (opts.CheckRetNodeValidityDepth.HasValue)
            {
                FilteredDriveEntriesH.AssertTreeNodeIsValid(
                    retNode, opts.CheckRetNodeValidityDepth.Value);
            }

            return retNode;
        }
        private async Task FindMatchingAsync(
            FilteredDriveRetrieverMatcherOpts opts,
            DataTreeNodeMtbl<FilteredDriveEntries> node,
            string prFolderPath)
        {
            var fsEntriesFilter = opts.FsEntriesFilter;

            FilterEntries(
                fsEntriesFilter,
                prFolderPath,
                node.Data.FilteredSubFolders,
                true);

            FilterEntries(
                fsEntriesFilter,
                prFolderPath,
                node.Data.FilteredFolderFiles,
                false);

            await RetrieveSubFolders(
                node.Data.FilteredSubFolders);

            node.ChildNodes = await FilterOutFolders(opts, prFolderPath,
                node.Data.FilteredSubFolders);

            if (opts.CheckRetNodeValidityDepth.HasValue)
            {
                FilteredDriveEntriesH.AssertTreeNodeIsValid(
                    node, opts.CheckRetNodeValidityDepth.Value);
            }
        }

        private DataTreeNodeMtbl<FilteredDriveEntries> ToDataTreeNode(
            DriveItem prFolder) => new DataTreeNodeMtbl<FilteredDriveEntries>(
                new FilteredDriveEntries
                {
                    PrFolderIdnf = prFolder.Idnf,
                    PrFolderName = prFolder.Name,
                    AllFolderFiles = prFolder.FolderFiles,
                    AllSubFolders = prFolder.SubFolders,
                    FilteredFolderFiles = prFolder.FolderFiles.ToList(),
                    FilteredSubFolders = prFolder.SubFolders.ToList(),
                }, null, new List<DataTreeNodeMtbl<FilteredDriveEntries>>());

        private async Task RetrieveSubFolders(
            List<DriveItem> subFolders)
        {
            for (int i = 0; i < subFolders.Count; i++)
            {
                subFolders[i] = await driveItemsRetriever.GetFolderAsync(
                    subFolders[i].Idnf, false);
            }
        }

        private async Task<List<DataTreeNodeMtbl<FilteredDriveEntries>>> FilterOutFolders(
            FilteredDriveRetrieverMatcherOpts opts,
            string prFolderPath,
            List<DriveItem> subFolders)
        {
            int j = 0;
            var retList = new List<DataTreeNodeMtbl<FilteredDriveEntries>>();

            while (j < subFolders.Count)
            {
                var node = await GetFolderNode(
                    opts, prFolderPath, subFolders[j]);

                if (node == null)
                {
                    subFolders.RemoveAt(j);
                }
                else
                {
                    retList.Add(node);
                    j++;
                }
            }

            return retList;
        }

        private async Task<DataTreeNodeMtbl<FilteredDriveEntries>> GetFolderNode(
            FilteredDriveRetrieverMatcherOpts opts,
            string prFolderPath,
            DriveItem folder)
        {
            string folderPath = CombinePaths(folder.Name, prFolderPath, true);
            var retNode = ToDataTreeNode(folder);

            await FindMatchingAsync(
                opts, retNode,
                folderPath);

            bool keepFolder = retNode.Data.FilteredFolderFiles.Any(
                ) || retNode.Data.FilteredSubFolders.Any();

            keepFolder = keepFolder || opts.FsEntriesFilter.IncludedRelPathRegexes.Any(
                regex => regex.IsMatch(folderPath));

            if (!keepFolder)
            {
                retNode = null;
            }

            return retNode;
        }

        private void FilterEntries(
            DriveEntriesFilter fsEntriesFilter,
            string prFolderPath,
            List<DriveItem> childEntries,
            bool isFolderEntry)
        {
            childEntries.RemoveWhere(
                entry =>
                {
                    string entryPath = CombinePaths(entry.Name, prFolderPath, isFolderEntry);

                    bool filterOut = fsEntriesFilter.ExcludedRelPathRegexes.Any(
                        regex => regex.IsMatch(entryPath));

                    if (!filterOut && !isFolderEntry)
                    {
                        filterOut = fsEntriesFilter.IncludedRelPathRegexes.None(
                            regex => regex.IsMatch(entryPath));
                    }

                    return filterOut;
                });
        }

        private FilteredDriveRetrieverMatcherOpts NormalizeOpts(
            FilteredDriveRetrieverMatcherOpts opts)
        {
            opts = new FilteredDriveRetrieverMatcherOpts(opts);
            opts.FsEntriesSerializableFilter ??= new FileSystem.DriveEntriesSerializableFilter();

            opts.FsEntriesFilter ??= new DriveEntriesFilter
            {
                IncludedRelPathRegexes = (opts.FsEntriesSerializableFilter.IncludedRelPathRegexes ?? new List<string> { ".*" }).Select(
                    regexStr => new Regex(regexStr)).ToList(),
                ExcludedRelPathRegexes = (opts.FsEntriesSerializableFilter.ExcludedRelPathRegexes ?? new List<string>()).Select(
                    regexStr => new Regex(regexStr)).ToList()
            };

            return opts;
        }

        private string CombinePaths(
            string entryName,
            string? prPath = null,
            bool isFolderEntry = false) => string.Concat(
                prPath ?? "/",
                entryName,
                isFolderEntry ? "/" : "");
    }
}

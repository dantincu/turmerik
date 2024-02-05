using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;
using Turmerik.Notes;

namespace Turmerik.DriveExplorer
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

            await FindMatchingAsync(opts, retNode,
                CombinePaths(prFolder.Name));

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
                node.Data.FilteredSubFolders);

            FilterEntries(
                fsEntriesFilter,
                prFolderPath,
                node.Data.FilteredFolderFiles);

            await RetrieveSubFolders(
                node.Data.FilteredSubFolders);

            await FilterOutFolders(opts, prFolderPath,
                node.Data.FilteredSubFolders);
        }

        private DataTreeNodeMtbl<FilteredDriveEntries> ToDataTreeNode(
            DriveItem prFolder) => new DataTreeNodeMtbl<FilteredDriveEntries>(
                new FilteredDriveEntries
                {
                    PrFolderIdnf = prFolder.Idnf,
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

        private async Task FilterOutFolders(
            FilteredDriveRetrieverMatcherOpts opts,
            string prFolderPath,
            List<DriveItem> subFolders)
        {
            int j = 0;

            while (j < subFolders.Count)
            {
                var keepFolder = await ShouldKeepFolderAsync(
                    opts, prFolderPath, subFolders[j]);

                if (!keepFolder)
                {
                    subFolders.RemoveAt(j);
                }
                else
                {
                    j++;
                }
            }
        }

        private async Task<bool> ShouldKeepFolderAsync(
            FilteredDriveRetrieverMatcherOpts opts,
            string prFolderPath,
            DriveItem folder)
        {
            string folderPath = CombinePaths(folder.Name, prFolderPath);

            await FindMatchingAsync(
                opts, ToDataTreeNode(folder),
                folderPath);

            bool keepFolder = folder.FolderFiles.Any() || folder.SubFolders.Any();

            keepFolder = keepFolder || opts.FsEntriesFilter.IncludedRelPathRegexes.Any(
                regex => regex.IsMatch(folderPath));

            return keepFolder;
        }

        private void FilterEntries(
            DriveEntriesFilter fsEntriesFilter,
            string prFolderPath,
            List<DriveItem> childEntries)
        {
            childEntries.RemoveWhere(
                (entry, i) =>
                {
                    string entryPath = CombinePaths(entry.Name, prFolderPath);

                    bool filterOut = fsEntriesFilter.ExcludedRelPathRegexes.Any(
                        regex => regex.IsMatch(entryPath));

                    return filterOut;
                });
        }

        private FilteredDriveRetrieverMatcherOpts NormalizeOpts(
            FilteredDriveRetrieverMatcherOpts opts)
        {
            opts = new FilteredDriveRetrieverMatcherOpts(opts);
            opts.FsEntriesSerializableFilter ??= new Core.FileSystem.DriveEntriesSerializableFilter();

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
            string? prPath = null) => $"{prPath ?? "/"}{entryName}/";
    }
}

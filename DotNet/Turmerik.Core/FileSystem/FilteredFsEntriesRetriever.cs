using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.Core.FileSystem
{
    public interface IFilteredFsEntriesRetriever
    {
        FsEntriesRetrieverArgs Retrieve(
            FilteredFsEntriesRetrieverOptions options);

        FsEntriesRetrieverOptions TranslateOpts(
            FilteredFsEntriesRetrieverOpts opts);

        FilteredFsEntriesRetrieverOpts GetOpts(
            FilteredFsEntriesRetrieverOptions options);
    }

    public class FilteredFsEntriesRetriever : IFilteredFsEntriesRetriever
    {
        private readonly IFsEntriesRetriever fsEntriesRetriever;
        private readonly IStrPartsMatcher strPartsMatcher;

        public FilteredFsEntriesRetriever(
            IFsEntriesRetriever fsEntriesRetriever, IStrPartsMatcher strPartsMatcher)
        {
            this.fsEntriesRetriever = fsEntriesRetriever ?? throw new ArgumentNullException(
                nameof(fsEntriesRetriever));

            this.strPartsMatcher = strPartsMatcher ?? throw new ArgumentNullException(
                nameof(strPartsMatcher));
        }

        public FsEntriesRetrieverArgs Retrieve(
            FilteredFsEntriesRetrieverOptions options)
        {
            var opts = GetOpts(options);
            var transOpts = TranslateOpts(opts);

            var retArgs = fsEntriesRetriever.Retrieve(transOpts);
            return retArgs;
        }

        public FsEntriesRetrieverOptions TranslateOpts(
            FilteredFsEntriesRetrieverOpts opts)
        {
            var nodesMap = new Dictionary<FsEntriesRetrieverNodeData, FilteredFsNode>();

            var options = new FsEntriesRetrieverOptions
            {
                RootDirPath = opts.RootDirPath,
                FsEntryPredicate = (args, node, idx) =>
                {
                    bool matches = !opts.ExcludedEntryNames.Contains(node.Name);

                    if (matches)
                    {
                        var parent = args.Current;

                        IEnumerable<PathFilter> potentialInlcuders;
                        IEnumerable<PathFilter> potentialExcluders;

                        if (parent == null)
                        {
                            potentialInlcuders = opts.IncludedPathFilters;
                            potentialExcluders = opts.ExcludedPathFilters;
                        }
                        else
                        {
                            var filteredParent = nodesMap[parent.Data.Value];
                            potentialInlcuders = filteredParent.MatchingIncluders;
                            potentialExcluders = filteredParent.MatchingExcluders;
                        }

                        Func<PathFilter, bool> filterMatchPredicate = filter => strPartsMatcher.Matches(
                            new StrPartsMatcherOptions
                            {
                                InputStr = node.Name,
                                StringComparison = StringComparison.InvariantCultureIgnoreCase,
                                StrParts = filter.PathSegments[args.LevelIdx].SegmentParts
                            });

                        Func<PathFilter, bool> filterLevelPredicate;

                        if (node.IsFolder != true)
                        {
                            filterLevelPredicate = filter => filter.PathSegments.Count - args.LevelIdx == 1;
                        }
                        else
                        {
                            filterLevelPredicate = filter => filter.PathSegments.Count - args.LevelIdx >= 1;
                        }

                        Func<PathFilter, bool> filterPredicate = filter => (
                            filter.PathSegments.Count - args.LevelIdx < 1) || (filterLevelPredicate(
                            filter) && filterMatchPredicate(filter));

                        potentialInlcuders = potentialInlcuders.Where(filterPredicate).ToArray();
                        matches = potentialInlcuders.Any();

                        if (matches)
                        {
                            potentialExcluders = potentialExcluders.Where(filterPredicate).ToArray();
                            matches = potentialExcluders.None();
                        }

                        if (matches)
                        {
                            var filteredFsNode = new FilteredFsNode(node);

                            filteredFsNode.MatchingIncluders.AddRange(potentialInlcuders);
                            filteredFsNode.MatchingExcluders.AddRange(potentialExcluders);

                            nodesMap.Add(node, filteredFsNode);
                        }
                    }

                    return matches;
                },
                NodePredicate = args => true,
                OnNodeChildrenIterated = (args, node) =>
                {
                    var treeNode = (args.Next ?? args.Current);
                    bool matches = treeNode.ChildNodes.Any();

                    if (!matches)
                    {
                        var filtered = nodesMap[node.Value];

                        matches = filtered.MatchingIncluders.Any(
                            includer => includer.PathSegments.Count - node.Value.LevelIdx == 1);

                        matches = matches && filtered.MatchingExcluders.None(
                            excluder => excluder.PathSegments.Count - node.Value.LevelIdx == 1);
                    }

                    return matches;
                }
            };

            return options;
        }

        public FilteredFsEntriesRetrieverOpts GetOpts(
            FilteredFsEntriesRetrieverOptions options) => new FilteredFsEntriesRetrieverOpts
            {
                RootDirPath = options.RootDirPath,
                IncludedPathFilters = GetPathFilters(options, options.IncludedPathFilters, options.IncludedPaths, true),
                ExcludedPathFilters = GetPathFilters(options, options.ExcludedPathFilters, options.ExcludedPaths, false),
                ExcludedEntryNames = (options?.ExcludedEntryNames ?? []).RdnlC()
            };

        private ReadOnlyCollection<PathFilter> GetPathFilters(
            FilteredFsEntriesRetrieverOptions options,
            IEnumerable<PathFilter>? existingFilters,
            IEnumerable<string>? pathsNmrbl,
            bool includeAllByDefault) => GetPathFiltersNmrbl(
                options, existingFilters, pathsNmrbl, includeAllByDefault).RdnlC();

        private IEnumerable<PathFilter> GetPathFiltersNmrbl(
            FilteredFsEntriesRetrieverOptions options,
            IEnumerable<PathFilter>? existingFilters,
            IEnumerable<string>? pathsNmrbl,
            bool includeAllByDefault) => GetPathFiltersNmrbl(
                options, existingFilters, pathsNmrbl) ?? GetDefaultPathFiltersNmrbl(
                    options, includeAllByDefault);

        private IEnumerable<PathFilter>? GetPathFiltersNmrbl(
            FilteredFsEntriesRetrieverOptions options,
            IEnumerable<PathFilter>? existingFilters,
            IEnumerable<string>? pathsNmrbl) => existingFilters ?? GetPathFiltersNmrbl(
                options, pathsNmrbl);

        private IEnumerable<PathFilter>? GetPathFiltersNmrbl(
            FilteredFsEntriesRetrieverOptions options,
            IEnumerable<string>? pathsNmrbl) => pathsNmrbl?.Select(
                path => PathFilterH.PathFilter(
                    path, GetWildcardChar(options),
                    options.PathSeparators));

        private IEnumerable<PathFilter> GetDefaultPathFiltersNmrbl(
            FilteredFsEntriesRetrieverOptions options,
            bool includeAllByDefault
            ) => PathFilterH.PathFilter(GetDefaultFilterSegment(
                options, includeAllByDefault).Arr()).Arr();

        private string GetDefaultFilterSegment(
            FilteredFsEntriesRetrieverOptions options,
            bool includeAllByDefault) => includeAllByDefault ? GetWildcardChar(options).ToString() : string.Empty;

        private char GetWildcardChar(
            FilteredFsEntriesRetrieverOptions options) => options.WildcardChar.Nullify(
                ) ?? PathFilterH.WILDCARD_CHAR;
    }
}

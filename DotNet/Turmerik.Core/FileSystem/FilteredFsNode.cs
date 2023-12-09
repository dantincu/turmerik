using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class FilteredFsNode
    {
        public FilteredFsNode(
            FsEntriesRetrieverNodeData nodeData)
        {
            NodeData = nodeData ?? throw new ArgumentNullException(
                nameof(nodeData));

            MatchingIncluders = new List<PathFilter>();
            MatchingExcluders = new List<PathFilter>();
        }

        public FsEntriesRetrieverNodeData NodeData { get; }
        public List<PathFilter> MatchingIncluders { get; }
        public List<PathFilter> MatchingExcluders { get; }
    }
}

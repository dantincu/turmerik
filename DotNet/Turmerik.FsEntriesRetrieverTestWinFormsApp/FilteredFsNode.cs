using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;

namespace Turmerik.FsEntriesRetrieverTestWinFormsApp
{
    public class FilteredFsNode
    {
        public FilteredFsNode(
            FsEntriesRetrieverNodeData nodeData)
        {
            NodeData = nodeData ?? throw new ArgumentNullException(
                nameof(nodeData));

            MatchingIncluders = new List<string[][]>();
            MatchingExcluders = new List<string[][]>();
        }

        public FsEntriesRetrieverNodeData NodeData { get; }
        public List<string[][]> MatchingIncluders { get; }
        public List<string[][]> MatchingExcluders { get; }
    }
}

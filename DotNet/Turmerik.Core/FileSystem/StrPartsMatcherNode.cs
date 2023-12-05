using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public class StrPartsMatcherNode : DataTreeGeneratorNode<StrPartsMatcherNodeData, StrPartsMatcherNode, StrPartsMatcherOpts, StrPartsMatcherArgs>
    {
        public StrPartsMatcherNode(
            StrPartsMatcherNodeData value,
            TryRetrieve1<StrPartsMatcherArgs, StrPartsMatcherNode, StrPartsMatcherNode> nextChildNodeRetriever) : base(
                value,
                nextChildNodeRetriever)
        {
        }
    }
}

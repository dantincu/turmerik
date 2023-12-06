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
            Func<StrPartsMatcherArgs, TryRetrieve1In1Out<StrPartsMatcherArgs, StrPartsMatcherNode>> nextChildNodeRetriever) : base(
                value,
                nextChildNodeRetriever)
        {
        }
    }
}

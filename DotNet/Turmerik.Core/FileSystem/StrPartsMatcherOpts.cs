using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public class StrPartsMatcherOpts : DataTreeGeneratorOpts<StrPartsMatcherNodeData, StrPartsMatcherNode, StrPartsMatcherOpts, StrPartsMatcherArgs>
    {
        public StrPartsMatcherOpts(
            Func<StrPartsMatcherOpts, StrPartsMatcherArgs> argsFactory,
            TryRetrieve<StrPartsMatcherArgs, StrPartsMatcherNode> nextRootNodeRetriever,
            Func<StrPartsMatcherArgs, DataTreeGeneratorStepData> nextStepPredicate) : base(
                argsFactory,
                nextRootNodeRetriever,
                nextStepPredicate)
        {
        }

        public string InputStr { get; set; }
        public string[] StrParts { get; set; }
        public StringComparison? StringComparison { get; set; }
    }
}

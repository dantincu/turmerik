using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public class StrPartsMatcherOpts : DataTreeGeneratorOpts<StrPartsMatcherNodeData, StrPartsMatcherNode, StrPartsMatcherOpts, StrPartsMatcherArgs>
    {
        public StrPartsMatcherOpts(
            Func<StrPartsMatcherOpts, StrPartsMatcherArgs> argsFactory,
            TryRetrieve1In1Out<StrPartsMatcherArgs, StrPartsMatcherNode> nextRootNodeRetriever,
            Func<StrPartsMatcherArgs, DataTreeGeneratorStepData> nextStepPredicate,
            StrPartsMatcherOptions inputOpts) : base(
                argsFactory,
                nextRootNodeRetriever,
                nextStepPredicate)
        {
            InputStr = inputOpts.InputStr;
            StrParts = inputOpts.StrParts.RdnlC();
            StringComparison = inputOpts.StringComparison.Value;
        }

        public string InputStr { get; }
        public ReadOnlyCollection<string> StrParts { get; }
        public StringComparison StringComparison { get; }
    }
}

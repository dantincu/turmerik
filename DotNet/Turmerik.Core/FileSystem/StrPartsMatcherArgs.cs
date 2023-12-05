using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public class StrPartsMatcherArgs : DataTreeGeneratorArgs<StrPartsMatcherNodeData, StrPartsMatcherNode, StrPartsMatcherOpts, StrPartsMatcherArgs>
    {
        public StrPartsMatcherArgs(StrPartsMatcherOpts opts) : base(opts)
        {
            PartsQueue = new Queue<StrPartsMatcherNodeData>();
        }

        public Queue<StrPartsMatcherNodeData> PartsQueue { get; }
    }
}

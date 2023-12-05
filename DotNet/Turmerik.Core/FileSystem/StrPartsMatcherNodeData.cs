using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class StrPartsMatcherNodeData
    {
        public StrPartsMatcherNodeData(
            int charStIdx,
            int childLevelIdx)
        {
            CharStIdx = charStIdx;
            ChildLevelIdx = childLevelIdx;
        }

        public int CharStIdx { get; }
        public int ChildLevelIdx { get; }
        public int ChildCharStIdx { get; set; }
    }
}

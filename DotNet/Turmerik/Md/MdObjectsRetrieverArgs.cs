using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Md
{
    public class MdObjectsRetrieverArgs : DataTreeGeneratorArgs<MarkdownObject, MdObjectsRetrieverNode, MdObjectsRetrieverOpts, MdObjectsRetrieverArgs>
    {
        public MdObjectsRetrieverArgs(MdObjectsRetrieverOpts opts) : base(opts)
        {
        }
    }
}

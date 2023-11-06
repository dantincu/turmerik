using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes.Md
{
    public class MdObjectsRetrieverArgs
    {
        public MdObjectsRetrieverOpts<MarkdownObject> Opts { get; init; }
        public Dictionary<int[], MarkdownObject> RetMap { get; init; }
        public List<int> Path { get; init; }
        public Stack<MarkdownObject> Stack { get; init; }
        public int Idx { get; set; }
        public MarkdownObject Parent { get; set; }
        public MarkdownObject Current { get; set; }
    }
}

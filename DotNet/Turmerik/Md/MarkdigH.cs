using Markdig;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Md
{
    public static class MarkdigH
    {
        public static MarkdownPipeline GetMarkdownPipeline()
        {
            var pipeline = new MarkdownPipelineBuilder();
            MarkdownPipeline markdownPipeline = pipeline.UsePipeTables().Build();

            return markdownPipeline;
        }
    }
}

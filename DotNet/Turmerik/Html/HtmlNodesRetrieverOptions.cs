﻿using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Html
{
    public class HtmlNodesRetrieverOptions
    {
        public HtmlNodesRetrieverOptions()
        {
        }

        public HtmlNodesRetrieverOptions(
            HtmlNodesRetrieverOptions src)
        {
            Text = src.Text;
            HtmlDoc = src.HtmlDoc;
            RootNodes = src.RootNodes;
            NextStepPredicate = src.NextStepPredicate;
        }

        public string Text { get; init; }
        public HtmlDocument HtmlDoc { get; init; }
        public IEnumerator<HtmlNode> RootNodes { get; init; }
        public Func<HtmlNodesRetrieverArgs, DataTreeGeneratorStepData> NextStepPredicate { get; init; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public interface IStrPartsMatcher
    {
        bool Matches(
            StrPartsMatcherOptions opts);
    }

    public class StrPartsMatcher : IStrPartsMatcher
    {
        private readonly IDataTreeGenerator dataTreeGenerator;

        public StrPartsMatcher(
            IDataTreeGeneratorFactory dataTreeGeneratorFactory)
        {
            this.dataTreeGenerator = dataTreeGeneratorFactory.Default;
        }

        public bool Matches(
            StrPartsMatcherOptions inOpts)
        {
            inOpts = new StrPartsMatcherOptions(inOpts)
            {
                InputStr = inOpts.InputStr,
                StrParts = inOpts.StrParts,
                StringComparison = inOpts.StringComparison ?? StringComparison.InvariantCulture,
            };

            var strParts = inOpts.StrParts;
            int partsCount = strParts.Count();
            bool matches = partsCount == 0;

            if (!matches)
            {
                if (partsCount == 1)
                {
                    matches = SinglePartMatches(
                        inOpts, strParts.Single());
                }
                else
                {
                    string firstPart = strParts[0];
                    bool matchesAnyStart = string.IsNullOrEmpty(firstPart);
                    bool isSettled = !matchesAnyStart;

                    if (isSettled)
                    {
                        if (inOpts.InputStr.StartsWith(
                            firstPart))
                        {
                            isSettled = false;
                        }
                    }

                    if (!isSettled)
                    {
                        var opts = CreateOpts(inOpts, matchesAnyStart);
                        matches = dataTreeGenerator.GetNodes<StrPartsMatcherNodeData, StrPartsMatcherNode, StrPartsMatcherOpts, StrPartsMatcherArgs>(opts).Matches;
                    }
                }
            }

            return matches;
        }

        private StrPartsMatcherOpts CreateOpts(
            StrPartsMatcherOptions inOpts,
            bool matchesAnyStart)
        {
            int maxLevel = inOpts.StrParts.Length - 1;
            string firstPart = inOpts.StrParts.First();

            Func<StrPartsMatcherArgs, TryRetrieve1In1Out < StrPartsMatcherArgs, StrPartsMatcherNode>> rootNodesRetrieverFactory = null;
            Func < StrPartsMatcherArgs, TryRetrieve1In1Out<StrPartsMatcherArgs, StrPartsMatcherNode>> childNodesRetriever = null;
            Func<StrPartsMatcherArgs, DataTreeGeneratorStepData> nextStepPredicate;

            if (matchesAnyStart)
            {
                rootNodesRetrieverFactory = args => ((IEnumerable<string>)inOpts.StrParts.First().Arr()).GetEnumerator().GetRetriever(
                    str => new StrPartsMatcherNode(CreateData(0, 0), childNodesRetriever), default(StrPartsMatcherArgs))!;
            }
            else
            {
                rootNodesRetrieverFactory = args => (StrPartsMatcherArgs args, out StrPartsMatcherNode node) =>
                {
                    args.FirstPartStIdx = args.Opts.InputStr.IndexOf(
                        firstPart, args.FirstPartStIdx + 1,
                        args.Opts.StringComparison);

                    bool hasValue = args.FirstPartStIdx >= 0;

                    if (hasValue)
                    {
                        node = new StrPartsMatcherNode(
                            CreateData(args.FirstPartStIdx, 0),
                            childNodesRetriever);
                    }
                    else
                    {
                        node = null;
                    }

                    return hasValue;
                };
            }

            childNodesRetriever = a => (StrPartsMatcherArgs args, out StrPartsMatcherNode nextNode) =>
            {
                var currentData = args.Current.Data.Value;
                var opts = args.Opts;
                int nextLevel = currentData.ChildLevelIdx + 1;

                currentData.ChildCharStIdx = opts.InputStr.IndexOf(
                    opts.StrParts[nextLevel],
                    currentData.ChildCharStIdx + 1,
                    opts.StringComparison);

                bool hasValue = currentData.ChildLevelIdx >= 0;

                if (hasValue)
                {
                    nextNode = new StrPartsMatcherNode(
                        CreateData(
                            currentData.ChildCharStIdx,
                            nextLevel),
                        childNodesRetriever);
                }
                else
                {
                    nextNode = null;
                }

                return hasValue;
            };

            nextStepPredicate = args =>
            {
                DataTreeGeneratorStepData nextStep;

                var currentData = args.Current?.Data;
                var currentValue = currentData?.Value ?? CreateData(0, 0);

                var opts = args.Opts;
                int nextLevel = currentValue.ChildLevelIdx + 1;
                var nextPart = opts.StrParts[nextLevel];

                if (nextLevel == maxLevel)
                {
                    nextStep = DataTreeGeneratorStep.Next.ToData(
                        LastPartMatches(opts, nextPart, currentValue));

                    args.Matches = nextStep.Matches;
                    args.Stop = true;
                }
                else
                {
                    nextStep = DataTreeGeneratorStep.Push.ToData();
                }

                return nextStep;
            };

            var opts = new StrPartsMatcherOpts(
                o => new StrPartsMatcherArgs(o)
                {
                    FirstPartStIdx = -1
                }, rootNodesRetrieverFactory, nextStepPredicate, inOpts);

            return opts;
        }

        private bool LastPartMatches(
            StrPartsMatcherOpts opts,
            string lastPart,
            StrPartsMatcherNodeData currentValue)
        {
            bool matches = string.IsNullOrEmpty(lastPart);

            if (!matches)
            {
                string prevPart = opts.StrParts[currentValue.ChildLevelIdx];

                string inputStrEnd = opts.InputStr.Substring(
                    currentValue.CharStIdx + prevPart.Length);

                matches = inputStrEnd.EndsWith(
                    lastPart, opts.StringComparison);
            }

            return matches;
        }

        private bool SinglePartMatches(
            StrPartsMatcherOptions opts,
            string singlePart) => !string.IsNullOrEmpty(
                singlePart) && string.Compare(
                    opts.InputStr,
                    singlePart,
                    opts.StringComparison.Value) == 0;

        private StrPartsMatcherNodeData CreateData(
            int charStIdx,
            int childLevelIdx) => new StrPartsMatcherNodeData(
                charStIdx, childLevelIdx);
    }
}

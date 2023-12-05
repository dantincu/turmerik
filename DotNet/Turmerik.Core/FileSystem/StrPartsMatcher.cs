using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public interface IStrPartsMatcher
    {
        bool Matches(
            StrPartsMatcherOpts opts);
    }

    public class StrPartsMatcher : IStrPartsMatcher
    {
        private readonly IDataTreeGenerator dataTreeGenerator;

        public StrPartsMatcher(
            IDataTreeGenerator dataTreeGenerator)
        {
            this.dataTreeGenerator = dataTreeGenerator ?? throw new ArgumentNullException(nameof(dataTreeGenerator));
        }

        public bool Matches(
            StrPartsMatcherOpts opts) => opts.ActWith(nOpts =>
            {
                /* opts.StringComparison ??= StringComparison.InvariantCulture;

                opts.ChildrenNmrblFactory = opts.ChildrenNmrblFactory.FirstNotNull(
                    args => args.PartsQueue);

                opts.ArgsFactory = opts.ArgsFactory.FirstNotNull(opts => new StrPartsMatcherArgs(opts).ActWith(args =>
                {
                    args.PartsQueue.Enqueue(CreateData(0, 0));
                }));

                opts.NextStepPredicate = opts.NextStepPredicate.FirstNotNull(args =>
                {
                    var nextStep = DataTreeGeneratorStep.Push.ToData();
                    var opts = args.Opts;

                    var parentData = args.Parent?.Data ?? args.PartsQueue.Dequeue();

                    int charStIdx = parentData.ChildCharStIdx;
                    int levelIdx = parentData.ChildLevelIdx;
                    int refLen = opts.StrParts.Length;
                    int maxLevel = refLen - 1;

                    if (levelIdx == 0)
                    {
                        if (charStIdx == 0 && !string.IsNullOrEmpty(
                            opts.StrParts.First()))
                        {
                            if (opts.StrParts.Length > 1 && !opts.InputStr.StartsWith(
                                opts.StrParts[1], opts.StringComparison.Value))
                            {
                                nextStep = DataTreeGeneratorStep.Next.ToData();
                                args.Stop = true;
                            }
                        }
                    }
                    else if (levelIdx == maxLevel)
                    {
                        string lastPart = opts.StrParts.Last();

                        if (string.IsNullOrEmpty(lastPart) || opts.InputStr.EndsWith(
                            lastPart, opts.StringComparison.Value))
                        {
                            nextStep = DataTreeGeneratorStep.Next.ToData(true);
                            args.Stop = true;
                        }
                        else
                        {
                            nextStep = DataTreeGeneratorStep.Pop.ToData();
                            parentData.ChildCharStIdx++;
                        }
                    }

                    if (!args.Stop)
                    {
                        int nextCharIdx = opts.InputStr.IndexOf(
                            opts.StrParts[levelIdx],
                            charStIdx);

                        if (nextCharIdx >= 0)
                        {
                            nextStep = DataTreeGeneratorStep.Push.ToData();

                            args.PartsQueue.Enqueue(
                                CreateData(nextCharIdx, levelIdx + 1));
                        }
                        else
                        {
                            nextStep = DataTreeGeneratorStep.Pop.ToData();
                            parentData.ChildCharStIdx++;
                        }
                    }

                    return nextStep;
                }); */
            }).With(nOpts => dataTreeGenerator.GetNodes<StrPartsMatcherNodeData, StrPartsMatcherNode, StrPartsMatcherOpts, StrPartsMatcherArgs>(nOpts).RootNodes.Any());

        private StrPartsMatcherNodeData CreateData(
            int charStIdx,
            int childLevelIdx) => new StrPartsMatcherNodeData(
                charStIdx, childLevelIdx);
    }
}

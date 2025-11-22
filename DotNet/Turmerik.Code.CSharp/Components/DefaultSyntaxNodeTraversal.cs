using Markdig.Extensions.Footnotes;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Turmerik.Code.CSharp.Components.SyntaxNodeTraversal;

namespace Turmerik.Code.CSharp.Components
{
    public interface ISyntaxNodeTraversal
    {
        public WorkArgs<TWorkStep> Traverse<TWorkStep>(
            TraverseOpts<TWorkStep> opts)
            where TWorkStep : WorkStep<TWorkStep>, new();
    }

    public static class SyntaxNodeTraversal
    {
        public class TraverseOpts<TWorkStep>
            where TWorkStep : WorkStep<TWorkStep>, new()
        {
            public SyntaxNode RootNode { get; set; }
            public Action<WorkArgs<TWorkStep>> InitAction { get; set; }
            public Action<WorkArgs<TWorkStep>> StepAction { get; set; }
            public Action<WorkArgs<TWorkStep>> StepTokenAction { get; set; }
            public Action<WorkArgs<TWorkStep>> StepAfterChildrenAction { get; set; }
        }

        public class WorkArgs<TWorkStep>
            where TWorkStep : WorkStep<TWorkStep>, new()
        {
            public TraverseOpts<TWorkStep> Opts { get; set; }
            public TWorkStep RootStep { get; set; }
            public Stack<TWorkStep> PrevParentSteps { get; set; }
            public TWorkStep? ParentStep { get; set; }
            public TWorkStep? CurrentStep { get; set; }
            public SyntaxToken? CurrentToken { get; set; }
            public bool IsRoot { get; set; }
        }

        public class WorkStep<TWorkStep>
            where TWorkStep : WorkStep<TWorkStep>, new()
        {
            public SyntaxNode Node { get; set; }
            public SyntaxKind NodeKind { get; set; }
            public List<SyntaxToken> LeadingTokens { get; set; }
            public List<TWorkStep> Children { get; set; }
            public List<SyntaxToken> LastChildTrailingTokens { get; set; }
        }

        public class WorkStep : WorkStep<WorkStep>
        {
        }
    }

    public class DefaultSyntaxNodeTraversal : ISyntaxNodeTraversal
    {
        public WorkArgs<TWorkStep> Traverse<TWorkStep>(
            TraverseOpts<TWorkStep> opts)
            where TWorkStep : WorkStep<TWorkStep>, new()
        {
            opts.InitAction ??= wka => { };
            opts.StepAction ??= wka => { };
            opts.StepTokenAction ??= wka => { };
            opts.StepAfterChildrenAction ??= wka => { };

            var wka = new WorkArgs<TWorkStep>
            {
                Opts = opts,
                PrevParentSteps = new(),
                IsRoot = true,
            };

            wka.RootStep = CreateStep(wka, opts.RootNode, new());
            wka.CurrentStep = wka.RootStep;

            opts.InitAction(wka);
            Run(wka);
            return wka;
        }

        private void Run<TWorkStep>(WorkArgs<TWorkStep> wka)
            where TWorkStep : WorkStep<TWorkStep>, new()
        {
            wka.Opts.StepAction(wka);
            var childNodesList = wka.CurrentStep.Node.ChildNodesAndTokens();

            if (wka.IsRoot)
            {
                wka.IsRoot = false;
            }
            else
            {
                if (wka.ParentStep != null)
                {
                    wka.PrevParentSteps.Push(wka.ParentStep);
                }
            }

            wka.ParentStep = wka.CurrentStep;
            wka.CurrentStep = null;
            var tokensList = new List<SyntaxToken>();

            foreach (var childNode in childNodesList)
            {
                if (childNode.IsToken)
                {
                    wka.CurrentToken = childNode.AsToken();
                    wka.Opts.StepTokenAction(wka);
                    tokensList.Add(wka.CurrentToken.Value);
                    wka.CurrentToken = null;
                }
                else
                {
                    wka.ParentStep.Children.Add(
                        wka.CurrentStep = CreateStep(
                            wka, childNode.AsNode()!, tokensList));

                    Run(wka);
                    wka.CurrentStep = null;
                    tokensList = new();
                }
            }

            wka.ParentStep.LastChildTrailingTokens = tokensList;
            wka.Opts.StepAfterChildrenAction(wka);
            wka.CurrentStep = wka.ParentStep!;

            if (wka.PrevParentSteps.Any())
            {
                wka.ParentStep = wka.PrevParentSteps.Pop();
            }
            else
            {
                wka.ParentStep = null;
                wka.IsRoot = true;
            }
        }

        private TWorkStep CreateStep<TWorkStep>(WorkArgs<TWorkStep> wka, SyntaxNode node, List<SyntaxToken> tokensList)
            where TWorkStep : WorkStep<TWorkStep>, new()
        {
            var step = new TWorkStep
            {
                Node = node,
                NodeKind = node.Kind(),
                LeadingTokens = tokensList,
                Children = new()
            };

            return step;
        }
    }
}

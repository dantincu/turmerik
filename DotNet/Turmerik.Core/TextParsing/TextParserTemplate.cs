using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.TextParsing
{
    public interface ITextParserTemplate
    {
        TArgs GetNodes<TNode, TArgs>(
            TextParserTemplateOpts<TNode, TArgs> opts)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>;

        void GetNodes<TNode, TArgs>(
            TArgs args)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>;

        bool GetNodes<TNode, TArgs>(
            TArgs args,
            ref StepData nextStep,
            DataTreeNode<TNode> treeNode)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>;
    }

    public class TextParserTemplate : ITextParserTemplate
    {
        public TArgs GetNodes<TNode, TArgs>(
            TextParserTemplateOpts<TNode, TArgs> opts)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>
        {
            opts.ArgsFactory ??= o => o.CreateFromSrc<TArgs>();
            opts.NextStepPredicate ??= args => Step.Push.ToData(true);

            var args = opts.ArgsFactory(opts);
            GetNodes<TNode, TArgs>(args);

            return args;
        }

        public void GetNodes<TNode, TArgs>(
            TArgs args)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>
        {
            StepData nextStep = default;
            var children = args.Opts.ChildrenFactory(args);
            int idx = 0;

            if (children != null)
            {
                foreach (var childObj in children)
                {
                    args.Idx = idx;

                    var treeNode = new DataTreeNode<TNode>(
                        childObj,
                        args.Parent);

                    if (GetNodes(
                        args,
                        ref nextStep,
                        treeNode))
                    {
                        break;
                    }

                    idx++;
                }
            }
        }

        public bool GetNodes<TNode, TArgs>(
            TArgs args,
            ref StepData nextStep,
            DataTreeNode<TNode> treeNode)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>
        {
            args.Current = treeNode;
            nextStep = args.Opts.NextStepPredicate(args);

            if (!args.Stop)
            {
                if (nextStep.Value == Step.Next && nextStep.Matches)
                {
                    AddMatching(args, treeNode);
                }

                if (nextStep.Value == Step.Push)
                {
                    PushStack(args, treeNode);
                    GetNodes<TNode, TArgs>(args);
                }

                if (nextStep.Value > Step.Next)
                {
                    TryPopStack<TNode, TArgs>(args);
                }
            }

            return args.Stop;
        }

        private void AddMatching<TNode, TArgs>(
            TArgs args,
            DataTreeNode<TNode> treeNode)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>
        {
            var nodesList = args.Parent?.ChildNodes ?? args.RootNodes;
            nodesList.Add(treeNode);
        }

        private void PushStack<TNode, TArgs>(
            TArgs args,
            DataTreeNode<TNode> treeNode)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>
        {
            AddMatching(args, treeNode);
            args.Stack.Push(treeNode);

            args.Parent = treeNode;
            args.Current = default;
        }

        private void TryPopStack<TNode, TArgs>(
            TArgs args)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>
        {
            args.Current = args.Parent;

            if (args.Stack.Any())
            {
                args.Parent = args.Stack.Pop();
            }
            else
            {
                args.Parent = default;
                args.Stop = true;
            }
        }
    }
}

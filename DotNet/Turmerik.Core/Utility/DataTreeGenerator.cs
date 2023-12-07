﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public interface IDataTreeGenerator<TData, TNode, TOpts, TArgs>
        where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
        where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
        where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
    {
        TArgs GetNodes(TOpts opts);
    }

    public interface IDataTreeGenerator
    {
        TArgs GetNodes<TData, TNode, TOpts, TArgs>(
            TOpts opts)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;
    }

    public class DataTreeGenerator<TData, TNode, TOpts, TArgs> : IDataTreeGenerator<TData, TNode, TOpts, TArgs>
        where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
        where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
        where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
    {
        private readonly IDataTreeGenerator innerGenerator;

        public DataTreeGenerator(
            IDataTreeGenerator innerGenerator)
        {
            this.innerGenerator = innerGenerator ?? throw new ArgumentNullException(
                nameof(innerGenerator));
        }

        public TArgs GetNodes(TOpts opts) => innerGenerator.GetNodes<TData, TNode, TOpts, TArgs>(opts);
    }

    public abstract class DataTreeGeneratorBase : IDataTreeGenerator
    {
        public TArgs GetNodes<TData, TNode, TOpts, TArgs>(
            TOpts opts)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            var argsFactory = opts.ArgsFactory.FirstNotNull(
                o => o.CreateFromSrc<TArgs>());

            var args = argsFactory(opts);
            GetNodes<TData, TNode, TOpts, TArgs>(args);

            return args;
        }

        protected abstract void GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;

        protected void AddToTreeNodesList<TData, TNode, TOpts, TArgs>(
            DataTreeNode<TNode> treeNode,
            List<DataTreeNode<TNode>> treeNodesList)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            treeNodesList.Add(treeNode ?? throw new ArgumentNullException(
                nameof(treeNode)));
        }

        protected void TryPushStack<TData, TNode, TOpts, TArgs>(
            TArgs args,
            DataTreeNode<TNode> treeNode,
            ref List<DataTreeNode<TNode>> treeNodesList)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            AddToTreeNodesList<TData, TNode, TOpts, TArgs>(treeNode, treeNodesList);

            args.Current = treeNode;
            args.Next = default;
            args.LevelIdx++;

            treeNodesList = treeNode.ChildNodes;
        }

        protected void TryPopStack<TData, TNode, TOpts, TArgs>(
            TArgs args,
            ref List<DataTreeNode<TNode>> treeNodesList)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            if (args.RemoveOnPop > 0 && args.Next != null)
            {
                treeNodesList.Remove(args.Next);
                args.RemoveOnPop--;
            }

            if ((args.Next = args.Current) != null)
            {
                args.Current = args.Current.ParentNode;
            }
            else
            {
                args.Current = null;
            }

            args.LevelIdx--;
            treeNodesList = args.Current?.ChildNodes ?? args.RootNodes;
        }

        protected void OnChildNodesIterated<TData, TNode, TOpts, TArgs>(
            TArgs args,
            List<DataTreeNode<TNode>> sibblingsList = null)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            if (args.Current != null && !args.Opts.OnChildNodesIterated(args, args.Current.Data))
            {
                sibblingsList ??= (args.Current.ParentNode?.ChildNodes ?? args.RootNodes);
                sibblingsList.Remove(args.Current);
            }
        }
    }
}

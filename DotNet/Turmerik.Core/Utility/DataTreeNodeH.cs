using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public static class DataTreeNodeH
    {
        public static TRetNode ToNodeCore<T, TNode, TChildNodes, TRetNode, TRetChildNodes>(
            this IDataTreeNode<T, TNode, TChildNodes> src,
            Func<IEnumerable<TRetNode>, TRetChildNodes> childNodesFactory,
            int childrenDepth = 0,
            int parentDepth = 0,
            bool allowChildNodesToBeNull = false)
            where TNode : IDataTreeNode<T, TNode, TChildNodes>
            where TChildNodes : IEnumerable<TNode>
            where TRetNode : IDataTreeNodeCore<T>
            where TRetChildNodes : IEnumerable<TRetNode>
        {
            TRetChildNodes retChildNodes = default;
            TRetNode retParentNode = default;

            if (childrenDepth != 0 && src.ChildNodes != null)
            {
                var childNodes = src.ChildNodes.Select(
                    node => node.ToNodeCore(
                        childNodesFactory,
                        childrenDepth - 1, 0,
                        allowChildNodesToBeNull));

                retChildNodes = childNodesFactory(childNodes);
            }

            if (parentDepth != 0 && src.ParentNode != null)
            {
                retParentNode = src.ParentNode.ToNodeCore(
                    childNodesFactory,
                    0, parentDepth - 1);
            }

            var retNode = src.Data.CreateFromSrc<TRetNode>(
                null, retParentNode, retChildNodes);

            return retNode;
        }

        public static DataTreeNodeMtbl<T> ToMtblNode<T, TNode, TChildNodes>(
            this IDataTreeNode<T, TNode, TChildNodes> src,
            int childrenDepth = 0,
            int parentDepth = 0,
            bool allowChildNodesToBeNull = false)
            where TNode : IDataTreeNode<T, TNode, TChildNodes>
            where TChildNodes : IEnumerable<TNode> => src.ToNodeCore<T, TNode, TChildNodes, DataTreeNodeMtbl<T>, List<DataTreeNodeMtbl<T>>>(
                nmrbl => nmrbl.ToList(), childrenDepth, parentDepth, allowChildNodesToBeNull);

        public static DataTreeNodeImmtbl<T> ToImmtblNode<T, TNode, TChildNodes>(
            this IDataTreeNode<T, TNode, TChildNodes> src,
            int childrenDepth = 0,
            int parentDepth = 0,
            bool allowChildNodesToBeNull = false)
            where TNode : IDataTreeNode<T, TNode, TChildNodes>
            where TChildNodes : IEnumerable<TNode> => src.ToNodeCore<T, TNode, TChildNodes, DataTreeNodeImmtbl<T>, ReadOnlyCollection<DataTreeNodeImmtbl<T>>>(
                nmrbl => nmrbl.RdnlC(), childrenDepth, parentDepth, allowChildNodesToBeNull);

        public static DataTreeNode<T> ToNode<T, TNode, TChildNodes>(
            this IDataTreeNode<T, TNode, TChildNodes> src,
            int childrenDepth = 0,
            int parentDepth = 0,
            bool allowChildNodesToBeNull = false)
            where TNode : IDataTreeNode<T, TNode, TChildNodes>
            where TChildNodes : IEnumerable<TNode> => src.ToNodeCore<T, TNode, TChildNodes, DataTreeNode<T>, List<DataTreeNode<T>>>(
                nmrbl => nmrbl.ToList(), childrenDepth, parentDepth, allowChildNodesToBeNull);
    }
}

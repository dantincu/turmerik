using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public interface IDataTreeNodeCore<T>
    {
        T Data { get; }
    }

    public interface IDataTreeNode<T, TNode, TChildNodes> : IDataTreeNodeCore<T>
        where TNode : IDataTreeNode<T, TNode, TChildNodes>
        where TChildNodes : IEnumerable<TNode>
    {
        TNode ParentNode { get; }
        TChildNodes ChildNodes { get; }
    }

    public class DataTreeNode<T> : IDataTreeNode<T, DataTreeNode<T>, List<DataTreeNode<T>>>
    {
        public DataTreeNode()
        {
        }

        public DataTreeNode(T data)
        {
            Data = data;
            ChildNodes = new List<DataTreeNode<T>>();
        }

        public DataTreeNode(
            T data,
            DataTreeNode<T> parentNode)
        {
            Data = data;
            ParentNode = parentNode;
            ChildNodes = new List<DataTreeNode<T>>();
        }

        public DataTreeNode(
            T data,
            DataTreeNode<T> parentNode,
            List<DataTreeNode<T>> childNodes)
        {
            Data = data;
            ParentNode = parentNode;
            ChildNodes = childNodes;
        }

        public T Data { get; }
        public DataTreeNode<T> ParentNode { get; }
        public List<DataTreeNode<T>> ChildNodes { get; }
    }
}

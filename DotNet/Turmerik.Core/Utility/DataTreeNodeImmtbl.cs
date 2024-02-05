using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace Turmerik.Core.Utility
{
    public class DataTreeNodeImmtbl<T> : IDataTreeNode<T, DataTreeNodeImmtbl<T>, ReadOnlyCollection<DataTreeNodeImmtbl<T>>>
    {
        public DataTreeNodeImmtbl()
        {
        }

        public DataTreeNodeImmtbl(T data)
        {
            Data = data;
        }

        public DataTreeNodeImmtbl(
            T data,
            DataTreeNodeImmtbl<T> parentNode)
        {
            Data = data;
            ParentNode = parentNode;
        }

        public DataTreeNodeImmtbl(
            T data,
            DataTreeNodeImmtbl<T> parentNode,
            ReadOnlyCollection<DataTreeNodeImmtbl<T>> childNodes)
        {
            Data = data;
            ParentNode = parentNode;
            ChildNodes = childNodes;
        }

        public T Data { get; }
        public DataTreeNodeImmtbl<T> ParentNode { get; }
        public ReadOnlyCollection<DataTreeNodeImmtbl<T>> ChildNodes { get; }
    }
}

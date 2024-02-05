using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public class DataTreeNodeMtbl<T> : IDataTreeNode<T, DataTreeNodeMtbl<T>, List<DataTreeNodeMtbl<T>>>
    {
        public DataTreeNodeMtbl()
        {
        }

        public DataTreeNodeMtbl(T data)
        {
            Data = data;
            ChildNodes = new List<DataTreeNodeMtbl<T>>();
        }

        public DataTreeNodeMtbl(
            T data,
            DataTreeNodeMtbl<T> parentNode)
        {
            Data = data;
            ParentNode = parentNode;
            ChildNodes = new List<DataTreeNodeMtbl<T>>();
        }

        public DataTreeNodeMtbl(
            T data,
            DataTreeNodeMtbl<T> parentNode,
            List<DataTreeNodeMtbl<T>> childNodes)
        {
            Data = data;
            ParentNode = parentNode;
            ChildNodes = childNodes;
        }

        public T Data { get; set; }
        public DataTreeNodeMtbl<T> ParentNode { get; set; }
        public List<DataTreeNodeMtbl<T>> ChildNodes { get; set; }
    }
}

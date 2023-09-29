using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Utility
{
    public class DataTreeNode<T>
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
            List<DataTreeNode<T>> childNodes)
        {
            Data = data;
            ChildNodes = childNodes;
        }

        public T Data { get; set; }
        public List<DataTreeNode<T>> ChildNodes { get; set; }
    }
}

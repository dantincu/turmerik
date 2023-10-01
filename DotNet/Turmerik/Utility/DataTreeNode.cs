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

        public T Data { get; set; }
        public DataTreeNode<T> ParentNode { get; set; }
        public List<DataTreeNode<T>> ChildNodes { get; set; }
    }
}

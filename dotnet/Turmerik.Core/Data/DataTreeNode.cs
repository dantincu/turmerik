using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Data
{
    public class DataTreeNode<TData>
    {
        public DataTreeNode(TData data)
        {
            Data = data;
            Nodes = new List<DataTreeNode<TData>>();
        }

        public TData Data { get; }
        public List<DataTreeNode<TData>> Nodes { get; }
    }
}

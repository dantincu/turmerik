using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public class DataTreeTraversalArgsCore<TItem>
        where TItem : class
    {
        public DataTreeTraversalArgsCore(
            List<TItem>? rootItems = null,
            Stack<TItem>? prevParentItems = null,
            TItem? parentItem = null,
            TItem? currentItem = null)
        {
            RootItems = rootItems ?? new ();
            PrevParentItems = prevParentItems ?? new();
            ParentItem = parentItem;
            CurrentItem = currentItem;
        }

        public List<TItem> RootItems { get; }
        public Stack<TItem> PrevParentItems { get; }

        public TItem? ParentItem { get; set; }
        public TItem? CurrentItem { get; set; }
    }
}

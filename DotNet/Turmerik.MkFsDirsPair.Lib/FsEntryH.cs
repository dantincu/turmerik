using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.MkFsDirsPair.Lib
{
    public static class FsEntryH
    {
        public static DataTreeNode<FsEntry> File(
            this FsEntry entry) => new DataTreeNode<FsEntry>(entry, null);

        public static DataTreeNode<FsEntry> Folder(
            this FsEntry entry,
            params DataTreeNode<FsEntry>[] childNodes) => new DataTreeNode<FsEntry>(
                entry, childNodes.ToList());
    }
}

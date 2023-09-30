using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.MkFsDirsPair.Lib
{
    public static class FsEntryH
    {
        public static DataTreeNode<FsEntryOpts> File(
            this FsEntryOpts entry) => new DataTreeNode<FsEntryOpts>(entry, null);

        public static DataTreeNode<FsEntryOpts> Folder(
            this FsEntryOpts entry,
            params DataTreeNode<FsEntryOpts>[] childNodes) => new DataTreeNode<FsEntryOpts>(
                entry, childNodes.ToList());
    }
}

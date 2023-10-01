using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.Utility;

namespace Turmerik.MkFsDirsPair.Lib
{
    public static class FsEntryH
    {
        public static DataTreeNode<DriveItemOpts> File(
            this DriveItemOpts entry) => new DataTreeNode<DriveItemOpts>(entry, null);

        public static DataTreeNode<DriveItemOpts> Folder(
            this DriveItemOpts entry,
            params DataTreeNode<DriveItemOpts>[] childNodes) => new DataTreeNode<DriveItemOpts>(
                entry, childNodes.ToList());
    }
}

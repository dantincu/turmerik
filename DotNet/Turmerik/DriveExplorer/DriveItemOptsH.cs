using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.Utility;

namespace Turmerik.MkFsDirsPair.Lib
{
    public static class DriveItemOptsH
    {
        public static DataTreeNode<DriveItemOpts> File(
            this DriveItemOpts entry) => new DataTreeNode<DriveItemOpts>(entry, null, null);

        public static DataTreeNode<DriveItemOpts> Folder(
            this DriveItemOpts entry,
            params DataTreeNode<DriveItemOpts>[] childNodes) => new DataTreeNode<DriveItemOpts>(
                entry, null, childNodes.ToList());
    }
}

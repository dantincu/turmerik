using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class DriveItemXData
    {
        public bool? Created { get; set; }
        public bool? Removed { get; set; }
        public string TextFileContents { get; set; }
    }

    public class DriveItemX : DriveItem<DriveItemX, DriveItemXData>
    {
        public DriveItemX()
        {
        }

        public DriveItemX(
            DriveItem src, int depth = 0) : base(src)
        {
            DriveExplorerH.CopyChildren(
                this,
                src.SubFolders?.Select(
                    item => new DriveItemX(
                        item, depth - 1)).ToList(),
                src.FolderFiles?.Select(
                    item => new DriveItemX(
                        item, depth - 1)).ToList(),
                depth);
        }
    }
}

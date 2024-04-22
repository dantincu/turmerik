using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.DriveExplorer
{
    public class RefTrgDriveItemsTuple
    {
        public RefTrgDriveItemsTuple(
            DriveItem? refItem,
            DriveItem? trgItem,
            string? relPath)
        {
            RefItem = refItem;
            TrgItem = trgItem;
            Name = refItem?.Name ?? trgItem?.Name;
            RelPath = relPath;
        }

        public DriveItem? RefItem { get; }
        public DriveItem? TrgItem { get; }
        public string? Name { get; set; }
        public string? RelPath { get; set; }
    }
}

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
            string? refPrIdnf,
            string? trgPrIdnf,
            string relPath,
            bool hasDiff)
        {
            RefItem = refItem;
            TrgItem = trgItem;

            RefPrIdnf = refPrIdnf;
            TrgPrIdnf = trgPrIdnf;

            Name = refItem?.Name ?? trgItem?.Name ?? throw new ArgumentNullException(
                nameof(refItem.Name));

            RelPath = relPath ?? throw new ArgumentNullException(
                nameof(relPath));

            HasDiff = hasDiff;
        }

        public DriveItem? RefItem { get; }
        public DriveItem? TrgItem { get; }
        public string? RefPrIdnf { get; }
        public string? TrgPrIdnf { get; }
        public string Name { get; }
        public string RelPath { get; }
        public bool HasDiff { get; }
    }
}

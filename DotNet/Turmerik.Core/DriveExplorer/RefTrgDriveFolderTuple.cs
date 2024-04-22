using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.DriveExplorer
{
    public class RefTrgDriveFolderTuple
    {
        public RefTrgDriveFolderTuple(
            List<RefTrgDriveItemsTuple> files,
            string? name,
            string? relPath)
        {
            Files = files ?? throw new ArgumentNullException(nameof(files));
            Name = name;
            RelPath = relPath;
        }

        public List<RefTrgDriveItemsTuple> Files { get; }
        public string? Name { get; set; }
        public string? RelPath { get; set; }
    }
}

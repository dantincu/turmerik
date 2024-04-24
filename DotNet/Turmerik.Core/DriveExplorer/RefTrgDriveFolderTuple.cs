using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.DriveExplorer
{
    public class RefTrgDriveFolderTuple
    {
        public RefTrgDriveFolderTuple(
            List<RefTrgDriveItemsTuple> files,
            string? refPrIdnf,
            string? trgPrIdnf,
            string name,
            string relPath)
        {
            Files = files ?? throw new ArgumentNullException(nameof(files));

            RefPrIdnf = refPrIdnf;
            TrgPrIdnf = trgPrIdnf;

            Name = name ?? throw new ArgumentNullException(
                nameof(name));

            RelPath = relPath ?? throw new ArgumentNullException(
                nameof(relPath));
        }

        public List<RefTrgDriveItemsTuple> Files { get; }
        public string? RefPrIdnf { get; }
        public string? TrgPrIdnf { get; }
        public string Name { get; }
        public string RelPath { get; }
    }
}

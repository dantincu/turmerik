using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.DriveExplorer
{
    public class FilteredDriveEntries
    {
        public string PrFolderName { get; set; }
        public string PrFolderIdnf { get; set; }

        public List<DriveItem> AllFolderFiles { get; set; }
        public List<DriveItem> AllSubFolders { get; set; }

        public List<DriveItem> FilteredFolderFiles { get; set; }
        public List<DriveItem> FilteredSubFolders { get; set; }
    }
}

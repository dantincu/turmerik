using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class DriveItemXData
    {
        public bool IsCreated { get; set; }
        public string TextFileContents { get; set; }
    }

    public class DriveItemX : DriveItem<DriveItemX, DriveItemXData>
    {
    }
}

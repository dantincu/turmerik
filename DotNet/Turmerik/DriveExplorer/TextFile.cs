using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class TextFile : DriveItem
    {
        public bool? IsCreated { get; set; }
        public string? TextFileContents { get; set; }
    }
}

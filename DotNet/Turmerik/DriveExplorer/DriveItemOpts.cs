using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class DriveItemOpts
    {
        public DriveItemOpts()
        {
        }

        public DriveItemOpts(string name)
        {
            Name = name;
            IsFolder = true;
        }

        public DriveItemOpts(
            string name,
            string contents)
        {
            Name = name;
            Contents = contents;
        }

        public DriveItemOpts(
            string name,
            bool isFolder,
            string contents,
            bool overwriteExisting = false)
        {
            Name = name;
            IsFolder = isFolder;
            Contents = contents;
            OverwriteExisting = overwriteExisting;
        }

        public string Name { get; set; }
        public bool IsFolder { get; set; }
        public string Contents { get; set; }
        public bool OverwriteExisting { get; set; }
    }
}

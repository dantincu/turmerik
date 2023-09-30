using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.MkFsDirsPair.Lib
{
    public class FsEntryOpts
    {
        public FsEntryOpts()
        {
        }

        public FsEntryOpts(string name)
        {
            Name = name;
            IsFolder = true;
        }

        public FsEntryOpts(
            string name,
            string contents)
        {
            Name = name;
            Contents = contents;
        }

        public FsEntryOpts(
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

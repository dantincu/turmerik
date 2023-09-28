using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.MkFsDirsPair.Lib
{
    public class FsEntry
    {
        public FsEntry()
        {
        }

        public FsEntry(string name)
        {
            Name = name;
            IsFolder = true;
        }

        public FsEntry(
            string name,
            string contents)
        {
            Name = name;
            Contents = contents;
        }

        public FsEntry(string name, bool isFolder, string contents)
        {
            Name = name;
            IsFolder = isFolder;
            Contents = contents;
        }

        public string Name { get; set; }
        public bool IsFolder { get; set; }
        public string Contents { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FileExplorer.WinFormsCore.App
{
    public interface IFsEntryOptionsCommand
    {
        string CommandName { get; }
        Action Action { get; }
    }

    public class FsEntryOptionsCommandImmtbl : IFsEntryOptionsCommand
    {
        public FsEntryOptionsCommandImmtbl(IFsEntryOptionsCommand src)
        {
            CommandName = src.CommandName;
            Action = src.Action;
        }

        public string CommandName { get; }
        public Action Action { get; }
    }

    public class FsEntryOptionsCommandMtbl : IFsEntryOptionsCommand
    {
        public FsEntryOptionsCommandMtbl()
        {
        }

        public FsEntryOptionsCommandMtbl(IFsEntryOptionsCommand src)
        {
            CommandName = src.CommandName;
            Action = src.Action;
        }

        public string CommandName { get; set; }
        public Action Action { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsUtils.WinForms.App
{
    public interface IProgramArgs
    {
        string InitialDirPath { get; }
        bool IsSingleInstance { get; }
    }

    public class ProgramArgsImmtbl : IProgramArgs
    {
        public ProgramArgsImmtbl(IProgramArgs src)
        {
            InitialDirPath = src.InitialDirPath;
            IsSingleInstance = src.IsSingleInstance;
        }

        public string InitialDirPath { get; }
        public bool IsSingleInstance { get; }
    }

    public class ProgramArgsMtbl : IProgramArgs
    {
        public ProgramArgsMtbl()
        {
        }

        public ProgramArgsMtbl(IProgramArgs src)
        {
            InitialDirPath = src.InitialDirPath;
            IsSingleInstance = src.IsSingleInstance;
        }

        public string InitialDirPath { get; set; }
        public bool IsSingleInstance { get; set; }
    }
}

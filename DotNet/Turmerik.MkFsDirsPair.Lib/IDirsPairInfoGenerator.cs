using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.Utility;

namespace Turmerik.MkFsDirsPair.Lib
{
    public interface IDirsPairInfoGenerator
    {
        DirsPairInfo Generate(string[] args);
    }
}

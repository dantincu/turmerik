using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.ConsoleApps
{
    public abstract class ProgramConfigProfileCoreBase
    {
        public string ProfileName { get; set; }
        public string ProfileRelFilePath { get; set; }
    }

    public abstract class ProgramConfigCoreBase<TProgramConfigProfile>
        where TProgramConfigProfile : ProgramConfigProfileCoreBase, new()
    {
        public List<TProgramConfigProfile> Profiles { get; set; }
    }
}

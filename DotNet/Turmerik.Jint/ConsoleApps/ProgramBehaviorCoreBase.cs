using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.ConsoleApps;

namespace Turmerik.Jint.ConsoleApps
{
    public abstract class ProgramBehaviorProfileCoreBase : ProgramConfigProfileCoreBase
    {
        public string ProfileBehaviorRelFilePath { get; set; }
        public string ProfileBehaviorExportedMembersJsCode { get; set; }
    }

    public abstract class ProgramBehaviorCoreBase<TProgramConfigProfile> : ProgramConfigCoreBase<TProgramConfigProfile>
        where TProgramConfigProfile : ProgramBehaviorProfileCoreBase, new()
    {
    }
}

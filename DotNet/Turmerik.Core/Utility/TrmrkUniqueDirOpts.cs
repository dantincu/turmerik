using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.Core.Utility
{
    public class TrmrkUniqueDirOpts
    {
        public AppEnvDir? AppEnvDir { get; set; }
        public IAppInstanceStartInfo AppInstanceStartInfo { get; set; }
        public string DirNameFormat { get; set; }
        public long? DirNameTicks { get; set; }
        public Guid? DirNameGuid { get; set; }
        public Type DirNameType { get; set; }
        public string[] PathPartsArr { get; set; }
        public bool? CreateDirectory { get; set; }
    }
}

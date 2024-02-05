using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.Core.Utility
{
    public class TrmrkUniqueDir
    {
        public AppEnvDir AppEnvDir { get; set; }
        public IAppInstanceStartInfo AppInstanceStartInfo { get; set; }
        public string DirPath { get; set; }
        public string DirName { get; set; }
        public string DirNameFormat { get; set; }
        public long DirNameTicks { get; set; }
        public Guid DirNameGuid { get; set; }
    }
}

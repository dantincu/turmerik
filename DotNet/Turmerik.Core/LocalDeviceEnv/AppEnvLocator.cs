using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.LocalDeviceEnv
{
    public enum AppEnvDir
    {
        Config = 1,
        Data,
        Logs,
        Content,
        Bin,
        Temp,
        Src,
        Scripts
    }

    public partial class AppEnvLocator
    {
        public string AppEnvDirBasePath { get; set; }
    }
}

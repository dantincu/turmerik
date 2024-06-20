using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Utility
{
    public interface IProcessLauncher : IProcessLauncherCore
    {
    }

    public class ProcessLauncher : ProcessLauncherCore, IProcessLauncher
    {
        public override void ApplyArgumentsIfReq(
            ProcessLauncherOpts opts,
            ProcessStartInfo processStartInfo)
        {
            if (opts.ArgumentsNmrbl != null)
            {
                processStartInfo.ArgumentList.AddRange(opts.ArgumentsNmrbl);
            }
        }
    }
}

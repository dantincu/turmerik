using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Utility
{
    public interface IProcessLauncherCore
    {
        Task Launch(ProcessStartInfo processStartInfo);
    }

    public class ProcessLauncherCore : IProcessLauncherCore
    {
        public async Task Launch(
            ProcessStartInfo processStartInfo)
        {
            await Task.Run(() =>
            {
                var process = new Process()
                {
                    StartInfo = processStartInfo
                };

                process.Start();
                process.WaitForExit();
            });
        }
    }
}

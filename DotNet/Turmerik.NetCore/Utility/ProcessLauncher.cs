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
        Task Launch(
            string workingDirectory,
            string fileName,
            IEnumerable<string> argumentsNmrbl = null);

        Task Launch(ProcessLauncherOpts opts);

        ProcessStartInfo CreateProcessStartInfo(
            ProcessLauncherOpts opts);
    }

    public class ProcessLauncher : ProcessLauncherCore, IProcessLauncher
    {
        public Task Launch(
            string workingDirectory,
            string fileName,
            IEnumerable<string> argumentsNmrbl = null) => Launch(
                new ProcessLauncherOpts
                {
                    WorkingDirectory = workingDirectory,
                    FileName = fileName,
                    ArgumentsNmrbl = argumentsNmrbl
                });

        public async Task Launch(ProcessLauncherOpts opts)
        {
            var processStartInfo = CreateProcessStartInfo(opts);
            await Launch(processStartInfo);
        }

        public ProcessStartInfo CreateProcessStartInfo(
            ProcessLauncherOpts opts)
        {
            var processStartInfo = new ProcessStartInfo
            {
                WorkingDirectory = opts.WorkingDirectory,
                FileName = opts.FileName,
            };

            if (opts.ArgumentsNmrbl != null)
            {
                processStartInfo.ArgumentList.AddRange(opts.ArgumentsNmrbl);
            }

            return processStartInfo;
        }
    }
}

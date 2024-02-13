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
            IEnumerable<string> argumentsNmrbl = null,
            Action<ProcessStartInfo> startInfoBuilder = null);

        Task Launch(ProcessLauncherOpts opts);

        ProcessStartInfo CreateProcessStartInfo(
            ProcessLauncherOpts opts);
    }

    public class ProcessLauncher : ProcessLauncherCore, IProcessLauncher
    {
        public Task Launch(
            string workingDirectory,
            string fileName,
            IEnumerable<string> argumentsNmrbl = null,
            Action<ProcessStartInfo> startInfoBuilder = null) => Launch(
                new ProcessLauncherOpts
                {
                    WorkingDirectory = workingDirectory,
                    FileName = fileName,
                    ArgumentsNmrbl = argumentsNmrbl,
                    StartInfoBuilder = startInfoBuilder
                });

        public async Task Launch(ProcessLauncherOpts opts)
        {
            var processStartInfo = CreateProcessStartInfo(opts);
            await Launch(processStartInfo);
        }

        public ProcessStartInfo CreateProcessStartInfo(
            ProcessLauncherOpts opts)
        {
            var startInfo = new ProcessStartInfo
            {
                WorkingDirectory = opts.WorkingDirectory,
                FileName = opts.FileName,
            };

            if (opts.ArgumentsNmrbl != null)
            {
                startInfo.ArgumentList.AddRange(opts.ArgumentsNmrbl);
            }

            startInfo.RedirectStandardError = opts.RedirectStandardError ?? true;
            startInfo.RedirectStandardOutput = opts.RedirectStandardOutput ?? true;
            startInfo.RedirectStandardInput = opts.RedirectStandardInput ?? true;

            startInfo.UseShellExecute = opts.UseShellExecute ?? false;

            opts.StartInfoBuilder?.Invoke(
                startInfo);

            return startInfo;
        }
    }
}

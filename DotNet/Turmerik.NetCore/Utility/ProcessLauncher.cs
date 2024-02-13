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
            Action<ProcessLauncherOpts> optsBuilder = null,
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
            Action<ProcessLauncherOpts> optsBuilder = null,
            Action<ProcessStartInfo> startInfoBuilder = null) => Launch(
                new ProcessLauncherOpts
                {
                    WorkingDirectory = workingDirectory,
                    FileName = fileName,
                    ArgumentsNmrbl = argumentsNmrbl,
                    OptsBuilder = optsBuilder,
                    StartInfoBuilder = startInfoBuilder
                });

        public async Task Launch(ProcessLauncherOpts opts)
        {
            var processStartInfo = CreateProcessStartInfo(opts);
            await Launch(opts, processStartInfo);
        }

        public ProcessStartInfo CreateProcessStartInfo(
            ProcessLauncherOpts opts)
        {
            opts.OptsBuilder?.Invoke(opts);

            var startInfo = new ProcessStartInfo
            {
                WorkingDirectory = opts.WorkingDirectory,
                FileName = opts.FileName,
            };

            if (opts.ArgumentsNmrbl != null)
            {
                startInfo.ArgumentList.AddRange(opts.ArgumentsNmrbl);
            }

            bool useShellExecute = opts.UseShellExecute ?? false;
            startInfo.UseShellExecute = useShellExecute;

            startInfo.RedirectStandardError = opts.RedirectStandardError ?? !useShellExecute;
            startInfo.RedirectStandardOutput = opts.RedirectStandardOutput ?? !useShellExecute;
            startInfo.RedirectStandardInput = opts.RedirectStandardInput ?? !useShellExecute;

            opts.StartInfoBuilder?.Invoke(
                startInfo);

            return startInfo;
        }
    }
}

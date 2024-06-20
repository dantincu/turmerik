using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Utility
{
    public interface IProcessLauncherCore
    {
        Task Launch(
            string workingDirectory,
            string fileName,
            IEnumerable<string> argumentsNmrbl = null,
            Action<ProcessLauncherOpts> optsBuilder = null,
            Action<ProcessStartInfo> startInfoBuilder = null);

        Task Launch(ProcessLauncherOpts opts);

        Task Launch(
            ProcessLauncherOpts opts,
            ProcessStartInfo processStartInfo,
            bool skipArgumentsApply = false);

        ProcessStartInfo CreateProcessStartInfo(
            ProcessLauncherOpts opts);

        void ApplyArgumentsIfReq(
            ProcessLauncherOpts opts,
            ProcessStartInfo processStartInfo);
    }

    public class ProcessLauncherCore : IProcessLauncherCore
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
            await Launch(opts, processStartInfo, true);
        }

        public async Task Launch(
            ProcessLauncherOpts opts,
            ProcessStartInfo processStartInfo,
            bool skipArgumentsApply = false)
        {
            if (!skipArgumentsApply)
            {
                ApplyArgumentsIfReq(opts, processStartInfo);
            }

            await Task.Run(() =>
            {
                var process = new Process()
                {
                    StartInfo = processStartInfo
                };

                process.Start();

                string? output = null;
                string? error = null;

                if (opts.UseShellExecute != true)
                {
                    output = process.StandardOutput.ReadToEnd();
                    error = process.StandardError.ReadToEnd();
                }

                process.WaitForExit();

                if (opts.UseShellExecute != true)
                {
                    if (output != null)
                    {
                        Console.WriteLine("Output:");
                        Console.WriteLine(output);
                        Console.WriteLine();
                    }

                    if (error != null)
                    {
                        Console.WriteLine("Error:");
                        Console.WriteLine(error);
                        Console.WriteLine();
                    }
                }
            });
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

            ApplyArgumentsIfReq(opts, startInfo);

            bool useShellExecute = opts.UseShellExecute ?? false;
            startInfo.UseShellExecute = useShellExecute;

            startInfo.RedirectStandardError = opts.RedirectStandardError ?? !useShellExecute;
            startInfo.RedirectStandardOutput = opts.RedirectStandardOutput ?? !useShellExecute;
            startInfo.RedirectStandardInput = opts.RedirectStandardInput ?? !useShellExecute;

            opts.StartInfoBuilder?.Invoke(
                startInfo);

            return startInfo;
        }

        public virtual void ApplyArgumentsIfReq(
            ProcessLauncherOpts opts,
            ProcessStartInfo processStartInfo)
        {
            if (opts.ArgumentsNmrbl != null)
            {
                processStartInfo.Arguments = string.Join(" ", opts.ArgumentsNmrbl.Select(
                    arg => $"\"{arg}\""));
            }
        }
    }
}

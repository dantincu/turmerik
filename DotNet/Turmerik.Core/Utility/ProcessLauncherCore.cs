using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Utility
{
    public interface IProcessLauncherCore
    {
        Task Launch(
            ProcessLauncherOpts opts,
            ProcessStartInfo processStartInfo);
    }

    public class ProcessLauncherCore : IProcessLauncherCore
    {
        public async Task Launch(
            ProcessLauncherOpts opts,
            ProcessStartInfo processStartInfo)
        {
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
    }
}

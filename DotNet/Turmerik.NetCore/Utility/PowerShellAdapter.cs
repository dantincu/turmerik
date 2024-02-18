using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Management.Automation;
using System.Collections.ObjectModel;
using Microsoft.PowerShell;
using System.Management.Automation.Runspaces;

namespace Turmerik.NetCore.Utility
{
    public interface IPowerShellAdapter
    {
        Collection<PSObject?> Invoke(
            PowerShellAdapterOpts opts);
    }

    /// <summary>
    /// Inspired from https://locall.host/how-to-use-powershell-with-c
    /// </summary>
    public class PowerShellAdapter : IPowerShellAdapter
    {
        public Collection<PSObject?> Invoke(
            PowerShellAdapterOpts opts)
        {
            using var pws = CreatePowerShell(
                opts, out var runspace);

            try
            {
                foreach (var cmd in opts.Commands)
                {
                    pws.AddCommand(cmd.CommandName);

                    if (cmd.CommandParameters != null)
                    {
                        foreach (var param in cmd.CommandParameters)
                        {
                            if (param.Value != null)
                            {
                                pws.AddParameter(
                                    param.Key,
                                    param.Value);
                            }
                            else
                            {
                                pws.AddParameter(param.Key);
                            }
                        }
                    }

                    if (cmd.CommandArguments != null)
                    {
                        foreach (var arg in cmd.CommandArguments)
                        {
                            pws.AddArgument(arg);
                        }
                    }
                }

                var retVal = pws.Invoke();
                return retVal;
            }
            finally
            {
                runspace?.Dispose();
            }
        }

        public PowerShell CreatePowerShell(
            PowerShellAdapterOpts opts,
            out Runspace runspace)
        {
            PowerShell pws;

            if (opts.CreateRunSpace ?? false)
            {
                // Create a default initial session state and set the execution policy.
                InitialSessionState initialSessionState = InitialSessionState.CreateDefault();
                initialSessionState.ExecutionPolicy = opts.ExecutionPolicy ?? ExecutionPolicy.Default;

                // Create a runspace and open it. This example uses C#8 simplified using statements
                runspace = RunspaceFactory.CreateRunspace(initialSessionState);
                runspace.Open();

                pws = PowerShell.Create(runspace);
            }
            else
            {
                runspace = null;
                pws = PowerShell.Create();
            }

            if (opts.WorkDir != null)
            {
                var cmd = pws.Commands.AddCommand(
                    "Set-Location");

                cmd.AddArgument(
                    opts.WorkDir);
            }

            return pws;
        }
    }
}

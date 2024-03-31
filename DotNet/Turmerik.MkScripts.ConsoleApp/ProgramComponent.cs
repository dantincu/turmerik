using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.NetCore.ConsoleApps.LocalFilesCloner;

namespace Turmerik.MkScripts.ConsoleApp
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly NetCore.ConsoleApps.LocalFilesCloner.IProgramArgsRetriever programArgsRetriever;

        public async Task RunAsync(string[] rawArgs)
        {

        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.ConsoleApps.ExecuteCustomCommand.Executors
{
    public class QuitCommandExecutor : ICustomCommandExecutor
    {
        public Task<bool> ExecuteAsync(string command)
        {
            return Task.FromResult(true);
        }
    }
}

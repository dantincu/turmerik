using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.ConsoleApps.ExecuteCustomCommand
{
    public interface ICustomCommandExecutor
    {
        Task<bool> ExecuteAsync(string command);
    }
}

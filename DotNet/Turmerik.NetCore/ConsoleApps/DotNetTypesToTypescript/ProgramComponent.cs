using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramComponent
    {
        Task RunAsync(
            string[] rawArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
        public Task RunAsync(string[] rawArgs)
        {
            throw new NotImplementedException();
        }
    }
}

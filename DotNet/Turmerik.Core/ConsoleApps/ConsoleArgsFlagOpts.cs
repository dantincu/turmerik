using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.ConsoleApps
{
    public class ConsoleArgsFlagOpts<TArgsMtbl>
    {
        public Action<ConsoleArgsParserData<TArgsMtbl>> Handler { get; set; }
        public string[] MatchingArgs { get; set; }
        public bool ShouldNotHaveValue { get; set; }
        public int? MaxArrayValueLength { get; set; }
    }
}

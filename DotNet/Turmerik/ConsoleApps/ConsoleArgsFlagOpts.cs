using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.ConsoleApps
{
    public class ConsoleArgsFlagOpts<TArgsMtbl>
    {
        public Action<ConsoleArgsParserData<TArgsMtbl>> Handler { get; set; }
        public bool ShouldNotHaveValue { get; set; }
    }
}

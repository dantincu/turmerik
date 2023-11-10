using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.ConsoleApps
{
    public class ConsoleArgsItemOpts<TArgsMtbl>
    {
        public Action<ConsoleArgsParserData<TArgsMtbl>> Handler { get; set; }
    }
}

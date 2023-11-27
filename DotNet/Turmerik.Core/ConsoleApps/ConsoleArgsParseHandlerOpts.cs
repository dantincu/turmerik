using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.ConsoleApps
{
    public class ConsoleArgsParseHandlerOpts<TArgsMtbl>
    {
        public ConsoleArgsParserData<TArgsMtbl> Data { get; set; }
        public ConsoleArgsItemOpts<TArgsMtbl>[] ItemHandlersArr { get; set; }
        public ConsoleArgsFlagOpts<TArgsMtbl>[] FlagHandlersArr { get; set; }
        public bool ThrowOnTooManyArgs { get; set; }
        public bool ThrowOnUnknownFlag { get; set; }
    }
}

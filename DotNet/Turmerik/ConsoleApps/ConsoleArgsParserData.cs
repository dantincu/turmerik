using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.ConsoleApps
{
    public class ConsoleArgsParserData<TArgsMtbl>
    {
        public ConsoleArgsParserOpts<TArgsMtbl> Opts { get; set; }
        public TArgsMtbl Args { get; set; }
        public int Count { get; set; }
        public int TotalCount { get; set; }
        public int FlagsCount { get; set; }
        public string ArgItem { get; set; }
        public string? ArgFlagName { get; set; }
        public string[]? ArgFlagValue { get; set; }
    }
}

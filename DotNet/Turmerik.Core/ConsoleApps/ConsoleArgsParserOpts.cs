using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.ConsoleApps
{
    public class ConsoleArgsParserOpts<TArgsMtbl>
    {
        public ConsoleArgsParserOpts(string[] rawArgs)
        {
            RawArgs = rawArgs ?? throw new ArgumentNullException(nameof(rawArgs));
        }

        public string[] RawArgs { get; }
        public string[] ExpandedRawArgs { get; set; }
        public Func<TArgsMtbl> ArgsFactory { get; set; }
        public char OptsStartChar { get; set; }
        public char OptsArgDelimChar { get; set; }
        public char OptsArgEmptyChar { get; set; }
        public Action<ConsoleArgsParserData<TArgsMtbl>> ArgsBuilder { get; set; }
        public string MacroFlagName { get; set; }
        public Dictionary<string, string[]> MacrosMap { get; set; }
    }
}

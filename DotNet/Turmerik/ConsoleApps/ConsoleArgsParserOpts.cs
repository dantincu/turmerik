using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.ConsoleApps
{
    public class ConsoleArgsParserOpts<TArgsMtbl>
    {
        public ConsoleArgsParserOpts(string[] rawArgs)
        {
            RawArgs = rawArgs ?? throw new ArgumentNullException(nameof(rawArgs));
        }

        public string[] RawArgs { get; }
        public Func<TArgsMtbl> ArgsFactory { get; set; }
        public char OptsStartChar { get; set; }
        public char OptsArgDelimChar { get; set; }
        public char OptsArgEmptyChar { get; set; }
        public Action<ConsoleArgsParserData<TArgsMtbl>> ArgsBuilder { get; set; }
    }
}

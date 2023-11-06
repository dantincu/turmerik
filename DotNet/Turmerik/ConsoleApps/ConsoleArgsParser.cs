using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Helpers;
using Turmerik.TextStream;

namespace Turmerik.ConsoleApps
{
    public interface IConsoleArgsParser
    {
        ConsoleArgsParserData<TArgsMtbl> Parse<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts);
    }

    public class ConsoleArgsParser : IConsoleArgsParser
    {
        public const char OPTS_START_CHAR = '/';
        public const char OPTS_ARG_DELIM_CHAR = ':';

        private readonly IDelimCharsExtractor delimCharsExtractor;

        public ConsoleArgsParser(
            IDelimCharsExtractor delimCharsExtractor)
        {
            this.delimCharsExtractor = delimCharsExtractor ?? throw new ArgumentNullException(nameof(delimCharsExtractor));
        }

        public ConsoleArgsParserData<TArgsMtbl> Parse<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts)
        {
            opts.OptsStartChar = opts.OptsStartChar.IfDefault(
                () => OPTS_START_CHAR);

            opts.OptsArgDelimChar = opts.OptsArgDelimChar.IfDefault(
                () => OPTS_ARG_DELIM_CHAR);

            var data = new ConsoleArgsParserData<TArgsMtbl>
            {
                Opts = opts,
                Args = opts.ArgsFactory.FirstNotNull(
                    Activator.CreateInstance<TArgsMtbl>).Invoke(),
            };

            Parse(opts, data);
            return data;
        }

        private void Parse<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts,
            ConsoleArgsParserData<TArgsMtbl> data)
        {
            var rawArgs = opts.RawArgs ?? throw new ArgumentNullException(
                nameof(opts.RawArgs));

            for (int i = 0; i < rawArgs.Length; i++)
            {
                data.ArgItem = rawArgs[i];

                SetArgItem(opts, data);
                opts.ArgsBuilder(data);
            }
        }

        private void SetArgItem<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts,
            ConsoleArgsParserData<TArgsMtbl> data)
        {
            string[] argItemArr = delimCharsExtractor.SplitStr(
                data.ArgItem,
                opts.OptsArgDelimChar,
                opts.OptsStartChar,
                out bool startsWithDelim);

            if (startsWithDelim)
            {
                data.FlagsCount++;
                data.ArgFlagName = argItemArr[0];
                data.ArgFlagValue = argItemArr.Skip(1).ToArray();
            }
            else
            {
                data.Count++;
                data.ArgFlagName = null;
                data.ArgFlagValue = null;
            }
        }
    }
}

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
        ConsoleArgsItemOpts<TArgsMtbl> ArgsItemOpts<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            Action<ConsoleArgsParserData<TArgsMtbl>> handler);

        ConsoleArgsFlagOpts<TArgsMtbl> ArgsFlagOpts<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            string[] matchingArgs,
            Action<ConsoleArgsParserData<TArgsMtbl>> handler,
            bool shouldNotHaveValue = false);

        void HandleArgs<TArgsMtbl>(
            ConsoleArgsParseHandlerOpts<TArgsMtbl> opts);

        void HandleArgItems<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            ConsoleArgsItemOpts<TArgsMtbl>[] handlersArr,
            bool throwOnTooManyArgs = true);

        void HandleFlagArgs<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            ConsoleArgsFlagOpts<TArgsMtbl>[] handlersArr,
            bool throwOnUnknownFlag = true);

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

        public ConsoleArgsItemOpts<TArgsMtbl> ArgsItemOpts<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            Action<ConsoleArgsParserData<TArgsMtbl>> handler) => new ConsoleArgsItemOpts<TArgsMtbl>
            {
                Handler = handler
            };

        public ConsoleArgsFlagOpts<TArgsMtbl> ArgsFlagOpts<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            string[] matchingArgs,
            Action<ConsoleArgsParserData<TArgsMtbl>> handler,
            bool shouldNotHaveValue = false) => new ConsoleArgsFlagOpts<TArgsMtbl>
            {
                Handler = handler,
                MatchingArgs = matchingArgs,
                ShouldNotHaveValue = shouldNotHaveValue
            };

        public void HandleArgs<TArgsMtbl>(
            ConsoleArgsParseHandlerOpts<TArgsMtbl> opts)
        {
            var data = opts.Data;

            if (data.ArgFlagName != null)
            {
                HandleFlagArgs(data,
                    opts.FlagHandlersArr,
                    opts.ThrowOnUnknownFlag);
            }
            else
            {
                HandleArgItems(data,
                    opts.ItemHandlersArr,
                    opts.ThrowOnTooManyArgs);
            }
        }

        public void HandleArgItems<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            ConsoleArgsItemOpts<TArgsMtbl>[] handlersArr,
            bool throwOnTooManyArgs = true)
        {
            if (data.Count < handlersArr.Length)
            {
                var handler = handlersArr[data.Count - 1];
                handler.Handler(data);
            }
            else if (throwOnTooManyArgs)
            {
                throw new ArgumentOutOfRangeException(
                    $"Too many arguments: expected no more than {handlersArr.Length} non-flag arguments");
            }
        }

        public void HandleFlagArgs<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            ConsoleArgsFlagOpts<TArgsMtbl>[] handlersArr,
            bool throwOnUnknownFlag = true)
        {
            var argFlagName = data.ArgFlagName;

            var handler = handlersArr.FirstOrDefault(
                item => item.MatchingArgs.Contains(
                    argFlagName));

            if (handler != null)
            {
                if (handler.ShouldNotHaveValue)
                {
                    ThrowIfArgOptHasValues(
                        data, argFlagName);
                }

                handler.Handler(data);
            }
            else if (throwOnUnknownFlag)
            {
                throw new ArgumentException(
                    $"Invalid flag {argFlagName}");
            }
        }

        public void ThrowIfArgOptHasValues<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            string flag)
        {
            if (data.ArgFlagValue.Any())
            {
                throw new ArgumentException(
                    $"The flag {flag} should not be given an explicit value");
            }
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

            data.TotalCount++;
        }
    }
}

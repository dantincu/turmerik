using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextStream;

namespace Turmerik.Core.ConsoleApps
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
            bool shouldNotHaveValue = false,
            int? maxArrayValueLength = null);

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

        string[] ApplyMacros<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts);

        void NormalizeOpts<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts);
    }

    public class ConsoleArgsParser : IConsoleArgsParser
    {
        public const char OPTS_START_CHAR = ':';
        public const char OPTS_ARG_DELIM_CHAR = ':';
        public const char OPTS_ARG_ALT_EMPTY_CHAR = '|';

        private readonly IDelimCharsExtractor delimCharsExtractor;

        public ConsoleArgsParser(
            IDelimCharsExtractor delimCharsExtractor)
        {
            this.delimCharsExtractor = delimCharsExtractor ?? throw new ArgumentNullException(
                nameof(delimCharsExtractor));
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
            bool shouldNotHaveValue = false,
            int? maxArrayValueLength = null) => new ConsoleArgsFlagOpts<TArgsMtbl>
            {
                Handler = handler,
                MatchingArgs = matchingArgs,
                ShouldNotHaveValue = shouldNotHaveValue,
                MaxArrayValueLength = maxArrayValueLength
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
            if (data.Count <= handlersArr.Length)
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
                else if (handler.MaxArrayValueLength.HasValue)
                {
                    ThrowIfArgOptHasTooManyValues(
                        data, argFlagName, handler.MaxArrayValueLength.Value);
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

        public void ThrowIfArgOptHasTooManyValues<TArgsMtbl>(
            ConsoleArgsParserData<TArgsMtbl> data,
            string flag,
            int arrayValueMaxCount)
        {
            if (data.ArgFlagValue.Length > arrayValueMaxCount)
            {
                throw new ArgumentException(
                    $"The flag {flag} should not be given more than {arrayValueMaxCount} values");
            }
        }

        public ConsoleArgsParserData<TArgsMtbl> Parse<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts)
        {
            NormalizeOpts(opts);

            var data = new ConsoleArgsParserData<TArgsMtbl>
            {
                Opts = opts,
                Args = opts.ArgsFactory.Invoke(),
            };

            Parse(opts, data);
            return data;
        }

        public string[] ApplyMacros<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts) => ApplyMacros(
                opts, true);

        public void NormalizeOpts<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts)
        {
            if (opts.RawArgs == null)
            {
                throw new ArgumentNullException(
                    nameof(opts.RawArgs));
            }

            opts.OptsStartChar = opts.OptsStartChar.IfDefault<char>(
                () => OPTS_START_CHAR);

            opts.OptsArgDelimChar = opts.OptsArgDelimChar.IfDefault<char>(
                () => OPTS_ARG_DELIM_CHAR);

            opts.OptsArgAltEmptyChar = opts.OptsArgAltEmptyChar.IfDefault<char>(
                () => OPTS_ARG_ALT_EMPTY_CHAR);

            opts.ArgsFactory = opts.ArgsFactory.FirstNotNull(
                Activator.CreateInstance<TArgsMtbl>);
        }

        private void Parse<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts,
            ConsoleArgsParserData<TArgsMtbl> data)
        {
            var rawArgs = ApplyMacros(opts, false);

            for (int i = 0; i < rawArgs.Length; i++)
            {
                data.ArgItem = rawArgs[i];

                SetArgItem(opts, data);
                opts.ArgsBuilder(data);
            }
        }

        private string[] ApplyMacros<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts,
            bool normalize)
        {
            if (normalize)
            {
                NormalizeOpts(opts);
            }

            opts.ExpandedRawArgs = opts.RawArgs.SelectMany(
                arg =>
                {
                    string[] argItemArr = delimCharsExtractor.SplitStr(
                        arg,
                        opts.OptsArgDelimChar,
                        opts.OptsStartChar,
                        opts.OptsArgAltEmptyChar,
                        out bool startsWithDelim);

                    if (startsWithDelim)
                    {
                        if (argItemArr[0] == opts.MacroFlagName)
                        {
                            argItemArr = argItemArr.Skip(1).SelectMany(
                                arg => opts.MacrosMap[arg]).ToArray();
                        }
                        else if (opts.MacroModifiersMap != null)
                        {
                            var modifKvp = opts.MacroModifiersMap.FirstOrDefault(
                                kvp => argItemArr[0] == kvp.Key + opts.MacroFlagName);

                            if (modifKvp.Key != null)
                            {
                                argItemArr = argItemArr.Skip(1).SelectMany(
                                    (arg, idx) =>
                                    {
                                        var retList = opts.MacrosMap[arg].ToList();
                                        var modifMap = modifKvp.Value;

                                        if (!modifMap.TryGetValue(idx, out var tuple))
                                        {
                                            if (idx == argItemArr.Length - 2 && modifMap.ContainsKey(int.MaxValue))
                                            {
                                                tuple = modifMap[int.MaxValue];
                                            }
                                            else
                                            {
                                                tuple = modifMap[-1];
                                            }
                                        }

                                        retList.InsertRange(0, tuple.Item1);
                                        retList.AddRange(tuple.Item2);

                                        return retList;
                                    }).ToArray();
                            }
                            else
                            {
                                argItemArr = [arg];
                            }
                        }
                        else
                        {
                            argItemArr = [arg];
                        }
                    }
                    else
                    {
                        argItemArr = [arg];
                    }

                    return argItemArr;
                }).ToArray();

            return opts.ExpandedRawArgs;
        }

        private void SetArgItem<TArgsMtbl>(
            ConsoleArgsParserOpts<TArgsMtbl> opts,
            ConsoleArgsParserData<TArgsMtbl> data)
        {
            string[] argItemArr = delimCharsExtractor.SplitStr(
                data.ArgItem,
                opts.OptsArgDelimChar,
                opts.OptsStartChar,
                opts.OptsArgAltEmptyChar,
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
                data.ArgItem = argItemArr.Single();
            }

            data.TotalCount++;
        }
    }
}

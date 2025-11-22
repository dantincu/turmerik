using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Helpers;

namespace Turmerik.GenClnblTypes.ConsoleApp.Components
{
    public class ProgramArgsRetriever
    {
        private readonly IConsoleArgsParser parser;

        public ProgramArgsRetriever(IConsoleArgsParser parser)
        {
            this.parser = parser ?? throw new ArgumentNullException(nameof(parser));
        }

        public ProgramArgs GetArgs(
            string[] rawArgs)
        {
            var args = parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = [
                                parser.ArgsItemOpts(data, data => data.Args.CsFilePath = data.ArgItem)
                            ],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data, "bs".Arr(),
                                    data => data.Args.BaseName = data.ArgFlagValue!.Single()),
                                parser.ArgsFlagOpts(data, "ntstd".Arr(),
                                    data => data.Args.IsNetStandard = true, true)]
                        })
                });

            return args.Args;
        }
    }
}

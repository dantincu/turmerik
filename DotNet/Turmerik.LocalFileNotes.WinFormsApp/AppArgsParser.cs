using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.ConsoleApps;
using Turmerik.Helpers;
using Turmerik.Text;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public class AppArgsParser
    {
        private readonly IConsoleArgsParser parser;

        public AppArgsParser(
            IConsoleArgsParser parser)
        {
            this.parser = parser ?? throw new ArgumentNullException(nameof(parser));
        }

        public AppArgsMtbl Parse(string[] args) => parser.Parse(
            new ConsoleArgsParserOpts<AppArgsMtbl>(args)
            {
                ArgsBuilder = data => parser.HandleArgs(
                    new ConsoleArgsParseHandlerOpts<AppArgsMtbl>
                    {
                        Data = data,
                        ThrowOnTooManyArgs = true,
                        ThrowOnUnknownFlag = true,
                        ItemHandlersArr = [
                            parser.ArgsItemOpts(data, data =>
                            {
                                data.Args.MainPath = NormPathH.NormPath(
                                    data.ArgItem, (path, isRooted) => isRooted.If(
                                        () => path, () => Path.GetFullPath(path.Nullify() ?? Environment.CurrentDirectory)));
                            })],
                        FlagHandlersArr = []
                    })
            }).Args;
    }
}

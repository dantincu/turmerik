using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.ConsoleApps
{
    public class ConsoleObjectPropsPrinterOpts
    {
        public ConsoleObjectPropsPrinterOpts()
        {
        }

        public ConsoleObjectPropsPrinterOpts(
            ConsoleObjectPropsPrinterOpts src)
        {
            SrcObject = src.SrcObject;
            IndentIncrement = src.IndentIncrement;
        }

        public object SrcObject { get; set; }
        public string IndentIncrement { get; set; }

        public ConsoleColor? StructureSymbolForegroundColor { get; set; }
        public ConsoleColor? PropNameForegroundColor { get; set; }
        public ConsoleColor? NumberForegroundColor { get; set; }
        public ConsoleColor? BooleanForegroundColor { get; set; }
        public ConsoleColor? StringForegroundColor { get; set; }
        public ConsoleColor? NullOrUndefForegroundColor { get; set; }
        public ConsoleColor? DefaultTokenForegroundColor { get; set; }

        public Func<JToken, JToken> TokenTransformer { get; set; }
        public Action OnPropPrinted { get; set; }
    }
}

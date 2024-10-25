using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Core.ConsoleApps
{
    public interface IConsoleObjectPropsPrinter
    {
        void Print(ConsoleObjectPropsPrinterOpts opts);

        ConsoleObjectPropsPrinterOpts NormalizeOpts(
            ConsoleObjectPropsPrinterOpts opts);
    }

    public class ConsoleObjectPropsPrinter : IConsoleObjectPropsPrinter
    {
        private readonly IJsonConversion jsonConversion;

        public ConsoleObjectPropsPrinter(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
        }

        public ConsoleObjectPropsPrinterOpts NormalizeOpts(
            ConsoleObjectPropsPrinterOpts opts) => new(opts)
            {
                IndentIncrement = opts.IndentIncrement ?? "  ",
                StructureSymbolForegroundColor = opts.StructureSymbolForegroundColor ?? ConsoleColor.Cyan,
                PropNameForegroundColor = opts.PropNameForegroundColor ?? ConsoleColor.Yellow,
                NumberForegroundColor = opts.NumberForegroundColor ?? ConsoleColor.Magenta,
                BooleanForegroundColor = opts.NumberForegroundColor ?? ConsoleColor.Magenta,
                StringForegroundColor = opts.NumberForegroundColor ?? ConsoleColor.DarkYellow,
                NullOrUndefForegroundColor = opts.NullOrUndefForegroundColor ?? ConsoleColor.DarkMagenta,
                DefaultTokenForegroundColor = opts.DefaultTokenForegroundColor ?? ConsoleColor.Red,
                TokenTransformer = opts.TokenTransformer.FirstNotNull(token => token),
                OnPropPrinted = opts.OnPropPrinted.FirstNotNull(() => { })
            };

        public void Print(ConsoleObjectPropsPrinterOpts opts)
        {
            opts = NormalizeOpts(opts);

            var jToken = JToken.Parse(
                jsonConversion.Adapter.Serialize(
                    opts.SrcObject));

            PrintCore(opts, jToken, "");
        }

        private void PrintCore(
            ConsoleObjectPropsPrinterOpts opts,
            JToken jToken,
            string currentIndent)
        {
            bool isFirstItem = true;
            string childIndent = currentIndent + opts.IndentIncrement;

            jToken = opts.TokenTransformer(jToken);

            if (jToken is JArray jArray)
            {
                PrintStructureSymbol(opts, currentIndent + "[");
                
                foreach (var childToken in jArray)
                {
                    PrintCommaIfReq(opts, ref isFirstItem);
                    PrintCore(opts, childToken, childIndent);
                    opts.OnPropPrinted();
                }

                if (!isFirstItem)
                {
                    PrintNewLine();
                }

                PrintStructureSymbol(opts, currentIndent + "]");
            }
            else if (jToken is JObject jObject)
            {
                PrintStructureSymbol(opts, currentIndent + "{");

                foreach (var kvp in jObject)
                {
                    if (kvp.Value != null)
                    {
                        PrintCommaIfReq(opts, ref isFirstItem);
                        PrintStr($"{childIndent}\"{kvp.Key}\"", opts.PropNameForegroundColor!.Value);
                        PrintStructureSymbol(opts, ": ", false);
                        PrintCore(opts, kvp.Value, childIndent);
                        opts.OnPropPrinted();
                    }
                }

                if (!isFirstItem)
                {
                    PrintNewLine();
                }

                PrintStructureSymbol(opts, currentIndent + "}");
            }
            else
            {
                string str = jToken.ToString();

                if (jToken.Type == JTokenType.String)
                {
                    str = str.Replace(
                        "\\", "\\\\").Replace(
                        "\"", "\\\"");

                    str = $"\"{str}\"";
                }

                PrintStr(str, GetJTokenValueForegroundColor(
                        opts, jToken));
            }
        }

        private void PrintCommaIfReq(
            ConsoleObjectPropsPrinterOpts opts,
            ref bool isFirstItem)
        {
            if (!isFirstItem)
            {
                PrintStructureSymbol(opts, ",");
            }
            else
            {
                isFirstItem = false;
            }
        }

        private void PrintNewLine() => Console.WriteLine();

        private void PrintStr(
            string str,
            ConsoleColor foregroundColor)
        {
            Console.ForegroundColor = foregroundColor;
            Console.Write(str);
            Console.ResetColor();
        }

        private void PrintStructureSymbol(
            ConsoleObjectPropsPrinterOpts opts,
            string symbol,
            bool addNewLine = true)
        {
            PrintStr(symbol, opts.StructureSymbolForegroundColor!.Value);

            if (addNewLine)
            {
                PrintNewLine();
            }
        }

        private ConsoleColor GetJTokenValueForegroundColor(
            ConsoleObjectPropsPrinterOpts opts,
            JToken jToken)
        {
            ConsoleColor foregroundColor;

            switch (jToken.Type)
            {
                case JTokenType.Integer:
                case JTokenType.Float:
                    foregroundColor = opts.NumberForegroundColor!.Value;
                    break;
                case JTokenType.Boolean:
                    foregroundColor = opts.BooleanForegroundColor!.Value;
                    break;
                case JTokenType.String:
                    foregroundColor = opts.StringForegroundColor!.Value;
                    break;
                case JTokenType.Null:
                case JTokenType.Undefined:
                    foregroundColor = opts.NullOrUndefForegroundColor!.Value;
                    break;
                default:
                    foregroundColor = opts.DefaultTokenForegroundColor!.Value;
                    break;
            }

            return foregroundColor;
        }
    }
}

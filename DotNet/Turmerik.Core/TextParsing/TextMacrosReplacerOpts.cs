using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.Core.TextParsing
{
    public class TextMacrosReplacerOpts
    {
        public TextMacrosReplacerOpts()
        {
        }

        public TextMacrosReplacerOpts(
            TextMacrosReplacerOpts src)
        {
            MacroRegex = src.MacroRegex;
            ValidMacroRegex = src.ValidMacroRegex;
            InputText = src.InputText;
            MacrosMap = src.MacrosMap;
            DefaultReplacer = src.DefaultReplacer;
            ThrowOnUnknownMacro = src.ThrowOnUnknownMacro;
        }

        public Regex MacroRegex { get; set; }
        public Regex ValidMacroRegex { get; set; }
        public string InputText { get; set; }
        public IEnumerable<KeyValuePair<string, string>> MacrosMap { get; set; }
        public Func<RegexReplacerResult, MatchDataMtbl, string, string> DefaultReplacer { get; set; }
        public bool? ThrowOnUnknownMacro { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.TextParsing
{
    public interface ITextMacrosReplacer
    {
        Regex DefaultMacroRegex { get; }
        Regex DefaultValidMacroRegex { get; }

        string ReplacePathMacros(
            TextMacrosReplacerOpts opts);

        TextMacrosReplacerOpts NormalizeOpts(
            TextMacrosReplacerOpts opts);
    }

    public class TextMacrosReplacer : ITextMacrosReplacer
    {
        private readonly IRegexReplacer regexReplacer;

        public TextMacrosReplacer(
            IRegexReplacer regexReplacer)
        {
            this.regexReplacer = regexReplacer ?? throw new ArgumentNullException(
                nameof(regexReplacer));

            DefaultMacroRegex = new Regex(@"\<[^\>]+\>");
            DefaultValidMacroRegex = new Regex(@"^\<[^\<\>]+\>$");
        }

        public string MacroRegexStr { get; }
        public Regex DefaultMacroRegex { get; }
        public Regex DefaultValidMacroRegex { get; }

        public string ReplacePathMacros(
            TextMacrosReplacerOpts opts)
        {
            opts = NormalizeOpts(opts);
            var pathMaps = opts.MacrosMap.Dictnr();

            var result = regexReplacer.ReplaceAll(new RegexReplacerOpts
            {
                InputText = opts.InputText,
                SearchRegex = opts.MacroRegex,
                ValidMatchRegex = opts.ValidMacroRegex,
                NextMatchReplacer = (rslt, match, inputText) => pathMaps.TryGetValue(
                    match.Value, out var replStr) switch
                    {
                        true => replStr,
                        false => opts.DefaultReplacer(rslt, match, inputText)
                    }
            });

            return result.ReplacedText;
        }

        public TextMacrosReplacerOpts NormalizeOpts(
            TextMacrosReplacerOpts opts)
        {
            opts = new TextMacrosReplacerOpts(opts);
            opts.ThrowOnUnknownMacro ??= true;

            opts.MacroRegex ??= DefaultMacroRegex;
            opts.ValidMacroRegex ??= DefaultValidMacroRegex;

            opts.DefaultReplacer = opts.DefaultReplacer.FirstNotNull(
                (rslt, match, inputText) => opts.ThrowOnUnknownMacro.Value switch
                {
                    true => throw new InvalidOperationException(
                        $"Unknown macro {match.Value}"),
                    false => match.Value
                });

            return opts;
        }
    }
}

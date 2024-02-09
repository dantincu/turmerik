using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.Core.TextParsing
{
    public class RegexReplacerOpts
    {
        public RegexReplacerOpts()
        {
        }

        public RegexReplacerOpts(
            RegexReplacerOpts src)
        {
            InputText = src.InputText;
            ValidInputTextPredicate = src.ValidInputTextPredicate;
            SearchRegexStr = src.SearchRegexStr;
            SearchRegex = src.SearchRegex;
            ValidMatchPredicate = src.ValidMatchPredicate;
            ValidMatchRegexStr = src.ValidMatchRegexStr;
            ValidMatchRegex = src.ValidMatchRegex;
            InvalidMatchHandler = src.InvalidMatchHandler;
            OverlappingMatchHandler = src.OverlappingMatchHandler;
            AllowInvalidMatch = src.AllowInvalidMatch;
            AllowOverlappingMatch = src.AllowOverlappingMatch;
            NextMatchReplacer = src.NextMatchReplacer;
        }

        public string InputText { get; set; }

        public Func<string, bool> ValidInputTextPredicate { get; set; }

        public string SearchRegexStr { get; set; }
        public Regex SearchRegex { get; set; }

        public Func<RegexReplacerResult, MatchDataMtbl, bool> ValidMatchPredicate { get; set; }
        public string ValidMatchRegexStr { get; set; }
        public Regex ValidMatchRegex { get; set; }

        public Func<RegexReplacerResult, MatchDataMtbl, bool> InvalidMatchHandler { get; set; }
        public Func<RegexReplacerResult, MatchDataMtbl, MatchDataMtbl, bool> OverlappingMatchHandler { get; set; }

        public bool? AllowInvalidMatch { get; set; }
        public bool? AllowOverlappingMatch { get; set; }

        public Func<RegexReplacerResult, MatchDataMtbl, string, string> NextMatchReplacer { get; set; }
    }
}

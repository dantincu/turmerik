using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.XPath;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.Core.TextParsing
{
    public interface IRegexReplacer
    {
        RegexReplacerResult ReplaceAll(
            RegexReplacerOpts opts);

        void NormalizeMatches(
            RegexReplacerResult result);

        RegexReplacerOpts NormalizeOpts(
            RegexReplacerOpts opts);
    }

    public class RegexReplacer : IRegexReplacer
    {
        public RegexReplacerResult ReplaceAll(
            RegexReplacerOpts opts)
        {
            opts = NormalizeOpts(opts);

            var result = new RegexReplacerResult
            {
                NormOpts = opts,
                ReplacedText = opts.InputText,
            };

            bool @continue = opts.ValidInputTextPredicate(
                opts.InputText);

            while (@continue)
            {
                result.MatchesList = opts.SearchRegex.Matches(
                    result.ReplacedText).ToMtblMatchesArr().ToList();

                @continue = result.MatchesList.Count > 0;
                NormalizeMatches(result);

                for (int i = 0; i < result.MatchesList.Count; i++)
                {
                    var match = result.MatchesList[i];

                    string replStr = opts.NextMatchReplacer(
                        result, match, result.ReplacedText);

                    result.ReplacedText = string.Concat(
                        result.ReplacedText.Substring(0, match.Index),
                        replStr,
                        result.ReplacedText.Substring(
                            match.Index + match.Length));

                    int lenDiff = replStr.Length - match.Length;

                    if (lenDiff != 0)
                    {
                        for (int j = i + 1; j < result.MatchesList.Count; j++)
                        {
                            result.MatchesList[j].Index += lenDiff;
                        }
                    }
                }
            }

            return result;
        }

        public void NormalizeMatches(
            RegexReplacerResult result)
        {
            int i = 0;
            var opts = result.NormOpts;
            MatchDataMtbl prevMatch = null;

            while (i < result.MatchesList.Count)
            {
                var match = result.MatchesList[i];
                bool removed = false;

                if (!opts.ValidMatchPredicate(
                    result, match))
                {
                    if (!opts.AllowInvalidMatch.Value)
                    {
                        throw new InvalidOperationException(
                            $"Found invalid match: {match.Value}");
                    }
                    else if (!opts.InvalidMatchHandler(result, match))
                    {
                        result.MatchesList.RemoveAt(i);
                        removed = true;
                    }
                }

                if (!removed)
                {
                    if (prevMatch != null)
                    {
                        if (prevMatch.Index + prevMatch.Length >= match.Index)
                        {
                            if (!opts.AllowOverlappingMatch.Value)
                            {
                                throw new InvalidOperationException(
                                    string.Join(" ", "Found overlapping match: ",
                                        $"\"{prevMatch.Value}\" starting at {prevMatch.Index} with length {prevMatch.Length}",
                                        $"overlaps with \"{match.Value}\" starting at {match.Index} with length {match.Length}"));
                            }
                            else if (!opts.OverlappingMatchHandler(result, prevMatch, match))
                            {
                                result.MatchesList.RemoveAt(i);
                                removed = true;
                            }
                        }
                    }

                    prevMatch = match;
                }

                if (!removed)
                {
                    i++;
                }
            }
        }

        public RegexReplacerOpts NormalizeOpts(
            RegexReplacerOpts opts)
        {
            opts = new RegexReplacerOpts(opts);
            opts.AllowInvalidMatch ??= false;
            opts.AllowOverlappingMatch ??= false;

            opts.SearchRegex ??= new Regex(opts.SearchRegexStr);

            opts.ValidInputTextPredicate = opts.ValidInputTextPredicate.FirstNotNull(
                inputText => true);

            if (opts.ValidMatchPredicate == null)
            {
                opts.ValidMatchRegex ??= new Regex(opts.ValidMatchRegexStr);

                opts.ValidMatchPredicate = (result, match) => opts.ValidMatchRegex.IsMatch(
                    match.Value);
            }

            opts.InvalidMatchHandler ??= (result, match) => false;
            opts.OverlappingMatchHandler ??= (result, prevMatch, match) => false;

            return opts;
        }
    }
}

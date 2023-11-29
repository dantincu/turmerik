using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Core.Text;

namespace Turmerik.Code.Core
{
    public interface INameToIdnfConverter
    {
        string Convert(
            NameToIdnfConverterOpts opts);
    }

    public class NameToIdnfConverter : INameToIdnfConverter
    {
        public string Convert(
            NameToIdnfConverterOpts opts)
        {
            DestructureNormalizeOpts(opts,
                out var idnf,
                out var otherAllowedChars,
                out var otherStartingAllowedChars,
                out var disalowedStartingCharsPfx,
                out var disalowedReplacingChar,
                out var replacingCharsMap,
                out var replacingRegexes);

            if (idnf.Any())
            {
                char firstChr = idnf.First();

                if (!(char.IsLetter(firstChr) || otherStartingAllowedChars.Contains(firstChr)))
                {
                    idnf = $"{disalowedStartingCharsPfx}{idnf}";
                }

                if (!idnf.All(c => CharH.IsAsciiLetterOrDigit(c) || otherAllowedChars.Contains(c)))
                {
                    foreach (var kvp in replacingCharsMap)
                    {
                        idnf = idnf.Replace(kvp.Key, kvp.Value);
                    }

                    foreach (var kvp in replacingRegexes)
                    {
                        var matches = kvp.Regex.Matches(idnf);

                        foreach (Match match in matches)
                        {
                            string replacing = kvp.ReplacingTextFactory(match.Value);

                            idnf = idnf.ReplaceStr(
                                match.Index,
                                match.Value.Length,
                                replacing);
                        }
                    }

                    var charsNmrbl = idnf.Select(
                        c => CharH.IsAsciiLetterOrDigit(c) || otherAllowedChars.Contains(c) ? c : disalowedReplacingChar);

                    if (disalowedReplacingChar == default)
                    {
                        idnf = new string(charsNmrbl.Where(
                            c => c != default).ToArray());
                    }
                    else
                    {
                        idnf = new string(charsNmrbl.ToArray());
                    }
                }
            }

            return idnf;
        }

        private void DestructureNormalizeOpts(
            NameToIdnfConverterOpts opts,
            out string idnf,
            out string otherAllowedChars,
            out string otherStartingAllowedChars,
            out string disalowedStartingCharsPfx,
            out char disalowedReplacingChar,
            out Dictionary<string, string> replacingCharsMap,
            out List<IdentifierReplacingRegexTuple> replacingRegexes)
        {
            idnf = opts.InputIdentifier;
            otherAllowedChars = (opts.OtherAllowedChars ??= "_$");
            otherStartingAllowedChars = (opts.OtherStartingAllowedChars ??= "_$");
            disalowedStartingCharsPfx = (opts.DisalowedStartingCharsPfx ??= "_");
            disalowedReplacingChar = opts.DisalowedReplacingChar ?? '_';

            replacingCharsMap = (opts.ReplacingStrsMap ??= new Dictionary<string, string>
            {
                { "&amp;", "_n_" }
            });

            replacingRegexes = (opts.ReplacingRegexes ??= new List<IdentifierReplacingRegexTuple>
            {
                new IdentifierReplacingRegexTuple
                {
                    Regex = CommonRegexesH.HtmlEntity,
                }
            });

            foreach (var tuple in opts.ReplacingRegexes)
            {
                if (tuple.ReplacingTextFactory == null)
                {
                    tuple.ReplacingText ??= "_";
                    tuple.ReplacingTextFactory ??= text => tuple.ReplacingText;
                }
            }
        }
    }
}

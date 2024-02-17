using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.Core.TextParsing
{
    public interface IStringLiteralTransformer
    {
        ReadOnlyDictionary<string, string> EscapeCharsMap { get; }
        ReadOnlyDictionary<string, string> QuotedCharsMap { get; }

        string QuoteStr(
            string str,
            bool dblQuote = true,
            IEnumerable<KeyValuePair<string, string>> escapeCharsMap = null,
            IEnumerable<KeyValuePair<string, string>> quotedCharsMap = null);

        string UnquoteStr(
            string str,
            bool dblQuote = true,
            IEnumerable<KeyValuePair<string, string>> escapeCharsMap = null,
            IEnumerable<KeyValuePair<string, string>> quotedCharsMap = null);
    }

    public class StringLiteralTransformer : IStringLiteralTransformer
    {
        public StringLiteralTransformer()
        {
            EscapeCharsMap = new Dictionary<string, string>
            {
                { "\\", "\\\\" },
            }.RdnlD();

            QuotedCharsMap = new Dictionary<string, string>
            {
                { "\n", "\\\n" },
                { "\r", "\\\r" },
                { "\t", "\\\t" },
                { "\"", "\\\"" },
                { "\'", "\\\'" }
            }.RdnlD();
        }

        public ReadOnlyDictionary<string, string> EscapeCharsMap { get; }
        public ReadOnlyDictionary<string, string> QuotedCharsMap { get; }

        public string QuoteStr(
            string str,
            bool dblQuote = true,
            IEnumerable<KeyValuePair<string, string>> escapeCharsMap = null,
            IEnumerable<KeyValuePair<string, string>> quotedCharsMap = null)
        {
            escapeCharsMap ??= EscapeCharsMap;
            quotedCharsMap ??= QuotedCharsMap;

            foreach (var kvp in escapeCharsMap)
            {
                str = str.Replace(kvp.Key, kvp.Value);
            }

            foreach (var kvp in quotedCharsMap)
            {
                str = str.Replace(kvp.Key, kvp.Value);
            }

            return str;
        }

        public string UnquoteStr(
            string str,
            bool dblQuote = true,
            IEnumerable<KeyValuePair<string, string>> escapeCharsMap = null,
            IEnumerable<KeyValuePair<string, string>> quotedCharsMap = null)
        {
            escapeCharsMap ??= EscapeCharsMap;
            quotedCharsMap ??= QuotedCharsMap;

            foreach (var kvp in quotedCharsMap)
            {
                str = str.Replace(kvp.Value, kvp.Key);
            }

            foreach (var kvp in escapeCharsMap)
            {
                str = str.Replace(kvp.Value, kvp.Key);
            }

            return str;
        }
    }
}

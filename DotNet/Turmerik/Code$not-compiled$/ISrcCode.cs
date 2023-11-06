using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using Turmerik.Text;

namespace Turmerik.Code
{
    public interface ISrcCode
    {
        int Length { get; }
        char Char { get; }
        int StartIndex { get; set; }
        int Index { get; set; }

        char this[int index] { get; }

        int DragStartIndex();

        char Append(string nextChunk);
        char Append(IEnumerable<char> nextNmrbl);

        string GetSubstring(
            int startIndex,
            int length);

        string GetSubstring(
            int startIndex,
            int length,
            out bool indexOutOfRange);

        string GetStrSlice(
            int startIndex,
            int endIndex);

        string GetStrSlice(
            int startIndex,
            int endIndex,
            out bool indexOutOfRange);

        Tuple<int, char, int> ForEach(
            int startIndex,
            Func<char, int, bool> stopPredicate,
            Func<char, int, int> nextIdxPredicate);
    }
}

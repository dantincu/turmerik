using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.DriveExplorer.DirsPair
{
    public interface INoteDirsPairIdxRetriever
    {
         bool TryGetNoteDirsPairIdx(
            ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> dirNamesRegexMap,
            string dirName,
            out Tuple<int, NoteDirTypeTuple, NoteDirRegexTuple> match);
    }

    public class NoteDirsPairIdxRetriever : INoteDirsPairIdxRetriever
    {
        public bool TryGetNoteDirsPairIdx(
            ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> dirNamesRegexMap,
            string dirName,
            out Tuple<int, NoteDirTypeTuple, NoteDirRegexTuple> match)
        {
            bool foundMatch = false;
            int idx = -1;
            NoteDirTypeTuple dirTypeTuple = default;
            NoteDirRegexTuple dirRegexTuple = default;

            foreach (var kvp in dirNamesRegexMap)
            {
                var regexMatch = kvp.Value.Regex.Match(dirName);

                if (regexMatch?.Success ?? false)
                {
                    string idxStr = regexMatch.Value.Substring(
                        kvp.Value.Prefix.Length);

                    foundMatch = true;
                    idx = int.Parse(idxStr);

                    dirTypeTuple = kvp.Key;
                    dirRegexTuple = kvp.Value;

                    break;
                }
            }

            match = Tuple.Create(
                idx, dirTypeTuple, dirRegexTuple);

            return foundMatch;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public enum DirType
    {
        ShortName,
        FullName
    }

    public enum DirCategory
    {
        TrmrkNote,
        TrmrkInternals
    }

    public static class DirPairsH
    {
        public static HashSet<int> GetExistingIdxes(
            string[] existingEntriesArr,
            IEnumerable<KeyValuePair<DirType, Regex>> regexMap,
            string joinChar)
        {
            var idxes = new HashSet<int>();

            foreach (var entry in existingEntriesArr)
            {
                foreach (var kvp in regexMap)
                {
                    if (kvp.Value.IsMatch(entry))
                    {
                        string idxStr = entry;

                        if (kvp.Key == DirType.FullName)
                        {
                            idxStr = idxStr.SplitStr(
                                (nmrbl, count) => nmrbl.IndexOfStr(joinChar)).Item1;
                        }

                        int idx = int.Parse(idxStr);

                        if (idx > 0)
                        {
                            idxes.Add(idx);
                        }

                        break;
                    }
                }
            }

            return idxes;
        }

        public static int GetNextIdx(
            HashSet<int> idxesSet)
        {
            int nextIdx = 1;
            int idxesCount = idxesSet.Count;

            if (idxesCount >= 2)
            {
                var idxesList = idxesSet.ToList();
                idxesList.Sort();

                int prevIdx = 0;
                int maxI = idxesCount - 1;

                for (int i = 0; i <= maxI; i++)
                {
                    var idx = idxesList[i] - 1;

                    if (idx > prevIdx || i == maxI)
                    {
                        nextIdx = prevIdx + 2;
                        break;
                    }
                    else
                    {
                        prevIdx = idx + 1;
                    }
                }
            }
            else if (idxesCount == 1 && idxesSet.Single() == 1)
            {
                nextIdx = 2;
            }

            return nextIdx;
        }
    }
}

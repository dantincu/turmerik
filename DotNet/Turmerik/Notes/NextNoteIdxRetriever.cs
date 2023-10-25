using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Notes
{
    public class NextNoteIdxRetriever
    {
        public int GetNextNoteIdx(
            int[] sortedIdxesArr,
            int defaultIdx)
        {
            int nextIdx = defaultIdx;
            int firstGapStartVal = GetFirstGapStartVal(sortedIdxesArr, 1);

            if (firstGapStartVal >= 0)
            {
                nextIdx = firstGapStartVal + 1;
            }

            return nextIdx;
        }

        public int GetFirstGapStartVal(
            int[] sortedIdxesArr,
            int intervalMinLength)
        {
            int gapStartVal = -1;

            if (sortedIdxesArr.Any())
            {
                gapStartVal = sortedIdxesArr[0];

                for (int i = 1; i < sortedIdxesArr.Length; i++)
                {
                    int currentIdx = sortedIdxesArr[i];
                    int prevGapStartVal = gapStartVal;
                    gapStartVal = currentIdx;

                    if (gapStartVal - prevGapStartVal > intervalMinLength)
                    {
                        break;
                    }
                }
            }

            return gapStartVal;
        }
    }
}

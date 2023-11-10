using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Notes
{
    public interface INextNoteIdxRetriever
    {
        int GetNextIdx(
            NoteDirsPairConfig.IDirNameIdxesT cfg,
            int[] sortedIdxesArr);

        int GetNextIdx(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            bool desc = false);

        int GetNextIdxAsc(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal);

        int GetNextIdxDesc(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal);

        int GetNextFillingGapsIdx(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            bool desc = false);

        Tuple<int, bool, int, int> GetFirstGap(
            int[] sortedIdxesArr,
            int intervalMinLength,
            int minVal,
            int maxVal,
            bool desc = false);

        Tuple<int, bool, int, int> GetFirstGap(
            int[] sortedIdxesArr,
            int intervalMinLength,
            int minVal,
            int maxVal,
            Func<int, int, int> diffFactory,
            Func<int, int, int> dfValFactory);
    }

    public class NextNoteIdxRetriever : INextNoteIdxRetriever
    {
        public const int DF_MIN_VALUE = 1;
        public const int DF_MAX_VALUE = 999;

        public int GetNextIdx(
            NoteDirsPairConfig.IDirNameIdxesT cfg,
            int[] sortedIdxesArr)
        {
            int nextIdx;

            int minVal = cfg.MinIdx ?? DF_MIN_VALUE;
            int maxVal = cfg.MaxIdx ?? DF_MAX_VALUE;

            bool desc = cfg.IncIdx == false;

            if (cfg.FillGapsByDefault == true)
            {
                nextIdx = GetNextFillingGapsIdx(
                    sortedIdxesArr,
                    minVal,
                    maxVal,
                    desc);
            }
            else
            {
                nextIdx = GetNextIdx(
                    sortedIdxesArr,
                    minVal,
                    maxVal,
                    desc);
            }

            return nextIdx;
        }

        public int GetNextIdx(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            bool desc = false) => desc switch
            {
                false => GetNextIdxAsc(
                    sortedIdxesArr,
                    minVal,
                    maxVal),
                true => GetNextIdxDesc(
                    sortedIdxesArr,
                    minVal,
                    maxVal)
            };

        public int GetNextIdxAsc(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal)
        {
            int nextIdx;

            var kvp = sortedIdxesArr.LastKvp(
                (idx, i) => idx <= maxVal);

            if (kvp.Key >= 0)
            {
                nextIdx = kvp.Value + 1;

                if (nextIdx >= maxVal)
                {
                    sortedIdxesArr = sortedIdxesArr.Skip(
                        kvp.Key).ToArray();

                    nextIdx = GetNextFillingGapsIdx(
                        sortedIdxesArr,
                        maxVal,
                        int.MaxValue,
                        false);
                }
            }
            else
            {
                nextIdx = minVal;
            }

            return nextIdx;
        }

        public int GetNextIdxDesc(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal)
        {
            int nextIdx;

            var kvp = sortedIdxesArr.LastKvp(
                (idx, i) => idx >= minVal);

            if (kvp.Key >= 0)
            {
                nextIdx = kvp.Value - 1;

                if (nextIdx < minVal)
                {
                    sortedIdxesArr = sortedIdxesArr.Skip(
                        kvp.Key).ToArray();

                    nextIdx = GetNextFillingGapsIdx(
                        sortedIdxesArr,
                        int.MinValue,
                        minVal,
                        true);
                }
            }
            else
            {
                nextIdx = maxVal;
            }

            return nextIdx;
        }

        public int GetNextFillingGapsIdx(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            bool desc = false)
        {
            (int gapStartIdx, bool gapFound, int gapEndIdx, int idx) = GetFirstGap(
                sortedIdxesArr, 1, minVal, maxVal, desc);

            int nextIdx = gapFound ? gapStartIdx : gapEndIdx;
            int incVal = (gapFound && idx == 0) ? 0 : desc ? -1 : 1;

            nextIdx += incVal;
            return nextIdx;
        }

        public Tuple<int, bool, int, int> GetFirstGap(
            int[] sortedIdxesArr,
            int intervalMinLength,
            int minVal,
            int maxVal,
            bool desc = false) => GetFirstGap(
                sortedIdxesArr,
                intervalMinLength,
                minVal, maxVal,
                desc switch
                {
                    false => (stVal, endVal) => endVal - stVal,
                    true => (stVal, endVal) => stVal - endVal,
                },
                desc switch
                {
                    false => (min, max) => min,
                    true => (min, max) => max,
                });

        public Tuple<int, bool, int, int> GetFirstGap(
            int[] sortedIdxesArr,
            int intervalMinLength,
            int minVal,
            int maxVal,
            Func<int, int, int> diffFactory,
            Func<int, int, int> dfValFactory)
        {
            int gapEndVal = dfValFactory(minVal, maxVal);
            int gapStartVal = gapEndVal;
            bool gapFound = false;
            intervalMinLength--;
            int idx;

            for (idx = 0; idx < sortedIdxesArr.Length; idx++)
            {
                gapStartVal = gapEndVal;
                gapEndVal = sortedIdxesArr[idx];

                if (diffFactory(gapStartVal, gapEndVal) > intervalMinLength)
                {
                    gapFound = true;
                    break;
                }
                else if (idx == 0)
                {
                    intervalMinLength++;
                }
            }

            return Tuple.Create(
                gapStartVal,
                gapFound,
                gapEndVal,
                idx);
        }
    }
}

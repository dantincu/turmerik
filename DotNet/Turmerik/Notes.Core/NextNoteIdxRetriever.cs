using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Notes.Core
{
    public interface INextNoteIdxRetriever
    {
        int GetNextIdx(
            NoteDirsPairConfig.IDirNameIdxesT cfg,
            HashSet<int> idxesSet,
            out bool isFillingGap,
            out bool isOutOfBounds);

        int GetNextIdx(
            NoteDirsPairConfig.IDirNameIdxesT cfg,
            int[] sortedIdxesArr,
            out bool isFillingGap,
            out bool isOutOfBounds);

        int GetNextIdx(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            out bool isFillingGap,
            out bool isOutOfBounds,
            bool desc = false);

        int GetNextIdxAsc(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            out bool isFillingGap,
            out bool isOutOfBounds);

        int GetNextIdxDesc(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            out bool isFillingGap,
            out bool isOutOfBounds);

        int GetNextFillingGapsIdx(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            out bool isOutOfBounds,
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
            HashSet<int> idxesSet,
            out bool isFillingGap,
            out bool isOutOfBounds)
        {
            int[] sortedIdxesArr;
            bool desc = cfg.IncIdx == false;

            if (desc)
            {
                sortedIdxesArr = idxesSet.OrderByDescending(x => x).ToArray();
            }
            else
            {
                sortedIdxesArr = idxesSet.OrderBy(x => x).ToArray();
            }

            int nextIdx = GetNextIdx(
                cfg, sortedIdxesArr,
                out isFillingGap,
                out isOutOfBounds);

            return nextIdx;
        }

        public int GetNextIdx(
            NoteDirsPairConfig.IDirNameIdxesT cfg,
            int[] sortedIdxesArr,
            out bool isFillingGap,
            out bool isOutOfBounds)
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
                    out isOutOfBounds,
                    desc);

                isFillingGap = true;
            }
            else
            {
                nextIdx = GetNextIdx(
                    sortedIdxesArr,
                    minVal,
                    maxVal,
                    out isFillingGap,
                    out isOutOfBounds,
                    desc);
            }

            return nextIdx;
        }

        public int GetNextIdx(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            out bool isFillingGap,
            out bool isOutOfBounds,
            bool desc = false) => desc switch
            {
                false => GetNextIdxAsc(
                    sortedIdxesArr,
                    minVal,
                    maxVal,
                    out isFillingGap,
                    out isOutOfBounds),
                true => GetNextIdxDesc(
                    sortedIdxesArr,
                    minVal,
                    maxVal,
                    out isFillingGap,
                    out isOutOfBounds)
            };

        public int GetNextIdxAsc(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            out bool isFillingGap,
            out bool isOutOfBounds)
        {
            int nextIdx = minVal;
            isOutOfBounds = false;
            isFillingGap = false;

            if (sortedIdxesArr.Any())
            {
                var kvp = sortedIdxesArr.LastKvp(
                    (idx, i) => idx <= maxVal);

                if (kvp.Key >= 0)
                {
                    nextIdx = kvp.Value + 1;

                    if (nextIdx > maxVal)
                    {
                        sortedIdxesArr = sortedIdxesArr.Skip(
                            kvp.Key).ToArray();

                        nextIdx = GetNextFillingGapsIdx(
                            sortedIdxesArr,
                            minVal,
                            maxVal,
                            out isOutOfBounds,
                            false);

                        isFillingGap = true;
                    }
                }
                else
                {
                    isOutOfBounds = true;
                }
            }

            return nextIdx;
        }

        public int GetNextIdxDesc(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            out bool isFillingGap,
            out bool isOutOfBounds)
        {
            int nextIdx = maxVal;
            isOutOfBounds = false;
            isFillingGap = false;

            if (sortedIdxesArr.Any())
            {
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
                            minVal,
                            maxVal,
                            out isOutOfBounds,
                            true);

                        isFillingGap = true;
                    }
                }
                else
                {
                    isOutOfBounds = true;
                }
            }

            return nextIdx;
        }

        public int GetNextFillingGapsIdx(
            int[] sortedIdxesArr,
            int minVal,
            int maxVal,
            out bool isOutOfBounds,
            bool desc = false)
        {
            int nextIdx = desc ? maxVal : minVal;

            if (sortedIdxesArr.Any())
            {
                (int gapStartIdx, bool gapFound, int gapEndIdx, int idx) = GetFirstGap(
                sortedIdxesArr, 1, minVal, maxVal, desc);

                nextIdx = gapFound ? gapStartIdx : gapEndIdx;
                int incVal = gapFound && idx == 0 ? 0 : desc ? -1 : 1;

                nextIdx += incVal;
                isOutOfBounds = nextIdx < minVal || nextIdx > maxVal;
            }
            else
            {
                isOutOfBounds = false;
            }

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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class ColctnH
    {
        public static bool All<T>(this IEnumerable<T> nmrbl, Func<T, int, bool> predicate)
        {
            bool retVal = true;
            int idx = 0;

            foreach (T item in nmrbl)
            {
                if (!(retVal = retVal && predicate(item, idx++)))
                {
                    break;
                }
            }

            return retVal;
        }

        public static bool Any<T>(this IEnumerable<T> nmrbl, Func<T, int, bool> predicate)
        {
            bool retVal = false;
            int idx = 0;

            foreach (T item in nmrbl)
            {
                if (retVal = retVal && predicate(item, idx++))
                {
                    break;
                }
            }

            return retVal;
        }

        public static bool None<T>(this IEnumerable<T> nmrbl)
        {
            bool retVal = nmrbl.Any() == false;
            return retVal;
        }

        public static bool None<T>(this IEnumerable<T> nmrbl, Func<T, bool> predicate)
        {
            bool retVal = nmrbl.Any(predicate) == false;
            return retVal;
        }

        public static bool None<T>(this IEnumerable<T> nmrbl, Func<T, int, bool> predicate)
        {
            bool retVal = nmrbl.Any(predicate) == false;
            return retVal;
        }

        public static int NthIdxOf<T>(
            this IEnumerable<T> nmrbl,
            T value,
            int count,
            bool orLast = false,
            IEqualityComparer<T> eqCompr = null)
        {
            eqCompr = eqCompr ?? EqualityComparer<T>.Default;
            int i = 0;

            int matchCount = 0;
            int nthIdx = -1;

            foreach (var val in nmrbl)
            {
                if (eqCompr.Equals(value, val))
                {
                    if (matchCount == count)
                    {
                        nthIdx = i;
                        break;
                    }
                    else if (orLast)
                    {
                        nthIdx = i;
                    }

                    matchCount++;
                }

                i++;
            }

            return nthIdx;
        }
    }
}

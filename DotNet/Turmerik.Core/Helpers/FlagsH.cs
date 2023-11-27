using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Helpers
{
    public static class FlagsH
    {
        public static bool IfHasFlag<TData, TFlag>(
            this TData data,
            TFlag actualFlag,
            TFlag expectedFlag,
            Func<TData, TFlag, bool> ifHasFlagCallback,
            Func<TData, TFlag, bool> ifDoesNotHaveFlagCallback)
            where TFlag : struct, Enum
        {
            bool matches;
            bool hasFlag = actualFlag.HasFlag(expectedFlag);

            if (hasFlag)
            {
                matches = ifHasFlagCallback(data, actualFlag);
            }
            else if (ifDoesNotHaveFlagCallback != null)
            {
                matches = ifDoesNotHaveFlagCallback(data, actualFlag);
            }
            else
            {
                throw new ArgumentNullException(
                    nameof(ifDoesNotHaveFlagCallback));
            }

            return matches;
        }

        public static bool IfHasFlag<TData, TFlag>(
            this TData data,
            TFlag actualFlag,
            TFlag expectedFlag,
            Func<TData, TFlag, bool> ifHasFlagCallback,
            bool ifDoesNotHaveFlagRetValue)
            where TFlag : struct, Enum => data.IfHasFlag(
                actualFlag,
                expectedFlag,
                ifHasFlagCallback,
                (obj, flag) => ifDoesNotHaveFlagRetValue);

        public static bool IfHasAnyFlag<TData, TFlag>(
            this TData data,
            TFlag actualFlag,
            IDictionary<TFlag, Func<TData, TFlag, bool>> flagCallbacksMap,
            bool defaultRetValue)
            where TFlag : struct, Enum
        {
            bool matches = defaultRetValue;

            foreach (var kvp in flagCallbacksMap)
            {
                if (actualFlag.HasFlag(kvp.Key))
                {
                    matches = kvp.Value(
                        data, actualFlag);

                    if (matches)
                    {
                        break;
                    }
                }
            }

            return matches;
        }

        public static TFlag SubstractFlagIfReq<TFlag>(
            TFlag value,
            TFlag flag)
            where TFlag : struct, Enum
        {
            if (value.HasFlag(flag))
            {
                value = Tuple.Create(value, flag).ReduceEnumsToInt(
                    tuple => tuple.Item1 - tuple.Item2).AsEnum<TFlag>();
            }

            return value;
        }
    }
}

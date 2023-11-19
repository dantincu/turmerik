using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.EqualityComparer;

namespace Turmerik.Notes
{
    public static class EqComprH
    {
        public static IEqualityComparer<NoteDirTypeTuple> NoteDirTypeTupleEqCompr(
            IBasicEqualityComparerFactory factory) => factory.GetEqualityComparer<NoteDirTypeTuple>(
                (first, second) =>
                {
                    bool areEqual = first.DirType == second.DirType;

                    areEqual = areEqual && first.DirPfxType == second.DirPfxType;
                    areEqual = areEqual && first.DirCat == second.DirCat;

                    return areEqual;
                });
    }
}

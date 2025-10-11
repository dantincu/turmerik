using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public static class DateTimeH
    {
        public const long TICKS_IN_A_MILLISECOND = 10_000;

        public static long TicksToMillis(this long ticks) => ticks / TICKS_IN_A_MILLISECOND;
    }
}

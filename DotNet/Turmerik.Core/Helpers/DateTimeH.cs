using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class DateTimeH
    {
        public static DateTime RemoveTicksComponent(
            this DateTime dt) => new DateTime(
                dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, dt.Second, dt.Millisecond);

        public static TimeSpan GetTicksComponent(
            this DateTime dt) => dt - dt.RemoveTicksComponent();
    }
}

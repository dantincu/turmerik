using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Components
{
    public enum TimeStamp
    {
        Minutes = 0,
        Seconds = 1,
        ShortMillis = 2,
        FullMillis = 3
    }

    public readonly struct TmStmp
    {
        public readonly bool HasDate;
        public readonly TimeStamp? TimeStamp;
        public readonly bool HasTimeZone;
        public readonly bool IsForFileName;

        public TmStmp(bool hasDate, TimeStamp? timeStamp, bool hasTimeZone, bool isForFileName)
        {
            HasDate = hasDate;
            TimeStamp = timeStamp;
            HasTimeZone = hasTimeZone;
            IsForFileName = isForFileName;
        }
    }

    public class TmStmpEqualityComparer : IEqualityComparer<TmStmp>
    {
        public bool Equals(TmStmp x, TmStmp y)
        {
            bool retVal = x.HasDate == y.HasDate;
            retVal = retVal && x.TimeStamp == y.TimeStamp;

            retVal = retVal && x.HasTimeZone == y.HasTimeZone;
            retVal = retVal && x.IsForFileName == y.IsForFileName;

            return retVal;
        }

        public int GetHashCode(TmStmp obj)
        {
            int hashCode = 0;

            if (obj.TimeStamp.HasValue)
            {
                int pow = (int)obj.TimeStamp.Value;
                hashCode = (int)Math.Pow(2, pow);
            }

            if (obj.HasDate)
            {
                hashCode += (int)Math.Pow(2, 4);
            }

            if (obj.HasTimeZone)
            {
                hashCode += (int)Math.Pow(2, 5);
            }

            if (obj.IsForFileName)
            {
                hashCode += (int)Math.Pow(2, 6);
            }

            return hashCode;
        }
    }

    public interface ITimeStampHelper
    {
        string TmStmp(
            DateTime? dateTime,
            bool hasDate,
            TimeStamp? tmStmp = TimeStamp.Minutes,
            bool hasTimeZone = false,
            bool isForFileName = false);

        string TmStmp(
            DateTime? dateTime,
            TmStmp tmStmp);

        string TmStmp(
            bool hasDate,
            TimeStamp? tmStmp = TimeStamp.Minutes,
            bool hasTimeZone = false,
            bool isForFileName = false);

        string TmStmp(TmStmp tmStmp);
    }

    public class TimeStampHelper : ITimeStampHelper
    {
        public static readonly IReadOnlyDictionary<TmStmp, string> TmStmpsDictnr;

        static TimeStampHelper()
        {
            TmStmpsDictnr = GetTmStmpDictnr();
        }

        public string TmStmp(
            DateTime? dateTime,
            bool hasDate,
            TimeStamp? tmStmp = TimeStamp.Minutes,
            bool hasTimeZone = false,
            bool isForFileName = false)
        {
            TmStmp key = GetTmStmp(
                  hasDate,
                  tmStmp,
                  hasTimeZone,
                  isForFileName);

            string tmStmpStr = TmStmp(
                dateTime, key);

            return tmStmpStr;
        }

        public string TmStmp(
            DateTime? dateTime,
            TmStmp tmStmp)
        {
            dateTime = dateTime ?? DateTime.Now;
            string tmStmpTpl = TmStmpsDictnr[tmStmp];

            string tmStmpStr = dateTime.Value.ToString(
                tmStmpTpl);

            return tmStmpStr;
        }

        public string TmStmp(
            bool hasDate,
            TimeStamp? tmStmp = TimeStamp.Minutes,
            bool hasTimeZone = false,
            bool isForFileName = false)
        {
            TmStmp key = GetTmStmp(
                hasDate,
                tmStmp,
                hasTimeZone,
                isForFileName);

            string tmStmpStr = TmStmpsDictnr[key];
            return tmStmpStr;
        }

        public string TmStmp(TmStmp tmStmp)
        {
            string tmStmpStr = TmStmpsDictnr[tmStmp];
            return tmStmpStr;
        }

        private static string GetTmStmpCore(TmStmp tmStmp)
        {
            StringBuilder sb = new StringBuilder();

            if (tmStmp.HasDate)
            {
                sb.Append("yyyy-MM-dd");
            }

            if (tmStmp.TimeStamp.HasValue)
            {
                sb.Append(" HH:mm");
                var tmStmpVal = tmStmp.TimeStamp.Value;

                if (tmStmpVal >= TimeStamp.Seconds)
                {
                    sb.Append(":ss");
                }

                if (tmStmpVal >= TimeStamp.ShortMillis)
                {
                    sb.Append(".FFF");
                }

                if (tmStmpVal >= TimeStamp.FullMillis)
                {
                    sb.Append("FFFF");
                }
            }

            if (tmStmp.HasTimeZone)
            {
                sb.Append("K");
            }

            string tmStmpStr = sb.ToString();

            if (tmStmp.IsForFileName)
            {
                tmStmpStr = tmStmpStr.Replace(":", string.Empty);
            }

            return tmStmpStr;
        }

        private static IEnumerable<TmStmp> GetTmStmpDicntrKeys()
        {
            bool[] boolValues = new bool[] { false, true };

            TimeStamp?[] tmStmpValues = new TimeStamp?[]
            {
                null,
                TimeStamp.Minutes,
                TimeStamp.Seconds,
                TimeStamp.ShortMillis,
                TimeStamp.FullMillis
            };

            foreach (bool hasDate in boolValues)
            {
                foreach (TimeStamp? tmStmp in tmStmpValues)
                {
                    foreach (bool hasTimeZone in boolValues)
                    {
                        foreach (bool isForFileName in boolValues)
                        {
                            TmStmp value = GetTmStmp(
                                hasDate,
                                tmStmp,
                                hasTimeZone,
                                isForFileName);

                            yield return value;
                        }
                    }
                }
            }
        }

        private static IReadOnlyDictionary<TmStmp, string> GetTmStmpDictnr()
        {
            var keys = GetTmStmpDicntrKeys();

            var dictnr = keys.ToDictionary(
                key => key, key => GetTmStmpCore(key),
                new TmStmpEqualityComparer());

            var rdnlDicntr = new ReadOnlyDictionary<TmStmp, string>(
                dictnr);

            return rdnlDicntr;
        }

        private static TmStmp GetTmStmp(
            bool hasDate,
            TimeStamp? tmStmp,
            bool hasTimeZone,
            bool isForFileName)
        {
            TmStmp value = new TmStmp(
                hasDate,
                tmStmp,
                hasTimeZone,
                isForFileName);

            return value;
        }
    }
}

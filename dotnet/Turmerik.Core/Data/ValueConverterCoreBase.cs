using Turmerik.Core.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Infrastucture;
using Turmerik.Core.Components;

namespace Turmerik.Core.Data
{
    public delegate bool TryParseVal<TIn, TOut>(TIn inVal, out TOut outVal);

    public interface IValueConverterCore<TInput, TResult>
    {
        bool TryParse(TInput arg, out TResult parsedValue);
    }

    public abstract class ValueConverterCoreBase<TInput, TResult> : IValueConverterCore<TInput, TResult>
    {
        public abstract bool TryParse(TInput arg, out TResult parsedValue);
    }

    public interface IStringToValueConverterCore<TInput> : IValueConverterCore<TInput, object>
    {
    }

    public abstract class StringToValueConverterCoreBase<TInput> : ValueConverterCoreBase<TInput, object>, IStringToValueConverterCore<TInput>
    {
    }

    public interface IStringToValueConverterCore : IStringToValueConverterCore<string>
    {
    }

    public abstract class StringToValueConverterCoreBase : StringToValueConverterCoreBase<string>, IStringToValueConverterCore
    {
    }

    public interface IStringToStringConverterCore : IStringToValueConverterCore
    {
    }

    public class StringToStringConverterCore : StringToValueConverterCoreBase, IStringToStringConverterCore
    {
        public override bool TryParse(string argStr, out object parsedValue)
        {
            parsedValue = argStr;
            return true;
        }
    }

    public interface IStringToIntConverter : IStringToValueConverterCore
    {
    }

    public class StringToIntConverter : StringToValueConverterCoreBase, IStringToIntConverter
    {
        public override bool TryParse(string argStr, out object parsedValue)
        {
            int value;
            bool retVal = int.TryParse(argStr, out value);

            parsedValue = value;
            return retVal;
        }
    }

    public interface IStringToBoolConverter : IStringToValueConverterCore
    {
    }

    public class StringToBoolConverter : StringToValueConverterCoreBase, IStringToBoolConverter
    {
        public override bool TryParse(string argStr, out object parsedValue)
        {
            bool value;
            bool retVal = bool.TryParse(argStr, out value);

            parsedValue = value;
            return retVal;
        }
    }

    public interface IStringToEnumConverter : IStringToValueConverterCore<Tuple<string, Type>>
    {
    }

    public class StringToEnumConverter : StringToValueConverterCoreBase<Tuple<string, Type>>, IStringToEnumConverter
    {
        private readonly IEnumValuesStaticDataCache enumsCache;

        public StringToEnumConverter(IEnumValuesStaticDataCache enumsCache)
        {
            this.enumsCache = enumsCache ?? throw new ArgumentNullException(nameof(enumsCache));
        }

        public override bool TryParse(Tuple<string, Type> arg, out object parsedValue)
        {
            bool retVal;
            int intVal;

            if (int.TryParse(arg.Item1, out intVal))
            {
                parsedValue = intVal;
                retVal = true;
            }
            else
            {
                var match = enumsCache.Get(arg.Item2).SingleOrDefault(
                    kvp => kvp.Key.StrEquals(arg.Item1, true));

                if (match.Key != null)
                {
                    parsedValue = match.Value;
                    retVal = true;
                }
                else
                {
                    parsedValue = null;
                    retVal = false;
                }
            }

            return retVal;
        }
    }

    public interface IStringToEnumConverter<TEnum> : IStringToEnumConverter
    {
    }

    public class StringToEnumConverter<TEnum> : StringToEnumConverter, IStringToEnumConverter<TEnum>
        where TEnum : struct
    {
        public StringToEnumConverter(IEnumValuesStaticDataCache enumsCache) : base(enumsCache)
        {
        }

        public bool TryParse(string argStr, out object parsedValue)
        {
            bool retVal;
            TEnum value;

            if (Enum.TryParse(argStr, out value))
            {
                parsedValue = value;
                retVal = true;
            }
            else
            {
                retVal = TryParse(new Tuple<string, Type>(argStr, typeof(TEnum)), out parsedValue);
            }

            return retVal;
        }
    }

    public interface IStringToDateTimeConverter : IStringToValueConverterCore
    {
    }

    public class StringToDateTimeConverter : StringToValueConverterCoreBase, IStringToDateTimeConverter
    {
        private const char DATE_PREFIX = 'D';
        private const char TIME_PREFIX = 'T';

        private static readonly IReadOnlyCollection<char> prefixes = new char[]
        {
            DATE_PREFIX, TIME_PREFIX
        }.RdnlC();

        public override bool TryParse(string argStr, out object parsedValue)
        {
            argStr = argStr?.Trim() ?? string.Empty;
            bool retVal = false;

            parsedValue = null;

            if (!string.IsNullOrEmpty(argStr))
            {
                var data = new DateTimeParseData
                {
                    ArgStr = argStr,
                    Len = argStr.Length,
                    DateTimeParts = new DateTimeParts(),
                };

                while (TryParseDateTimeParts(data))
                {
                }

                if (data.IsValid)
                {
                    DateTime now = DateTime.Now;
                    var parts = data.DateTimeParts;

                    DateTime value = new DateTime(
                        parts.Year ?? now.Year,
                        parts.Month ?? now.Month,
                        parts.Day ?? now.Day,
                        parts.Hour ?? now.Hour,
                        parts.Minute ?? now.Minute,
                        parts.Second ?? now.Second);

                    parsedValue = value;
                    retVal = true;
                }
            }

            return retVal;
        }

        private bool TryParseDateTimeParts(DateTimeParseData data)
        {
            if (TryDigestLetter(data))
            {
                switch (data.Letter)
                {
                    case DATE_PREFIX:
                        TryParseDate(data);
                        break;
                    case TIME_PREFIX:
                        TryParseTime(data);
                        break;
                    default:
                        throw new ArgumentException(nameof(data.Letter));
                }
            }

            return data.IsValid;
        }

        private bool TryParseDatePart(
            DateTimeParseData data,
            Func<DateTimeParts, bool> condition,
            Func<DateTimeParts, int[], bool> parseAction)
        {
            if (data.IsValid = data.IsValid = condition(data.DateTimeParts))
            {
                TryParseCore(data);
            }

            if (data.IsValid)
            {
                data.IsValid = parseAction(data.DateTimeParts, data.Nums);
            }

            return data.IsValid;
        }

        private bool TryParseDate(DateTimeParseData data)
        {
            TryParseDatePart(data,
                dtParts => !data.DateTimeParts.HasDate,
                (dtParts, nums) =>
                nums.Reverse().ToArray().ForEach(
                    (val, idx) => data.DateTimeParts.Day = val,
                    (val, idx) => data.DateTimeParts.Month = val,
                    (val, idx) => data.DateTimeParts.Year = val) <= 0);

            return data.IsValid;
        }

        private bool TryParseTime(DateTimeParseData data)
        {
            TryParseDatePart(data,
                dtParts => !data.DateTimeParts.HasDate,
                (dtParts, nums) =>
                nums.ForEach(
                    (val, idx) => data.DateTimeParts.Hour = val,
                    (val, idx) => data.DateTimeParts.Minute = val,
                    (val, idx) => data.DateTimeParts.Second = val) <= 0);

            return data.IsValid;
        }

        private bool TryDigestLetter(DateTimeParseData data)
        {
            data.Letter = default;

            while (data.Idx < data.Len && char.IsWhiteSpace(data.Letter = data.ArgStr[data.Idx]))
            {
                data.Idx++;
            }

            data.Letter = char.ToUpper(data.Letter);
            data.IsValid = data.Idx < data.Len && prefixes.Contains(data.Letter);

            return data.IsValid;
        }

        private bool TryParseCore(DateTimeParseData data)
        {
            var npData = new NumParseData
            {
                ArgStr = data.ArgStr,
                StartIdx = data.Idx,
                Idx = data.Idx,
                Char = data.ArgStr[data.Idx],
                Values = new List<int>()
            };

            while (data.Idx < data.Len && !char.IsLetter(npData.Char) && data.IsValid)
            {
                npData.Char = data.ArgStr[data.Idx];

                data.IsValid = TryParseCore(npData);
                npData.Idx++;
            }

            data.Idx = npData.Idx;
            data.Nums = npData.Values.ToArray();

            data.IsValid = data.IsValid && data.Nums.Any();
            return data.IsValid;
        }

        private bool TryParseCore(
            NumParseData npData)
        {
            bool retVal = true;

            if (npData.Char == '-')
            {
                string str = npData.ArgStr.Substring(npData.StartIdx, npData.Idx - npData.StartIdx);
                npData.StartIdx = npData.Idx;

                int val;

                if (int.TryParse(str, out val))
                {
                    npData.Values.Add(val);
                }
                else
                {
                    retVal = false;
                }
            }
            else if (!(char.IsWhiteSpace(npData.Char) || char.IsLetterOrDigit(npData.Char)))
            {
                retVal = false;
            }

            return retVal;
        }

        private class DateTimeParseData
        {
            public string ArgStr { get; set; }
            public int Len { get; set; }
            public int Idx { get; set; }
            public char Letter { get; set; }
            public bool IsValid { get; set; }
            public int[] Nums { get; set; }
            public DateTimeParts DateTimeParts { get; set; }
        }

        private class DateTimeParts
        {
            public bool HasDate { get; set; }
            public int? Year { get; set; }
            public int? Month { get; set; }
            public int? Day { get; set; }
            public bool HasTime { get; set; }
            public int? Hour { get; set; }
            public int? Minute { get; set; }
            public int? Second { get; set; }
        }

        private class NumParseData
        {
            public string ArgStr { get; set; }
            public int StartIdx { get; set; }
            public int Idx { get; set; }
            public char Char { get; set; }
            public List<int> Values { get; set; }
        }
    }
}

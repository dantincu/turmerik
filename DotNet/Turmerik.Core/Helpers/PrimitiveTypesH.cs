using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class PrimitiveTypesH
    {
        public static readonly Type Bool = typeof(bool);
        public static readonly Type Byte = typeof(byte);
        public static readonly Type SByte = typeof(sbyte);
        public static readonly Type Short = typeof(short);
        public static readonly Type UShort = typeof(ushort);
        public static readonly Type Int = typeof(int);
        public static readonly Type UInt = typeof(uint);
        public static readonly Type Long = typeof(long);
        public static readonly Type ULong = typeof(ulong);

        public static readonly Type String = typeof(string);
        public static readonly Type DateTime = typeof(DateTime);
        public static readonly Type DateTimeOffset = typeof(DateTimeOffset);
        public static readonly Type TimeSpan = typeof(TimeSpan);

        /// <summary>
        /// Contains the primitive types (those whose associated <see cref="Type"/>
        /// instances have their <see cref="Type.IsPrimitive"/> property holding the value <c>true</c>.
        /// </summary>
        public static Lazy<ReadOnlyCollection<Type>> PrmtvTypes = LazyH.Lazy(
            () => Bool.Arr(Byte, SByte, Short, UShort, Int, UInt, Long, ULong).RdnlC());

        /// <summary>
        /// In addition to the actual primitive types, it also contains the
        /// String, DateTime, DateTimeOffset and TimeSpan immutable types.
        /// </summary>
        public static Lazy<ReadOnlyCollection<Type>> PseudoPrmtvTypes = LazyH.Lazy(
            () => PrmtvTypes.Value.Concat(
                [String, DateTime, DateTimeOffset, TimeSpan]).RdnlC());

        public static bool IsPseudoPrmtv(
            this Type type) => PseudoPrmtvTypes.Value.Contains(type);

        public static bool IsPseudoPrmtvOrNllbl(
            this Type type,
            out bool isNullable)
        {
            isNullable = false;

            bool isPrimitiveType = type.IsPseudoPrmtv() || (
                isNullable = type.IsNullable());

            return isPrimitiveType;
        }
    }
}

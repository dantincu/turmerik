using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.IO;
using System.Reflection;
using System.Text;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;
using System.Linq;
using System.Collections.Concurrent;

namespace Turmerik.Core.Helpers
{
    public static class ReflH
    {
        public static readonly TypeTupleCore VoidType = new (typeof(void));
        public static readonly TypeTupleCore BaseObjectType = new(typeof(object));
        public static readonly TypeTupleCore BaseValueType = new(typeof(ValueType));
        public static readonly TypeTupleCore DisposableIntfType = new(typeof(IDisposable));
        public static readonly TypeTupleCore AsyncDisposableIntfType = new(typeof(IAsyncDisposable));

        public static readonly TypeTupleCore StringType = new(typeof(string));
        public static readonly TypeTupleCore BoolType = new(typeof(bool));

        public static readonly TypeTupleCore NullableGenericTypeDef = new(typeof(Nullable<>));

        public static readonly BindingFlags MatchAllBindingFlags = GetMatchAllBindingFlags();
        public static readonly BindingFlags MatchAllFlatHcyBindingFlags = MatchAllBindingFlags | BindingFlags.FlattenHierarchy;

        public static BindingFlags GetMatchAllBindingFlags(
            ) => BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic;

        /// <summary>
        /// This can be usefull for generic types, as in their cases the <see cref="Type.FullName" /> property
        /// returns a string containing the list of generic parameter constraints containing the names of
        /// type parameters and their types, enclosed in square brackets and separated by comma: <br /> <br />
        /// <c>System.Collections.Generic.KeyValuePair`2[[System.Int32, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e],[System.String, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]</c>
        /// </summary>
        /// <param name="type">The type whose full name is to be retrieved.</param>
        /// <returns>An instance of type <see cref="string" /> containing the full name of the provided type.</returns>
        public static string GetTypeFullName(
            this Type type) => string.Join(".",
                type.Namespace, type.Name);

        public static string GetTypeFullDisplayName(
            this Type type,
            char stopDelim = '[') => GetTypeDisplayName(
                type.FullName,
                stopDelim);

        public static string GetTypeFullDisplayName(
            this Type type,
            char[]? stopDelimsArr) => GetTypeDisplayName(
                type.FullName,
                stopDelimsArr);

        public static string GetTypeDisplayName(
            string typeFullName,
            char stopDelim = '[') => typeFullName?.SplitStr(
                (str, len) => str.FirstKvp((c, i) => c == stopDelim).Key).Item1;

        public static string GetTypeDisplayName(
            string typeFullName,
            char[]? stopDelimsArr)
        {
            stopDelimsArr ??= ['&', '*'];

            string retVal = typeFullName?.SplitStr(
                (str, len) => str.FirstKvp((c, i) => stopDelimsArr.Contains(c)).Key).Item1;

            return retVal;
        }

        public static Type GetBaseType(
            Type type)
        {
            if (type == BaseObjectType.Type)
            {
                return type;
            }
            else
            {
                return type.BaseType;
            }
        }

        public static Type GetBaseCommonType(
            Type trgType,
            Type srcType)
        {
            Type commonBaseType;

            if (trgType == srcType)
            {
                commonBaseType = trgType;
            }
            else if (trgType.IsAssignableFrom(srcType))
            {
                commonBaseType = trgType;
            }
            else if (srcType.IsAssignableFrom(trgType))
            {
                commonBaseType = srcType;
            }
            else
            {
                commonBaseType = GetBaseCommonType(
                    trgType.BaseType,
                    srcType.BaseType);
            }

            return commonBaseType;
        }

        public static bool IsDisposable(
            this Type type,
            bool alsoCheckForAsyncDisposable = false)
        {
            bool isDisposable = DisposableIntfType.Type.IsAssignableFrom(type);

            if (!isDisposable && alsoCheckForAsyncDisposable)
            {
                isDisposable = AsyncDisposableIntfType.Type.IsAssignableFrom(type);
            }

            return isDisposable;
        }

        public static bool IsValidTypeNameChar(
            char chr) => char.IsLetterOrDigit(chr) || "@$".Contains(chr);

        public static bool IsValidTypeNameChar(
            char chr,
            char[] allowedExtraChars) => IsValidTypeNameChar(
                chr) || allowedExtraChars.Contains(chr);

        public static bool IsSpecialTypeName(
            string typeName) => typeName.Any(
                c => !IsValidTypeNameChar(c));

        public static bool IsSpecialTypeName(
            string typeName,
            char[] allowedExtraChars) => typeName.Any(
                c => !IsValidTypeNameChar(c, allowedExtraChars));

        public static string RemoveInvalidCharsFromTypeName(
            string typeName) => new string(
                typeName.Where(c => IsValidTypeNameChar(c)).ToArray());

        public static string GetIdnfName(
            this Type type) => type.IsNested switch
        {
            true => string.Join(".", GetIdnfName(
                type.DeclaringType), type.Name),
            false => string.Join(".",
                type.Namespace, type.Name)
        };

        public static List<Tuple<string, Type>> GetDistinctInterfaces(
            this Type type) => ReduceInterfaces(
                SelectInterfaceTuples(
                    type.GetInterfaces()));

        public static List<Tuple<string, Type>> ReduceInterfaces(
            List<Tuple<string, Type>> intfTuplesList)
        {
            var implIntfTuplesList = SelectImplInterfaces(
                intfTuplesList);

            ReduceInterfaces(
                intfTuplesList,
                implIntfTuplesList);

            return implIntfTuplesList;
        }

        public static List<Tuple<string, Type>> ReduceInterfaces(
            List<Tuple<string, Type>> intfList,
            List<Tuple<string, Type>> implIntfList)
        {
            if (implIntfList.Any())
            {
                int idx = 0;

                while (idx < intfList.Count)
                {
                    var intf = intfList[idx];

                    var kvp = implIntfList.FirstKvp(
                        candidate => candidate.Item1 == intf.Item1);

                    if (kvp.Key >= 0)
                    {
                        intfList.RemoveAt(idx);
                        implIntfList.RemoveAt(kvp.Key);
                    }
                }

                implIntfList = SelectImplInterfaces(
                    implIntfList);

                ReduceInterfaces(
                    intfList,
                    implIntfList);
            }

            return intfList;
        }

        public static List<Tuple<string, Type>> SelectInterfaceTuples(
            IEnumerable<Type> intfList) => intfList.Select(
                intf => Tuple.Create(GetIdnfName(intf), intf)).ToList();

        public static List<Tuple<string, Type>> SelectImplInterfaces(
            List<Tuple<string, Type>> intfList) => intfList.SelectMany(
                tuple => tuple.Item2.GetInterfaces().Select(
                    intf => Tuple.Create(GetIdnfName(intf), intf))).ToList().ActWith(
                list => list.DistinctOnly((t1, t2) => t1.Item1 == t2.Item1));

        public static IEnumerable<Type> SelectTypes(
            this IEnumerable<TypeTupleCore> nmrbl,
            bool selectBaseTypesAlso = false) => selectBaseTypesAlso switch
            {
                true => nmrbl.SelectMany(tupleCore => (
                    tupleCore is TypeTuple tuple) ? tuple.Type.Arr(
                        tuple.BaseType!) : tupleCore.Type.Arr()),
                false => nmrbl.Select(tuple => tuple.Type)
            };

        public static IEnumerable<Type> SelectTypes(
            this IEnumerable<Tuple<string, Type>> nmrbl) => nmrbl.Select(
                tuple => tuple.Item2);

        public static IEnumerable<string> SelectTypeFullNames(
            this IEnumerable<Type> nmrbl) => nmrbl.Select(
                type => type.GetTypeFullName());

        public static IEnumerable<TypeTupleCore> SelectTuples(
            IEnumerable<Type> nmrbl) => nmrbl.Select(
                type => new TypeTupleCore(type));
    }
}

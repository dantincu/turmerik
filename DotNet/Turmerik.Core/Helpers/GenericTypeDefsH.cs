using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class GenericTypeDefsH
    {
        public static Dictionary<Type, Type> GetGenericInterfacesMap(
            Type type,
            Type[] interfaces = null) => (
                interfaces ?? type.GetInterfaces()).Where(
                    intf => intf.IsGenericType).ToDictionary(
                    intf => intf, intf => intf.GetGenericTypeDefinition());

        public static bool TryGetNmrblGenericType(
            this Type type,
            out Type genericType,
            Dictionary<Type, Type> genericInterfaces = null) => TryGetGenericInterfaceType(
                type, CommonTypes.Instn.Value.EnumerableIntfType.Type, out genericType, genericInterfaces);

        public static bool TryGetDictnrGenericType(
            this Type type,
            out Type genericType,
            Dictionary<Type, Type> genericInterfaces = null) => TryGetGenericInterfaceType(
                type, CommonTypes.Instn.Value.DictionaryIntfType.Type, out genericType, genericInterfaces);

        public static bool TryGetRdnlDictnrGenericType(
            this Type type,
            out Type genericType,
            Dictionary<Type, Type> genericInterfaces = null) => TryGetGenericInterfaceType(
                type, CommonTypes.Instn.Value.ReadOnlyDictionaryIntfType.Type, out genericType, genericInterfaces);

        public static bool TryGetNllblGenericTypeArg(
            this Type type,
            out Type genericTypeArg)
        {
            bool isNllblType = type.IsNullable();

            if (isNllblType)
            {
                genericTypeArg = type.GetGenericArguments().Single();
            }
            else
            {
                genericTypeArg = null;
            }

            return isNllblType;
        }

        public static bool TryGetGenericInterfaceType(
            this Type type,
            Type genericTypeDef,
            out Type genericType,
            Dictionary<Type, Type> genericInterfaces = null)
        {
            genericInterfaces ??= GetGenericInterfacesMap(type);

            var nmrblTypeKvp = genericInterfaces.SingleOrDefault(
                kvp => kvp.Value == genericTypeDef);

            bool retVal = (genericType = nmrblTypeKvp.Key) != null;
            return retVal;
        }

        public static bool IsNullable(
            this Type type) => type.IsGenericType && (
                type.GetGenericTypeDefinition() == ReflH.NullableGenericTypeDef.Type);

        public static bool TryGetTupleGenericType(
            this Type type,
            out Type genericTypeDef)
        {
            genericTypeDef = null;
            bool isTupleType = type.IsGenericType;

            if (isTupleType)
            {
                var typeGenericTypeDef = type.GetGenericTypeDefinition();

                var kvp = CommonTypes.Instn.Value.AllTupleTypes.FirstKvp(
                    tupleGenericTypeDef => typeGenericTypeDef == tupleGenericTypeDef);

                isTupleType = kvp.Key >= 0;
                genericTypeDef = kvp.Value;
            }

            return isTupleType;
        }
    }
}

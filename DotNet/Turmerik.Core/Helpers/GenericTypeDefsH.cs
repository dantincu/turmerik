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
        public static readonly Lazy<Type> Nullable = LazyH.Lazy(() => typeof(Nullable<int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> Enumerable = LazyH.Lazy(() => typeof(IEnumerable<int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> Array = LazyH.Lazy(() => typeof(int[]).GetGenericTypeDefinition());

        public static readonly Lazy<Type> ListCore = LazyH.Lazy(() => typeof(IList<int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> List = LazyH.Lazy(() => typeof(List<int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> CollectionCore = LazyH.Lazy(() => typeof(ICollection<int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> Collection = LazyH.Lazy(() => typeof(Collection<int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> ProducerConsumerCollectionCore = LazyH.Lazy(
            () => typeof(IProducerConsumerCollection<int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> Queue = LazyH.Lazy(() => typeof(Queue<int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> Stack = LazyH.Lazy(() => typeof(Stack<int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> DictionaryCore = LazyH.Lazy(() => typeof(IDictionary<int, int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> Dictionary = LazyH.Lazy(() => typeof(Dictionary<int, int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> ReadOnlyCollectionCore = LazyH.Lazy(() => typeof(IReadOnlyCollection<int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> ReadOnlyCollection = LazyH.Lazy(() => typeof(ReadOnlyCollection<int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> ReadOnlyDictionaryCore = LazyH.Lazy(() => typeof(IReadOnlyDictionary<int, int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> ReadOnlyDictionary = LazyH.Lazy(() => typeof(ReadOnlyDictionary<int, int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> ConcurrentBag = LazyH.Lazy(() => typeof(ConcurrentBag<int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> ConcurrentQueue = LazyH.Lazy(() => typeof(ConcurrentQueue<int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> ConcurrentStack = LazyH.Lazy(() => typeof(ConcurrentStack<int>).GetGenericTypeDefinition());
        public static readonly Lazy<Type> ConcurrentDictionary = LazyH.Lazy(() => typeof(ConcurrentDictionary<int, int>).GetGenericTypeDefinition());

        public static readonly Lazy<Type> KeyValuePair = LazyH.Lazy(() => typeof(KeyValuePair<int, int>));

        public static readonly Lazy<Type> Tuple1 = LazyH.Lazy(() => typeof(Tuple<int>));
        public static readonly Lazy<Type> Tuple2 = LazyH.Lazy(() => typeof(Tuple<int, int>));
        public static readonly Lazy<Type> Tuple3 = LazyH.Lazy(() => typeof(Tuple<int, int, int>));
        public static readonly Lazy<Type> Tuple4 = LazyH.Lazy(() => typeof(Tuple<int, int, int, int>));
        public static readonly Lazy<Type> Tuple5 = LazyH.Lazy(() => typeof(Tuple<int, int, int, int, int>));
        public static readonly Lazy<Type> Tuple6 = LazyH.Lazy(() => typeof(Tuple<int, int, int, int, int, int>));
        public static readonly Lazy<Type> Tuple7 = LazyH.Lazy(() => typeof(Tuple<int, int, int, int, int, int, int>));
        public static readonly Lazy<Type> Tuple8 = LazyH.Lazy(() => typeof(Tuple<int, int, int, int, int, int, int, int>));

        public static readonly Lazy<ReadOnlyCollection<Type>> AllTupleTypes = LazyH.Lazy(
            () => Tuple1.Arr(Tuple2, Tuple3, Tuple4, Tuple5, Tuple6, Tuple7, Tuple8).Select(
                lazy => lazy.Value).RdnlC());

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
                type, Enumerable.Value, out genericType, genericInterfaces);

        public static bool TryGetDictnrGenericType(
            this Type type,
            out Type genericType,
            Dictionary<Type, Type> genericInterfaces = null) => TryGetGenericInterfaceType(
                type, DictionaryCore.Value, out genericType, genericInterfaces);

        public static bool TryGetRdnlDictnrGenericType(
            this Type type,
            out Type genericType,
            Dictionary<Type, Type> genericInterfaces = null) => TryGetGenericInterfaceType(
                type, ReadOnlyDictionaryCore.Value, out genericType, genericInterfaces);

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
                type.GetGenericTypeDefinition() == Nullable.Value);

        public static bool TryGetTupleGenericType(
            this Type type,
            out Type genericTypeDef)
        {
            genericTypeDef = null;
            bool isTupleType = type.IsGenericType;

            if (isTupleType)
            {
                var typeGenericTypeDef = type.GetGenericTypeDefinition();

                var kvp = AllTupleTypes.Value.FirstKvp(
                    tupleGenericTypeDef => typeGenericTypeDef == tupleGenericTypeDef);

                isTupleType = kvp.Key >= 0;
                genericTypeDef = kvp.Value;
            }

            return isTupleType;
        }
    }
}

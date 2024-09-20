using System;
using System.Collections.Concurrent;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Linq;
using System.Numerics;

namespace Turmerik.Core.Helpers
{
    public class CommonTypes
    {
        public readonly GenericTypeDefTuple EnumerableIntfType = new(typeof(IEnumerable<>), typeof(IEnumerable));
        public readonly GenericTypeDefTuple CollectionIntfType = new(typeof(ICollection<>), typeof(ICollection));
        public readonly GenericTypeDefTupleCore ReadOnlyCollectionIntfType = new(typeof(IReadOnlyCollection<>));
        public readonly GenericTypeDefTupleCore ProducerConsumerCollectionIntfType = new(typeof(IProducerConsumerCollection<>));
        public readonly GenericTypeDefTuple ListIntfType = new(typeof(IList<>), typeof(IList));
        public readonly GenericTypeDefTupleCore ReadOnlyListIntfType = new(typeof(IReadOnlyList<>));
        public readonly GenericTypeDefTuple DictionaryIntfType = new(typeof(IDictionary<,>), typeof(IDictionary));
        public readonly GenericTypeDefTupleCore ReadOnlyDictionaryIntfType = new(typeof(IReadOnlyDictionary<,>));

        public readonly GenericTypeDefTupleCore CollectionType = new(typeof(Collection<>));
        public readonly GenericTypeDefTupleCore ReadOnlyCollectionType = new(typeof(ReadOnlyCollection<>));
        public readonly GenericTypeDefTupleCore ListType = new(typeof(List<>));
        public readonly GenericTypeDefTupleCore DictionaryType = new(typeof(Dictionary<,>));
        public readonly GenericTypeDefTupleCore ReadOnlyDictionaryType = new(typeof(ReadOnlyDictionary<,>));

        public readonly GenericTypeDefTupleCore StackType = new(typeof(Stack<>));
        public readonly GenericTypeDefTupleCore QueueType = new(typeof(Queue<>));

        public readonly GenericTypeDefTupleCore ConcurrentDictionaryType = new(typeof(ConcurrentDictionary<,>));
        public readonly GenericTypeDefTupleCore ConcurrentStackType = new(typeof(ConcurrentStack<>));
        public readonly GenericTypeDefTupleCore ConcurrentQueueType = new(typeof(ConcurrentQueue<>));

        public readonly GenericTypeDefTupleCore DateTimeType = new(typeof(DateTime));
        public readonly GenericTypeDefTupleCore DateTimeOffsetType = new(typeof(DateTimeOffset));
        public readonly GenericTypeDefTupleCore TimeSpanType = new(typeof(TimeSpan));
        public readonly GenericTypeDefTupleCore BigIntegerType = new(typeof(BigInteger));

        public readonly ReadOnlyCollection<Type> NumberTypes;
        public readonly ReadOnlyCollection<string> NumberTypeNames;

        public readonly GenericTypeDefTupleCore Tuple1 = new(typeof(Tuple<>));
        public readonly GenericTypeDefTupleCore Tuple2 = new(typeof(Tuple<,>));
        public readonly GenericTypeDefTupleCore Tuple3 = new(typeof(Tuple<,,>));
        public readonly GenericTypeDefTupleCore Tuple4 = new(typeof(Tuple<,,,>));
        public readonly GenericTypeDefTupleCore Tuple5 = new(typeof(Tuple<,,,,>));
        public readonly GenericTypeDefTupleCore Tuple6 = new(typeof(Tuple<,,,,,>));
        public readonly GenericTypeDefTupleCore Tuple7 = new(typeof(Tuple<,,,,,,>));
        public readonly GenericTypeDefTupleCore Tuple8 = new(typeof(Tuple<,,,,,,,>));

        public readonly ReadOnlyCollection<GenericTypeDefTupleCore> AllTuples;
        public readonly ReadOnlyCollection<Type> AllTupleTypes;

        private CommonTypes()
        {
            NumberTypes = new Type[]
            {
                typeof(byte),
                typeof(sbyte),
                typeof(short),
                typeof(ushort),
                typeof(int),
                typeof(uint),
                typeof(long),
                typeof(ulong),
                typeof(decimal),
                typeof(float),
                typeof(double),
            }.RdnlC();

            NumberTypeNames = NumberTypes.Select(
                type => type.GetTypeFullName()).RdnlC();

            AllTuples = Tuple1.Arr().RdnlC();

            AllTupleTypes = AllTuples.Select(
                tuple => tuple.Type).RdnlC();
        }

        public static Lazy<CommonTypes> Instn { get; } = new Lazy<CommonTypes>(() => new CommonTypes());
    }
}

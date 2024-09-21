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
        public readonly TypeTuple EnumerableIntf = new(typeof(IEnumerable<>), typeof(IEnumerable));
        public readonly TypeTuple CollectionIntf = new(typeof(ICollection<>), typeof(ICollection));
        public readonly TypeTupleCore ReadOnlyCollectionIntf = new(typeof(IReadOnlyCollection<>));
        public readonly TypeTupleCore ProducerConsumerCollectionIntf = new(typeof(IProducerConsumerCollection<>));
        public readonly TypeTuple ListIntf = new(typeof(IList<>), typeof(IList));
        public readonly TypeTupleCore ReadOnlyListIntf = new(typeof(IReadOnlyList<>));
        public readonly TypeTuple DictionaryIntf = new(typeof(IDictionary<,>), typeof(IDictionary));
        public readonly TypeTupleCore ReadOnlyDictionaryIntf = new(typeof(IReadOnlyDictionary<,>));
        public readonly TypeTupleCore SetIntf = new(typeof(ISet<>));

        public readonly TypeTupleCore Collection = new(typeof(Collection<>));
        public readonly TypeTupleCore ReadOnlyCollection = new(typeof(ReadOnlyCollection<>));
        public readonly TypeTupleCore List = new(typeof(List<>));
        public readonly TypeTupleCore Dictionary = new(typeof(Dictionary<,>));
        public readonly TypeTupleCore ReadOnlyDictionary = new(typeof(ReadOnlyDictionary<,>));

        public readonly TypeTupleCore Stack = new(typeof(Stack<>));
        public readonly TypeTupleCore Queue = new(typeof(Queue<>));
        public readonly TypeTupleCore HashSet = new(typeof(HashSet<>));
        public readonly TypeTupleCore HashTable = new(typeof(Hashtable));

        public readonly TypeTupleCore ConcurrentDictionary = new(typeof(ConcurrentDictionary<,>));
        public readonly TypeTupleCore ConcurrentStack = new(typeof(ConcurrentStack<>));
        public readonly TypeTupleCore ConcurrentQueue = new(typeof(ConcurrentQueue<>));
        public readonly TypeTupleCore ConcurrentBag = new(typeof(ConcurrentBag<>));

        public readonly TypeTupleCore Span = new(typeof(Span<>));
        public readonly TypeTupleCore ReadOnlySpan = new(typeof(ReadOnlySpan<>));

        public readonly TypeTupleCore DateTime = new(typeof(DateTime));
        public readonly TypeTupleCore DateTimeOffset = new(typeof(DateTimeOffset));
        public readonly TypeTupleCore TimeSpan = new(typeof(TimeSpan));
        public readonly TypeTupleCore BigInteger = new(typeof(BigInteger));

        public readonly TypeTuplesAgg NumberTypes;

        public readonly TypeTupleCore Tuple1 = new(typeof(Tuple<>));
        public readonly TypeTupleCore Tuple2 = new(typeof(Tuple<,>));
        public readonly TypeTupleCore Tuple3 = new(typeof(Tuple<,,>));
        public readonly TypeTupleCore Tuple4 = new(typeof(Tuple<,,,>));
        public readonly TypeTupleCore Tuple5 = new(typeof(Tuple<,,,,>));
        public readonly TypeTupleCore Tuple6 = new(typeof(Tuple<,,,,,>));
        public readonly TypeTupleCore Tuple7 = new(typeof(Tuple<,,,,,,>));
        public readonly TypeTupleCore Tuple8 = new(typeof(Tuple<,,,,,,,>));

        public readonly TypeTuplesAgg TupleTypes;

        private CommonTypes()
        {
            NumberTypes = new ([
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
            ]);

            TupleTypes = new(
                Tuple1.Arr(
                    Tuple1,
                    Tuple2,
                    Tuple3,
                    Tuple4,
                    Tuple5,
                    Tuple6,
                    Tuple7,
                    Tuple8));
        }

        public static Lazy<CommonTypes> Instn { get; } = new Lazy<CommonTypes>(() => new CommonTypes());
    }
}

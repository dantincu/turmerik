using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection
{
    public class NetCoreCommonTypes
    {
        public readonly TypeTuplesAgg DateTypes;
        public readonly TypeTuplesAgg EnumerableTypes;
        public readonly TypeTuplesAgg DictionaryTypes;

        private NetCoreCommonTypes()
        {
            var commonTypes = CommonTypes.Instn.Value;

            DateTypes = new (commonTypes.DateTime.Arr(
                commonTypes.DateTimeOffset,
                NetCoreReflH.DateOnlyType));

            EnumerableTypes = new (commonTypes.EnumerableIntf.Arr(
                commonTypes.CollectionIntf,
                commonTypes.ReadOnlyCollectionIntf,
                commonTypes.ProducerConsumerCollectionIntf,
                commonTypes.ListIntf,
                commonTypes.ReadOnlyListIntf,
                commonTypes.SetIntf,
                commonTypes.Collection,
                commonTypes.ReadOnlyCollection,
                commonTypes.List,
                commonTypes.Stack,
                commonTypes.Queue,
                commonTypes.HashSet,
                commonTypes.HashTable,
                commonTypes.ConcurrentStack,
                commonTypes.ConcurrentQueue,
                commonTypes.ConcurrentBag));

            DictionaryTypes = new (commonTypes.DictionaryIntf.Arr(
                commonTypes.ReadOnlyDictionaryIntf,
                commonTypes.Dictionary,
                commonTypes.ReadOnlyDictionary,
                commonTypes.ConcurrentDictionary));
        }

        public static Lazy<NetCoreCommonTypes> Instn { get; } = new Lazy<NetCoreCommonTypes>(() => new NetCoreCommonTypes());
    }
}

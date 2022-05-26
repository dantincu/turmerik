using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Collections.Cache;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Collections.TypeMapped
{
    public abstract class TypeMappedCollectionBase<TData> : StaticDataCache<Type, IReadOnlyCollection<TypeMappedTuple<TData>>>
    {
        protected TypeMappedCollectionBase(
            IEnumerable<TData> nmrbl,
            Func<Type, TypeMappedTuple<TData>, bool> predicate,
            bool isThreadSafe = false) : this(
                nmrbl.RdnlC(
                    item => new TypeMappedTuple<TData>(
                        item.GetType(), item)),
                predicate,
                isThreadSafe)
        {
        }

        protected TypeMappedCollectionBase(
            IReadOnlyCollection<TypeMappedTuple<TData>> rdlnClctn,
            Func<Type, TypeMappedTuple<TData>, bool> predicate,
            bool isThreadSafe = false) : base(
                type => rdlnClctn.Where(tuple => predicate(type, tuple)).RdnlC(),
                isThreadSafe)
        {
            Tuples = rdlnClctn;

            Items = new Lazy<IReadOnlyCollection<TData>>(
                () => rdlnClctn.Select(
                tuple => tuple.Data).RdnlC());
        }

        public IReadOnlyCollection<TypeMappedTuple<TData>> Tuples { get; }
        public Lazy<IReadOnlyCollection<TData>> Items { get; }
    }

    public class HcyTypeMappedCollection<TData> : TypeMappedCollectionBase<TData>
    {
        public HcyTypeMappedCollection(
            IEnumerable<TData> allItems,
            bool isThreadSafe = false) : base(
                allItems,
                (type, tuple) => type.IsAssignableFrom(tuple.Type),
                isThreadSafe)
        {
        }
    }

    public class FlatTypeMappedCollection<TData> : TypeMappedCollectionBase<TData>
    {
        public FlatTypeMappedCollection(
            IEnumerable<TData> allItems,
            bool isThreadSafe = false) : base(
                allItems,
                (type, tuple) => type == tuple.Type,
                isThreadSafe)
        {
        }
    }
}

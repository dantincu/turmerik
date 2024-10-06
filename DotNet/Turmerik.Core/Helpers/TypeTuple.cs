using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public class TypeTupleCore
    {
        public TypeTupleCore(
            Type type)
        {
            Type = type;
            FullName = type.GetTypeFullDisplayName();
        }

        public Type Type { get; }
        public string FullName { get; }

    }

    public class TypeTuple : TypeTupleCore
    {
        public TypeTuple(
            Type type,
            Type? baseType) : base(type)
        {
            BaseType = baseType;
        }

        public Type? BaseType { get; }
    }

    public class TypeTuplesAgg
    {
        public TypeTuplesAgg(
            TypeTupleCore[] tuples,
            bool selectBaseTypesAlso = false) : this(
                tuples,
                tuples.SelectTypes(
                    selectBaseTypesAlso))
        {
        }

        public TypeTuplesAgg(
            Type[] types) : this(
                ReflH.SelectTuples(types),
                types)
        {
        }

        protected TypeTuplesAgg(
            IEnumerable<TypeTupleCore> tuples,
            IEnumerable<Type> types)
        {
            Tuples = tuples.RdnlC();
            Types = types.RdnlC();
            TypeNames = Types.SelectTypeFullNames().RdnlC();
        }

        public ReadOnlyCollection<TypeTupleCore> Tuples { get; }
        public ReadOnlyCollection<Type> Types { get; }
        public ReadOnlyCollection<string> TypeNames { get; }
    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Linq;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Cloneables
{
    public static class Clnbl
    {
        public static ClnblRdnlDictionary<TKey, TClnbl, TImmtbl> ToClnblRdnlDctnr<TKey, TClnbl, TImmtbl>(
            this IEnumerable<KeyValuePair<TKey, TClnbl>> nmrbl, Func<TClnbl, TImmtbl> immtblFactory)
            where TImmtbl : TClnbl => new ClnblRdnlDictionary<TKey, TClnbl, TImmtbl>(
                nmrbl.Select(kvp => kvp.Key.ToKvp(kvp.Value.With(v => v != null ? immtblFactory(v) : default!))).Dictnr());

        public static ClnblEdtblDictionary<TKey, TClnbl, TMtbl> ToClnblEdtblDctnr<TKey, TClnbl, TMtbl>(
            this IEnumerable<KeyValuePair<TKey, TClnbl>> nmrbl, Func<TClnbl, TMtbl> immtblFactory)
            where TMtbl : TClnbl => new ClnblEdtblDictionary<TKey, TClnbl, TMtbl>(
                nmrbl.Select(kvp => kvp.Key.ToKvp(kvp.Value.With(v => v != null ? immtblFactory(v) : default!))).Dictnr());
    }

    public interface IClnblIntfConfiguration
    {
        ClnblIntfItemConfiguration[] Items { get; }
    }

    public class ClnblIntfItemConfiguration
    {
        public ClnblIntfItemConfiguration(
            Type? intfType = null,
            Type? immtblType = null,
            Type? mtblType = null)
        {
            IntfType = intfType;
            ImmtblType = immtblType;
            MtblType = mtblType;
        }

        public Type? IntfType { get; }
        public Type? ImmtblType { get; }
        public Type? MtblType { get; }
    }

    public class ClnblIntfAttribute : Attribute
    {
        public ClnblIntfAttribute(Type? cfgType)
        {
            CfgType = cfgType;
        }

        public Type? CfgType { get; }
    }

    public class ClnblRdnlDictionary<TKey, TClnbl, TImmtbl> : ReadOnlyDictionary<TKey, TImmtbl>, IEnumerable<KeyValuePair<TKey, TClnbl>>
        where TImmtbl : TClnbl
    {
        public ClnblRdnlDictionary(IDictionary<TKey, TImmtbl> dictionary) : base(dictionary)
        {
        }

        IEnumerator<KeyValuePair<TKey, TClnbl>> IEnumerable<KeyValuePair<TKey, TClnbl>>.GetEnumerator(
            ) => ((ReadOnlyDictionary<TKey, TImmtbl>)this).Select(kvp => new KeyValuePair<TKey, TClnbl>(kvp.Key, kvp.Value)).GetEnumerator();
    }

    public class ClnblEdtblDictionary<TKey, TClnbl, TMtbl> : Dictionary<TKey, TMtbl>, IEnumerable<KeyValuePair<TKey, TClnbl>>
        where TMtbl : TClnbl
    {
        public ClnblEdtblDictionary(IDictionary<TKey, TMtbl> dictionary) : base(dictionary)
        {
        }

        IEnumerator<KeyValuePair<TKey, TClnbl>> IEnumerable<KeyValuePair<TKey, TClnbl>>.GetEnumerator(
            ) => ((Dictionary<TKey, TMtbl>)this).Select(kvp => new KeyValuePair<TKey, TClnbl>(kvp.Key, kvp.Value)).GetEnumerator();
    }
}

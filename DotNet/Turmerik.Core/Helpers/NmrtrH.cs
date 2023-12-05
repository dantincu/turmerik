using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Helpers
{
    public static class NmrtrH
    {
        public static TryRetrieve<TOutVal> GetRetriever<TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor) => (out TOutVal val) =>
            {
                bool retVal = nmrtr.MoveNext();

                if (retVal)
                {
                    val = convertor(
                        nmrtr.Current);
                }
                else
                {
                    val = default;
                }

                return retVal;
            };

        public static TryRetrieve<TOutVal> GetRetriever<TOutVal>(
            this IEnumerator<TOutVal> nmrtr) => (out TOutVal val) => GetRetriever(
                nmrtr, v => v)(out val);

        public static TryRetrieve<TInput, TOutput> GetRetriever<TInput, TOutput>(
            this IEnumerator<TOutput> nmrtr)
        {
            var retriever = nmrtr.GetRetriever();

            TryRetrieve<TInput, TOutput> retRetriever = (
                TInput inVal, out TOutput val) => retriever(out val);

            return retRetriever;
        }

        public static TryRetrieve<TInput, TOutVal> GetRetriever<TInput, TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor)
        {
            var retriever = nmrtr.GetRetriever(
                convertor);

            TryRetrieve<TInput, TOutVal> retRetriever = (
                TInput inVal, out TOutVal val) => retriever(out val);

            return retRetriever;
        }

        public static TryRetrieve1<TObj, TInput, TOutput> GetRetriever<TObj, TInput, TOutput>(
            this IEnumerator<TOutput> nmrtr)
        {
            var retriever = nmrtr.GetRetriever();

            TryRetrieve1<TObj, TInput, TOutput> retRetriever = (
                TObj obj, TInput inVal, out TOutput val) => retriever(out val);

            return retRetriever;
        }

        public static TryRetrieve1<TObj, TInput, TOutVal> GetRetriever<TObj, TInput, TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor)
        {
            var retriever = nmrtr.GetRetriever(
                convertor);

            TryRetrieve1<TObj, TInput, TOutVal> retRetriever = (
                TObj obj, TInput inVal, out TOutVal val) => retriever(out val);

            return retRetriever;
        }

        public static TryRetrieve<TInput, TOutput> GetRetriever<TInput, TOutput>(
            this IEnumerator<TOutput> nmrtr, TInput input) => GetRetriever<TInput, TOutput>(
                nmrtr);

        public static TryRetrieve1<TObj, TInput, TOutput> GetRetriever<TObj, TInput, TOutput>(
            this IEnumerator<TOutput> nmrtr, TInput input, TObj obj) => GetRetriever<TObj, TInput, TOutput>(
                nmrtr);

        public static TryRetrieve<TInput, TOutVal> GetRetriever<TInput, TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor,
            TInput input) => GetRetriever<TInput, TInVal, TOutVal>(
                nmrtr, convertor);

        public static TryRetrieve1<TObj, TInput, TOutVal> GetRetriever<TObj, TInput, TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor,
            TInput input, TObj obj) => GetRetriever<TObj, TInput, TInVal, TOutVal>(
                nmrtr, convertor);
    }
}

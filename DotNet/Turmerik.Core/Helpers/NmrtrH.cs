using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Helpers
{
    public static class NmrtrH
    {
        public static TryRetrieve1Out<TOutVal> GetRetriever<TInVal, TOutVal>(
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

        public static TryRetrieve1Out<TOutVal> GetRetriever<TOutVal>(
            this IEnumerator<TOutVal> nmrtr) => (out TOutVal val) => GetRetriever(
                nmrtr, v => v)(out val);

        public static TryRetrieve1In1Out<TInput, TOutput> GetRetriever<TInput, TOutput>(
            this IEnumerator<TOutput> nmrtr)
        {
            var retriever = nmrtr.GetRetriever();

            TryRetrieve1In1Out<TInput, TOutput> retRetriever = (
                TInput inVal, out TOutput val) => retriever(out val);

            return retRetriever;
        }

        public static TryRetrieve1In1Out<TInput, TOutVal> GetRetriever<TInput, TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor)
        {
            var retriever = nmrtr.GetRetriever(
                convertor);

            TryRetrieve1In1Out<TInput, TOutVal> retRetriever = (
                TInput inVal, out TOutVal val) => retriever(out val);

            return retRetriever;
        }

        public static TryRetrieve2In1Out<TInput1, TInput2, TOutput> GetRetriever<TInput1, TInput2, TOutput>(
            this IEnumerator<TOutput> nmrtr)
        {
            var retriever = nmrtr.GetRetriever();

            TryRetrieve2In1Out<TInput1, TInput2, TOutput> retRetriever = (
                TInput1 input1, TInput2 input2, out TOutput output) => retriever(out output);

            return retRetriever;
        }

        public static TryRetrieve2In1Out<TInput1, TInput2, TOutVal> GetRetriever<TInput1, TInput2, TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor)
        {
            var retriever = nmrtr.GetRetriever(
                convertor);

            TryRetrieve2In1Out<TInput1, TInput2, TOutVal> retRetriever = (
                TInput1 input1, TInput2 inVal, out TOutVal val) => retriever(out val);

            return retRetriever;
        }

        public static TryRetrieve1In1Out<TInput, TOutput> GetRetriever<TInput, TOutput>(
            this IEnumerator<TOutput> nmrtr, TInput input) => GetRetriever<TInput, TOutput>(
                nmrtr);

        public static TryRetrieve2In1Out<TInput1, TInput2, TOutput> GetRetriever<TInput1, TInput2, TOutput>(
            this IEnumerator<TOutput> nmrtr, TInput2 input2, TInput1 input1) => GetRetriever<TInput1, TInput2, TOutput>(
                nmrtr);

        public static TryRetrieve1In1Out<TInput, TOutVal> GetRetriever<TInput, TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor,
            TInput input) => GetRetriever<TInput, TInVal, TOutVal>(
                nmrtr, convertor);

        public static TryRetrieve2In1Out<TInput1, TInput2, TOutVal> GetRetriever<TInput1, TInput2, TInVal, TOutVal>(
            this IEnumerator<TInVal> nmrtr,
            Func<TInVal, TOutVal> convertor,
            TInput2 input2, TInput1 input1) => GetRetriever<TInput1, TInput2, TInVal, TOutVal>(
                nmrtr, convertor);
    }
}

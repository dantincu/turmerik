using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public partial class FuncH
    {
        public static TOut With<TIn, TOut>(
            this TIn inVal,
            Func<TIn, TOut> convertor) => convertor(inVal);

        public static TOut With<TIn1, TIn2, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            Func<TIn1, TIn2, TOut> convertor) => convertor(inVal1, inVal2);

        public static TOut With<TIn1, TIn2, TIn3, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            Func<TIn1, TIn2, TIn3, TOut> convertor) => convertor(inVal1, inVal2, inVal3);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            Func<TIn1, TIn2, TIn3, TIn4, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            TIn9 inVal9,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8, inVal9);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            TIn9 inVal9,
            TIn10 inVal10,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8, inVal9, inVal10);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            TIn9 inVal9,
            TIn10 inVal10,
            TIn11 inVal11,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8, inVal9, inVal10, inVal11);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            TIn9 inVal9,
            TIn10 inVal10,
            TIn11 inVal11,
            TIn12 inVal12,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8, inVal9, inVal10, inVal11, inVal12);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TIn13, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            TIn9 inVal9,
            TIn10 inVal10,
            TIn11 inVal11,
            TIn12 inVal12,
            TIn13 inVal13,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TIn13, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8, inVal9, inVal10, inVal11, inVal12, inVal13);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TIn13, TIn14, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            TIn9 inVal9,
            TIn10 inVal10,
            TIn11 inVal11,
            TIn12 inVal12,
            TIn13 inVal13,
            TIn14 inVal14,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TIn13, TIn14, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8, inVal9, inVal10, inVal11, inVal12, inVal13, inVal14);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TIn13, TIn14, TIn15, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            TIn9 inVal9,
            TIn10 inVal10,
            TIn11 inVal11,
            TIn12 inVal12,
            TIn13 inVal13,
            TIn14 inVal14,
            TIn15 inVal15,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TIn13, TIn14, TIn15, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8, inVal9, inVal10, inVal11, inVal12, inVal13, inVal14, inVal15);

        public static TOut With<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TIn13, TIn14, TIn15, TIn16, TOut>(
            this TIn1 inVal1,
            TIn2 inVal2,
            TIn3 inVal3,
            TIn4 inVal4,
            TIn5 inVal5,
            TIn6 inVal6,
            TIn7 inVal7,
            TIn8 inVal8,
            TIn9 inVal9,
            TIn10 inVal10,
            TIn11 inVal11,
            TIn12 inVal12,
            TIn13 inVal13,
            TIn14 inVal14,
            TIn15 inVal15,
            TIn16 inVal16,
            Func<TIn1, TIn2, TIn3, TIn4, TIn5, TIn6, TIn7, TIn8, TIn9, TIn10, TIn11, TIn12, TIn13, TIn14, TIn15, TIn16, TOut> convertor) => convertor(inVal1, inVal2, inVal3, inVal4, inVal5, inVal6, inVal7, inVal8, inVal9, inVal10, inVal11, inVal12, inVal13, inVal14, inVal15, inVal16);
    }
}

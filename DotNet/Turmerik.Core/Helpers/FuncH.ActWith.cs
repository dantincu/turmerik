using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public partial class FuncH
    {
        public static TVal ActWith<TVal>(
            this TVal val,
            Action<TVal> callback)
        {
            callback?.Invoke(val);
            return val;
        }

        public static Tuple<TVal1, TVal2> ActWith<TVal1, TVal2>(
            this TVal1 val1,
            TVal2 val2,
            Action<TVal1, TVal2> callback)
        {
            callback?.Invoke(val1, val2);
            return Tuple.Create(val1, val2);
        }

        public static Tuple<TVal1, TVal2, TVal3> ActWith<TVal1, TVal2, TVal3>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            Action<TVal1, TVal2, TVal3> callback)
        {
            callback?.Invoke(val1, val2, val3);
            return Tuple.Create(val1, val2, val3);
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4> ActWith<TVal1, TVal2, TVal3, TVal4>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            Action<TVal1, TVal2, TVal3, TVal4> callback)
        {
            callback?.Invoke(val1, val2, val3, val4);
            return Tuple.Create(val1, val2, val3, val4);
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8, TVal9>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            TVal9 val9,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8, val9);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8, val9));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8, TVal9, TVal10>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            TVal9 val9,
            TVal10 val10,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8, val9, val10));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            TVal9 val9,
            TVal10 val10,
            TVal11 val11,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8, val9, val10, val11));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11>, Tuple<TVal12>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            TVal9 val9,
            TVal10 val10,
            TVal11 val11,
            TVal12 val12,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8, val9, val10, val11), Tuple.Create(val12));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11>, Tuple<TVal12, TVal13>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12, TVal13>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            TVal9 val9,
            TVal10 val10,
            TVal11 val11,
            TVal12 val12,
            TVal13 val13,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12, TVal13> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12, val13);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8, val9, val10, val11), Tuple.Create(val12, val13));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11>, Tuple<TVal12, TVal13, TVal14>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12, TVal13, TVal14>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            TVal9 val9,
            TVal10 val10,
            TVal11 val11,
            TVal12 val12,
            TVal13 val13,
            TVal14 val14,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12, TVal13, TVal14> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12, val13, val14);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8, val9, val10, val11), Tuple.Create(val12, val13, val14));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11>, Tuple<TVal12, TVal13, TVal14, TVal15>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12, TVal13, TVal14, TVal15>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            TVal9 val9,
            TVal10 val10,
            TVal11 val11,
            TVal12 val12,
            TVal13 val13,
            TVal14 val14,
            TVal15 val15,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12, TVal13, TVal14, TVal15> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12, val13, val14, val15);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8, val9, val10, val11), Tuple.Create(val12, val13, val14, val15));
        }

        public static Tuple<TVal1, TVal2, TVal3, TVal4, Tuple<TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11>, Tuple<TVal12, TVal13, TVal14, TVal15, TVal16>> ActWith<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12, TVal13, TVal14, TVal15, TVal16>(
            this TVal1 val1,
            TVal2 val2,
            TVal3 val3,
            TVal4 val4,
            TVal5 val5,
            TVal6 val6,
            TVal7 val7,
            TVal8 val8,
            TVal9 val9,
            TVal10 val10,
            TVal11 val11,
            TVal12 val12,
            TVal13 val13,
            TVal14 val14,
            TVal15 val15,
            TVal16 val16,
            Action<TVal1, TVal2, TVal3, TVal4, TVal5, TVal6, TVal7, TVal8, TVal9, TVal10, TVal11, TVal12, TVal13, TVal14, TVal15, TVal16> callback)
        {
            callback?.Invoke(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12, val13, val14, val15, val16);
            return Tuple.Create(val1, val2, val3, val4, Tuple.Create(val5, val6, val7, val8, val9, val10, val11), Tuple.Create(val12, val13, val14, val15, val16));
        }
    }
}

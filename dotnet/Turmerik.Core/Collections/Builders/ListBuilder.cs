using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Collections.Builders
{
    public static class ListBuilder
    {
        public static List<T> BuildList<T>(this List<T> list, Action<List<T>> builder)
        {
            builder(list);
            return list;
        }

        public static List<T> BuildList<T1, T>(
            this List<T> list,
            Action<List<T>,
                Func<T1, T>> builder,
            Func<T1, T> valueFactory)
        {
            builder(list, valueFactory);
            return list;
        }

        public static List<T> BuildList<T1, T2, T>(
            this List<T> list,
            Action<List<T>,
                Func<T1, T2, T>> builder,
            Func<T1, T2, T> valueFactory)
        {
            builder(list, valueFactory);
            return list;
        }

        public static List<T> BuildList<T1, T2, T3, T>(
            this List<T> list,
            Action<List<T>,
                Func<T1, T2, T3, T>> builder,
            Func<T1, T2, T3, T> valueFactory)
        {
            builder(list, valueFactory);
            return list;
        }

        public static List<T> BuildList<T1, T2, T3, T4, T>(
            this List<T> list,
            Action<List<T>,
                Func<T1, T2, T3, T4, T>> builder,
            Func<T1, T2, T3, T4, T> valueFactory)
        {
            builder(list, valueFactory);
            return list;
        }

        public static List<T> BuildList<T1, T2, T3, T4, T5, T>(
            this List<T> list,
            Action<List<T>,
                Func<T1, T2, T3, T4, T5, T>> builder,
            Func<T1, T2, T3, T4, T5, T> valueFactory)
        {
            builder(list, valueFactory);
            return list;
        }

        public static List<T> BuildList<T1, T2, T3, T4, T5, T6, T>(
            this List<T> list,
            Action<List<T>,
                Func<T1, T2, T3, T4, T5, T6, T>> builder,
            Func<T1, T2, T3, T4, T5, T6, T> valueFactory)
        {
            builder(list, valueFactory);
            return list;
        }

        public static List<T> BuildList<T1, T2, T3, T4, T5, T6, T7, T>(
            this List<T> list,
            Action<List<T>,
                Func<T1, T2, T3, T4, T5, T6, T7, T>> builder,
            Func<T1, T2, T3, T4, T5, T6, T7, T> valueFactory)
        {
            builder(list, valueFactory);
            return list;
        }

        public static List<T> BuildList<T1, T2, T3, T4, T5, T6, T7, T8, T>(
            this List<T> list,
            Action<List<T>,
                Func<T1, T2, T3, T4, T5, T6, T7, T8, T>> builder,
            Func<T1, T2, T3, T4, T5, T6, T7, T8, T> valueFactory)
        {
            builder(list, valueFactory);
            return list;
        }
    }
}

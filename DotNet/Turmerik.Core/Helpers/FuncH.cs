﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Helpers
{
    public static partial class FuncH
    {
        public static T If<T>(
            this bool condition,
            Func<T> ifTrueAction = null,
            Func<T> ifFalseAction = null)
        {
            T retVal;

            if (condition)
            {
                retVal = ifTrueAction.FirstNotNull(
                    () => default).Invoke();
            }
            else
            {
                retVal = ifFalseAction.FirstNotNull(
                    () => default).Invoke();
            }

            return retVal;
        }

        public static bool ActIf(
            this bool condition,
            Action ifTrueAction = null,
            Action ifFalseAction = null)
        {
            if (condition)
            {
                ifTrueAction?.Invoke();
            }
            else
            {
                ifFalseAction?.Invoke();
            }

            return condition;
        }

        public static TOut IfNotNull<TIn, TOut>(
            this TIn inVal,
            Func<TIn, TOut> convertor,
            Func<TOut> defaultValueFactory = null)
        {
            TOut outVal;

            if (inVal != null)
            {
                outVal = convertor(inVal);
            }
            else if (defaultValueFactory != null)
            {
                outVal = defaultValueFactory();
            }
            else
            {
                outVal = default;
            }

            return outVal;
        }

        public static T IfNull<T>(
            this T inVal,
            Func<T> defaultValueFactory) => inVal.IfNotNull(
                val => val, defaultValueFactory);

        public static TVal ActIfNotNull<TVal>(
            this TVal inVal,
            Action<TVal> callback,
            Action nullCallback = null)
        {
            if (inVal != null)
            {
                callback(inVal);
            }
            else if (nullCallback != null)
            {
                nullCallback();
            }

            return inVal;
        }

        public static TOut IfNotDefault<TIn, TOut>(
            this TIn inVal,
            Func<TIn, TOut> convertor,
            Func<TOut> defaultValueFactory = null,
            IEqualityComparer<TIn> inValEqCompr = null)
        {
            inValEqCompr ??= EqualityComparer<TIn>.Default;
            TOut outVal;

            if (!inValEqCompr.Equals(inVal, default))
            {
                outVal = convertor(inVal);
            }
            else if (defaultValueFactory != null)
            {
                outVal = defaultValueFactory();
            }
            else
            {
                outVal = default;
            }

            return outVal;
        }

        public static TVal ActIfNotDefault<TVal>(
            this TVal inVal,
            Action<TVal> callback,
            Action dfCallback = null,
            IEqualityComparer<TVal> inValEqCompr = null)
        {
            inValEqCompr ??= EqualityComparer<TVal>.Default;

            if (inValEqCompr.Equals(inVal, default))
            {
                callback(inVal);
            }
            else if (dfCallback != null)
            {
                dfCallback();
            }

            return inVal;
        }

        public static TVal IfDefault<TVal>(
            this TVal val,
            Func<TVal> defaultValueFactory = null,
            Func<TVal, TVal> convertor = null,
            IEqualityComparer<TVal> inValEqCompr = null)
        {
            inValEqCompr ??= EqualityComparer<TVal>.Default;

            if (inValEqCompr.Equals(val, default))
            {
                if (defaultValueFactory != null)
                {
                    val = defaultValueFactory();
                }
            }
            else if (convertor != null)
            {
                val = convertor(val);
            }

            return val;
        }

        public static TOut IfDefault<TIn, TOut>(
            this TIn inVal,
            Func<TOut> defaultValueFactory = null,
            Func<TIn, TOut> convertor = null,
            IEqualityComparer<TIn> inValEqCompr = null)
        {
            inValEqCompr ??= EqualityComparer<TIn>.Default;
            TOut outVal;

            if (inValEqCompr.Equals(inVal, default))
            {
                if (defaultValueFactory != null)
                {
                    outVal = defaultValueFactory();
                }
                else
                {
                    outVal = default;
                }
            }
            else if (convertor != null)
            {
                outVal = convertor(inVal);
            }
            else
            {
                outVal = default;
            }

            return outVal;
        }

        public static TVal ActIfDefault<TVal>(
            this TVal inVal,
            Action dfCallback,
            Action<TVal> callback = null,
            IEqualityComparer<TVal> inValEqCompr = null)
        {
            inValEqCompr ??= EqualityComparer<TVal>.Default;

            if (inValEqCompr.Equals(inVal, default))
            {
                callback(inVal);
            }
            else if (dfCallback != null)
            {
                dfCallback();
            }

            return inVal;
        }

        public static TOutVal BothNullOr<TInVal, TOutVal>(
            TInVal firstVal, TInVal secondVal,
            Func<TInVal, TInVal, TOutVal> retValFactory,
            Func<TInVal, TOutVal> secondValNullFactory = null,
            Func<TInVal, TOutVal> firstValNullFactory = null,
            Func<TOutVal> bothValuesNullFactory = null)
        {
            TOutVal retVal;

            if (firstVal != null)
            {
                if (secondVal != null)
                {
                    retVal = retValFactory(
                        firstVal, secondVal);
                }
                else if (secondValNullFactory != null)
                {
                    retVal = secondValNullFactory(firstVal);
                }
                else
                {
                    retVal = default;
                }
            }
            else if (firstValNullFactory != null)
            {
                retVal = firstValNullFactory(secondVal);
            }
            else if (bothValuesNullFactory != null)
            {
                retVal = bothValuesNullFactory();
            }
            else
            {
                retVal = default;
            }

            return retVal;
        }

        public static void ExecuteFirstAction(
            this Action firstAction,
            params Action[] nextActionsArr) => firstAction.FirstNotNull(
                nextActionsArr).Invoke();

        public static T ExecuteFirstFunc<T>(
            this Func<T> firstFunc,
            params Func<T>[] nextFuncsArr) => firstFunc.FirstNotNull(
                nextFuncsArr).Invoke();
    }
}

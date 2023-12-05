using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Helpers
{
    public static partial class FuncH
    {
        public static async Task<TOut> WithSync<TIn, TOut>(
            this Task<TIn> inTask,
            Func<TIn, TOut> convertor) => convertor(await inTask);

        public static async Task<TVal> ActWithSync<TVal>(
            this Task<TVal> task,
            Action<TVal> callback)
        {
            var val = await task;
            callback(val);

            return val;
        }

        public static async Task<bool> ActIfSync(
            this Task<bool> conditionTask,
            Action ifTrueAction = null,
            Action ifFalseAction = null)
        {
            var condition = await conditionTask;

            condition.ActIf(
                ifTrueAction,
                ifFalseAction);

            return condition;
        }

        public static async Task<T> IfSync<T>(
            this Task<bool> conditionTask,
            Func<T> ifTrueAction = null,
            Func<T> ifFalseAction = null)
        {
            var condition = await conditionTask;

            var retVal = condition.If(
                ifTrueAction,
                ifFalseAction);

            return retVal;
        }

        public static async Task<TOut> IfNotNullSync<TIn, TOut>(
            this Task<TIn> task,
            Func<TIn, TOut> convertor,
            Func<TOut> defaultValueFactory = null)
        {
            var inVal = await task;
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

        public static Task<T> IfNullSync<T>(
            this Task<T> inTask,
            Func<T> defaultValueFactory) => inTask.IfNotNullSync(
                val => val, defaultValueFactory);

        public static async Task<TVal> ActIfNotNullSync<TVal>(
            this Task<TVal> task,
            Action<TVal> callback,
            Action nullCallback = null)
        {
            var inVal = await task;

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
    }
}

using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Helpers
{
    public static partial class FuncH
    {
        public static async Task<TOut> WithAsync<TIn, TOut>(
            this TIn inVal,
            Func<TIn, Task<TOut>> convertor) => await convertor(inVal);

        public static async Task<TOut> WithAsync<TIn, TOut>(
            this Task<TIn> inTask,
            Func<TIn, Task<TOut>> convertor) => await convertor(await inTask);

        public static async Task<TVal> ActWithAsync<TVal>(
            this TVal val,
            Func<TVal, Task> callback)
        {
            await callback(val);
            return val;
        }

        public static async Task<TVal> ActWithAsync<TVal>(
            this Task<TVal> task,
            Func<TVal, Task> callback)
        {
            var val = await task;
            await callback(val);

            return val;
        }

        public static async Task<T> IfAsync<T>(
            this bool condition,
            Func<Task<T>> ifTrueAction = null,
            Func<Task<T>> ifFalseAction = null)
        {
            T retVal;

            if (condition)
            {
                if (ifTrueAction != null)
                {
                    retVal = await ifTrueAction();
                }
                else
                {
                    retVal = default;
                }
            }
            else
            {
                if (ifFalseAction != null)
                {
                    retVal = await ifFalseAction();
                }
                else
                {
                    retVal = default;
                }
            }

            return retVal;
        }

        public static async Task<T> IfAsync<T>(
            this Task<bool> conditionTask,
            Func<Task<T>> ifTrueAction = null,
            Func<Task<T>> ifFalseAction = null)
        {
            var condition = await conditionTask;

            var retVal = await condition.IfAsync(
                ifTrueAction,
                ifFalseAction);

            return retVal;
        }

        public static async Task<bool> ActIfAsync(
            this bool condition,
            Func<Task> ifTrueAction = null,
            Func<Task> ifFalseAction = null)
        {
            if (condition)
            {
                if (ifTrueAction != null)
                {
                    await ifTrueAction();
                }
            }
            else
            {
                if (ifFalseAction != null)
                {
                    await ifFalseAction();
                }
            }

            return condition;
        }

        public static async Task<bool> ActIfAsync(
            this Task<bool> conditionTask,
            Func<Task> ifTrueAction = null,
            Func<Task> ifFalseAction = null)
        {
            var condition = await conditionTask;

            await condition.ActIfAsync(
                ifTrueAction,
                ifFalseAction);

            return condition;
        }

        public static async Task<TOut> IfNotNullAsync<TIn, TOut>(
            this TIn inVal,
            Func<TIn, Task<TOut>> convertor,
            Func<Task<TOut>> defaultValueFactory = null)
        {
            TOut outVal;

            if (inVal != null)
            {
                outVal = await convertor(inVal);
            }
            else if (defaultValueFactory != null)
            {
                outVal = await defaultValueFactory();
            }
            else
            {
                outVal = default;
            }

            return outVal;
        }

        public static async Task<TOut> IfNotNullAsync<TIn, TOut>(
            this Task<TIn> task,
            Func<TIn, Task<TOut>> convertor,
            Func<Task<TOut>> defaultValueFactory = null)
        {
            var inVal = await task;
            TOut outVal;

            if (inVal != null)
            {
                outVal = await convertor(inVal);
            }
            else if (defaultValueFactory != null)
            {
                outVal = await defaultValueFactory();
            }
            else
            {
                outVal = default;
            }

            return outVal;
        }

        public static async Task<TVal> ActIfNotNullAsync<TVal>(
            this TVal inVal,
            Func<TVal, Task> callback,
            Func<Task> nullCallback = null)
        {
            if (inVal != null)
            {
                await callback(inVal);
            }
            else if (nullCallback != null)
            {
                await nullCallback();
            }

            return inVal;
        }

        public static async Task<TVal> ActIfNotNullAsync<TVal>(
            this Task<TVal> task,
            Func<TVal, Task> callback,
            Func<Task> nullCallback = null)
        {
            var inVal = await task;

            if (inVal != null)
            {
                await callback(inVal);
            }
            else if (nullCallback != null)
            {
                await nullCallback();
            }

            return inVal;
        }
    }
}

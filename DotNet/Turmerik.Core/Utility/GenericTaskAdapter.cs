using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Utility
{
    public interface IGenericTaskAdapter
    {
        object GetResult(
            Task task);

        bool TryGetResult(
            Task task,
            out object value,
            Func<object>? defaultValueFactory = null);

        Task<object> WaitAndGetResultAsync(
            Task task);

        Task<Tuple<bool, object>> WaitAndTryGetResultAsync(
            Task task,
            Func<object>? defaultValueFactory = null);

        Task<ValueOrTask> ToValueOrTaskAsync(object arg);
    }

    public class GenericTaskAdapter : IGenericTaskAdapter
    {
        public static readonly Type TaskGenericTypeDef;
        public static readonly PropertyInfo TaskResultPropInfo;

        static GenericTaskAdapter()
        {
            TaskGenericTypeDef = typeof(Task<object>).GetGenericTypeDefinition();

            TaskResultPropInfo = TaskGenericTypeDef.GetProperty(
                nameof(Task<object>.Result));
        }

        public object GetResult(
            Task task) => TaskResultPropInfo.GetValue(task);

        public bool TryGetResult(
            Task task,
            out object value,
            Func<object>? defaultValueFactory = null)
        {
            bool isValid = task.GetType().IsGenericType;

            if (isValid)
            {
                value = GetResult(task);
            }
            else
            {
                defaultValueFactory ??= () => null;
                value = defaultValueFactory();
            }

            return isValid;
        }

        public async Task<object> WaitAndGetResultAsync(
            Task task)
        {
            await task;
            var result = GetResult(task);

            return result;
        }

        public async Task<Tuple<bool, object>> WaitAndTryGetResultAsync(
            Task task,
            Func<object>? defaultValueFactory = null)
        {
            bool isValid = task.GetType().IsGenericType;
            object value;

            if (isValid)
            {
                value = await WaitAndGetResultAsync(task);
            }
            else
            {
                defaultValueFactory ??= () => null;
                value = defaultValueFactory();
            }

            return Tuple.Create(isValid, value);
        }

        public async Task<ValueOrTask> ToValueOrTaskAsync(object arg)
        {
            ValueOrTask valueOrTask;

            if (arg is Task task)
            {
                if (task.GetType().IsGenericType)
                {
                    await task;
                    var value = GetResult(task);

                    valueOrTask = new ValueOrTask(value, true, null, task);
                }
                else
                {
                    valueOrTask = new ValueOrTask(null, true, task, null);
                }
            }
            else
            {
                valueOrTask = new ValueOrTask(arg, false, null, null);
            }

            return valueOrTask;
        }
    }
}

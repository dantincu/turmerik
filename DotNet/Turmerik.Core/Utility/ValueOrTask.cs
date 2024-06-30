using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Utility
{
    public class ValueOrTask
    {
        public ValueOrTask(
            object? value,
            bool isTask,
            Task? voidTask,
            Task? genericTask)
        {
            Value = value;
            IsTask = isTask;
            VoidTask = voidTask;
            GenericTask = genericTask;
        }

        public object? Value { get; }
        public bool IsTask { get; }
        public Task? VoidTask { get; }
        public Task? GenericTask { get; }
    }
}

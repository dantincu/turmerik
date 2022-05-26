using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Reflection
{
    public static class ActvtrH
    {
        public static T Create<T>(this Type type, params object[] args)
        {
            T obj = (T)Activator.CreateInstance(type, args);
            return obj;
        }

        public static T Create<T>(params object[] args)
        {
            T obj = (T)Activator.CreateInstance(typeof(T), args);
            return obj;
        }
    }
}

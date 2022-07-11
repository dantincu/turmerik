using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Components;
using Turmerik.Core.Reflection.Wrappers;

namespace Turmerik.Core.Infrastucture
{
    public static class ConfigKeysH
    {
        public const string TRMRK = "Trmrk";
    }

    public static class ConfigH
    {
        public static T GetObject<T>(this IConfiguration config, string objKey, T obj, IEnumerable<PropertyWrapper> propWrappers)
        {
            foreach (var propInfo in propWrappers)
            {
                string name = propInfo.Name;
                Type type = propInfo.PropType.Value.Data;

                object value = config.GetValue(type, $"{objKey}:{name}");
                propInfo.Data.SetValue(obj, value);
            }

            return obj;
        }

        public static T GetObject<T>(this IConfiguration config, ITypesStaticDataCache typesCache, string objKey, T obj)
        {
            obj = config.GetObject(objKey, obj, typesCache.Get<T>().InstPubGetPubSetProps.Value);
            return obj;
        }

        public static T GetObject<T>(this IConfiguration config, ITypesStaticDataCache typesCache, string objKey, Type type, Action<T> callback = null)
        {
            T obj = Activator.CreateInstance<T>();
            obj = config.GetObject(objKey, obj, typesCache.Get(type).InstPubGetPubSetProps.Value);

            callback?.Invoke(obj);
            return obj;
        }

        public static T GetObject<T>(this IConfiguration config, ITypesStaticDataCache typesCache, string objKey)
        {
            T obj = Activator.CreateInstance<T>();
            obj = config.GetObject(typesCache, objKey, obj);

            return obj;
        }
    }
}

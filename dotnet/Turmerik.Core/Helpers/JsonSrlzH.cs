using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class JsonSrlzH
    {
        public static string ToJson(this object obj)
        {
            string json = JsonConvert.SerializeObject(
                obj, Formatting.Indented);

            return json;
        }

        public static TData FromJson<TData>(this string json)
        {
            TData data = JsonConvert.DeserializeObject<TData>(json);
            return data;
        }
    }
}

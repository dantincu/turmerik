using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class JsonSrlzH
    {
        public static string ToJson(
            this object obj,
            bool useCamelCase = true,
            bool ignoreNullValues = true)
        {
            var settings = new JsonSerializerSettings();

            if (ignoreNullValues)
            {
                settings.NullValueHandling = NullValueHandling.Ignore;
            }

            if (useCamelCase)
            {
                settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            }

            string json = JsonConvert.SerializeObject(
                obj, Formatting.Indented,
                settings);

            return json;
        }

        public static TData FromJson<TData>(this string json)
        {
            TData data = JsonConvert.DeserializeObject<TData>(json);
            return data;
        }
    }
}

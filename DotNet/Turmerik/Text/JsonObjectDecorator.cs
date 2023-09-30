using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.Text
{
    public interface IJsonObjectDecorator<T>
    {
        T Data { get; }

        T ShallowMergeWith(
            T newData,
            JsonSerializerOpts opts);

        T ShallowMergeWith(
            T newData,
            bool useCamelCase = true,
            bool useStringEnumConverter = true);

        string Serialize();
    }

    public class JsonObjectDecorator<T> : IJsonObjectDecorator<T>
    {
        public JsonObjectDecorator(
            IJsonConversionAdapter adapter,
            string rawJson,
            JsonSerializerOpts opts)
        {
            Adapter = adapter ?? throw new ArgumentNullException(nameof(adapter));
            RawObj = Adapter.Deserialize(rawJson, opts) as JObject;
            Data = Deserialize(RawObj);
        }

        public JsonObjectDecorator(
            IJsonConversionAdapter adapter,
            JObject rawObj)
        {
            Adapter = adapter ?? throw new ArgumentNullException(nameof(adapter));
            RawObj = rawObj ?? throw new ArgumentNullException(nameof(rawObj));
            Data = Deserialize(rawObj);
        }

        public T Data { get; private set; }

        protected IJsonConversionAdapter Adapter { get; }
        protected JObject RawObj { get; }

        public T ShallowMergeWith(
            T newData,
            JsonSerializerOpts opts)
        {
            JObject newObj = Adapter.ToJObject(
                newData, opts);

            foreach (var kvp in newObj)
            {
                RawObj[kvp.Key] = kvp.Value;
            }

            Data = Deserialize(RawObj);
            return Data;
        }

        public T ShallowMergeWith(
            T newData,
            bool useCamelCase = true,
            bool useStringEnumConverter = true) => ShallowMergeWith(
                newData, new JsonSerializerOpts(
                    useCamelCase, true, useStringEnumConverter));

        public string Serialize() => RawObj.ToString();

        private T Deserialize(
            JObject rawObj) => rawObj.ToObject<T>();
    }
}

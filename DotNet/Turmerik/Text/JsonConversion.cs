using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.Text
{
    public interface IJsonConversion
    {
        StaticDataCache<JsonSerializerOpts, JsonSerializerTuple> SettingsMap { get; }
        IJsonConversionAdapter Adapter { get; }

        IJsonObjectDecorator<T> Decorator<T>(
            string rawJson,
            JsonSerializerOpts opts);

        IJsonObjectDecorator<T> Decorator<T>(
            string rawJson,
            bool useCamelCase = false,
            bool useStringEnumConverter = false);

        IJsonObjectDecorator<T> Decorator<T>(JObject rawObj);
    }

    public class JsonConversion : IJsonConversion
    {
        public JsonConversion()
        {
            SettingsMap = new StaticDataCache<JsonSerializerOpts, JsonSerializerTuple>(
                opts => JsonH.CreateJsonSerializerSettings(
                    opts).With(settings => new JsonSerializerTuple(
                        JsonSerializer.Create(settings), settings)));

            Adapter = new JsonConversionAdapter(SettingsMap);
        }

        public StaticDataCache<JsonSerializerOpts, JsonSerializerTuple> SettingsMap { get; }
        public IJsonConversionAdapter Adapter { get; }

        public IJsonObjectDecorator<T> Decorator<T>(
            string rawJson,
            JsonSerializerOpts opts) => new JsonObjectDecorator<T>(
                Adapter, rawJson, opts);

        public IJsonObjectDecorator<T> Decorator<T>(
            string rawJson,
            bool useCamelCase = false,
            bool useStringEnumConverter = false) => Decorator<T>(
                rawJson, new JsonSerializerOpts(
                    useCamelCase, true, useStringEnumConverter));

        public IJsonObjectDecorator<T> Decorator<T>(
            JObject rawObj) => new JsonObjectDecorator<T>(
                Adapter, rawObj);
    }
}

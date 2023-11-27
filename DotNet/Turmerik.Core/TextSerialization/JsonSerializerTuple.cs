using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.TextSerialization
{
    public readonly struct JsonSerializerTuple
    {
        public JsonSerializerTuple(
            JsonSerializer serializer,
            JsonSerializerSettings serializerSettings)
        {
            Serializer = serializer;
            SerializerSettings = serializerSettings;
        }

        public JsonSerializer Serializer { get; }
        public JsonSerializerSettings SerializerSettings { get; }
    }
}

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Core.Helpers;
using System.Linq;

namespace Turmerik.DirsPair.ConsoleApps.MkFsDirsPairCfg
{
    public static class ProgramConfigData
    {
        public static class MapChunk
        {
            public interface IClnbl
            {
                IEnumerable<KeyValuePair<string, string>>? GetMap();
            }

            public class Immtbl : IClnbl
            {
                public Immtbl(IClnbl src)
                {
                    Map = src.GetMap()?.Dictnr().RdnlD();
                }

                public ReadOnlyDictionary<string, string>? Map { get; }

                public IEnumerable<KeyValuePair<string, string>>? GetMap() => Map;
            }

            public class Mtbl : IClnbl
            {
                public Mtbl()
                {
                }

                public Mtbl(IClnbl src)
                {
                    Map = src.GetMap()?.Dictnr();
                }

                public Dictionary<string, string>? Map { get; set; }

                public IEnumerable<KeyValuePair<string, string>>? GetMap() => Map;
            }
        }

        public interface IClnbl
        {
            IEnumerable<KeyValuePair<string, MapChunk.IClnbl>>? GetChunksMap();
        }

        public class Immtbl : IClnbl
        {
            public Immtbl(IClnbl src)
            {
                ChunksMap = src.GetChunksMap()?.ToImmtbl();
            }

            public ReadOnlyDictionary<string, MapChunk.Immtbl>? ChunksMap { get; }

            public IEnumerable<KeyValuePair<string, MapChunk.IClnbl>>? GetChunksMap(
                ) => ChunksMap?.Select(
                    kvp => new KeyValuePair<string, MapChunk.IClnbl>(
                        kvp.Key, kvp.Value));
        }

        public class Mtbl : IClnbl
        {
            public Mtbl()
            {
            }

            public Mtbl(IClnbl src)
            {
                ChunksMap = src.GetChunksMap()?.ToMtbl();
            }

            public Dictionary<string, MapChunk.Mtbl>? ChunksMap { get; set; }

            public IEnumerable<KeyValuePair<string, MapChunk.IClnbl>>? GetChunksMap(
                ) => ChunksMap?.Select(
                    kvp => new KeyValuePair<string, MapChunk.IClnbl>(
                        kvp.Key, kvp.Value));
        }

        public static Immtbl ToImmtbl(
            this IClnbl src) => new Immtbl(src);

        public static MapChunk.Immtbl ToImmtbl(
            this MapChunk.IClnbl src) => new MapChunk.Immtbl(src);

        public static KeyValuePair<string, MapChunk.Immtbl> ToImmtbl(
            this KeyValuePair<string, MapChunk.IClnbl> src) => src.ToKvp(
                clnbl => clnbl as MapChunk.Immtbl);

        public static ReadOnlyDictionary<string, MapChunk.Immtbl> ToImmtbl(
            this IEnumerable<KeyValuePair<string, MapChunk.IClnbl>> src) => src?.ToDictionary(
                kvp => kvp.Key, kvp => kvp.Value?.ToImmtbl()).RdnlD();

        public static Mtbl ToMtbl(
            this IClnbl src) => new Mtbl(src);

        public static MapChunk.Mtbl ToMtbl(
            this MapChunk.IClnbl src) => new MapChunk.Mtbl(src);

        public static KeyValuePair<string, MapChunk.Mtbl> ToMtbl(
            this KeyValuePair<string, MapChunk.IClnbl> src) => src.ToKvp(
                clnbl => clnbl as MapChunk.Mtbl);

        public static Dictionary<string, MapChunk.Mtbl> ToMtbl(
            this IEnumerable<KeyValuePair<string, MapChunk.IClnbl>> src) => src?.ToDictionary(
                kvp => kvp.Key, kvp => kvp.Value?.ToMtbl());

        public static KeyValuePair<string, MapChunk.IClnbl> ToClnbl(
            this KeyValuePair<string, MapChunk.Immtbl> src) => src.ToKvp(
                clnbl => clnbl as MapChunk.IClnbl);

        public static KeyValuePair<string, MapChunk.IClnbl> ToClnbl(
            this KeyValuePair<string, MapChunk.Mtbl> src) => src.ToKvp(
                clnbl => clnbl as MapChunk.IClnbl);

        public static IEnumerable<KeyValuePair<string, MapChunk.IClnbl>> ToClnbl(
            this ReadOnlyDictionary<string, MapChunk.Immtbl> src) => src?.Select(
                kvp => kvp.ToClnbl());

        public static IEnumerable<KeyValuePair<string, MapChunk.IClnbl>> ToClnbl(
            this ReadOnlyDictionary<string, MapChunk.Mtbl> src) => src?.Select(
                kvp => kvp.ToClnbl());
    }
}

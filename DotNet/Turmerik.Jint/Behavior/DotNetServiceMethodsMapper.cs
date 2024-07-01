using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Jint.Behavior
{
    public interface IDotNetServiceMethodsMapper
    {
        Dictionary<string, Func<object[], object>> MapAndMergeAllDotNetServiceMethods(
            DotNetServiceMethodsMapperOpts[] optsArr,
            Dictionary<string, Func<object[], object>> existingMethodMaps = null,
            bool normalizeOpts = true);

        Dictionary<string, Func<object[], object>> MapDotNetServiceMethods<TService>(
            TService service,
            Type serviceType = null,
            string servicePrefix = null);

        Dictionary<string, Func<object[], object>> MapDotNetServiceMethods(
            DotNetServiceMethodsMapperOpts opts,
            bool normalizeOpts);

        Dictionary<string, Func<object[], object>> MapDotNetServiceMethods(
            DotNetServiceMethodsMapperOpts opts);

        DotNetServiceMethodsMapperOpts NormalizeOpts(
            DotNetServiceMethodsMapperOpts opts);
    }

    public class DotNetServiceMethodsMapper : IDotNetServiceMethodsMapper
    {
        private readonly IJsonConversion jsonConversion;

        public DotNetServiceMethodsMapper(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public Dictionary<string, Func<object[], object>> MapAndMergeAllDotNetServiceMethods(
            DotNetServiceMethodsMapperOpts[] optsArr,
            Dictionary<string, Func<object[], object>> existingMethodMaps = null,
            bool normalizeOpts = true)
        {
            existingMethodMaps ??= new();

            var methodMapsArr = optsArr.Select(
                opts => MapDotNetServiceMethods(opts, normalizeOpts)).ToArray();

            foreach (var methodMap in methodMapsArr)
            {
                existingMethodMaps.AddRange(methodMap);
            }

            return existingMethodMaps;
        }

        public Dictionary<string, Func<object[], object>> MapDotNetServiceMethods<TService>(
            TService service,
            Type serviceType = null,
            string servicePrefix = null) => MapDotNetServiceMethods(
                new DotNetServiceMethodsMapperOpts
                {
                    Service = service,
                    ServiceType = serviceType ?? typeof(TService),
                    ServicePrefix = servicePrefix
                }, true);

        public Dictionary<string, Func<object[], object>> MapDotNetServiceMethods(
            DotNetServiceMethodsMapperOpts opts) => MapDotNetServiceMethods(opts, true);

        public Dictionary<string, Func<object[], object>> MapDotNetServiceMethods(
            DotNetServiceMethodsMapperOpts opts,
            bool normalizeOpts)
        {
            opts = NormalizeOptsIfReq(opts, normalizeOpts);

            var methodsMap = opts.ServiceType.GetMethods().ToDictionary(
                method => string.Join(".", opts.ServicePrefix, method.Name),
                method =>
                {
                    var paramsArr = method.GetParameters();

                    Func<object[], object> retFunc = (argsArr) =>
                    {
                        argsArr = argsArr.Select((arg, idx) =>
                        {
                            if (arg != null)
                            {
                                var @param = paramsArr[idx];
                                var argType = arg.GetType();

                                if (argType != param.ParameterType)
                                {
                                    string serializedArg;

                                    if (argType == ReflH.StringType)
                                    {
                                        serializedArg = (string)arg;
                                    }
                                    else
                                    {
                                        serializedArg = jsonConversion.Adapter.Serialize(arg);
                                    }

                                    arg = jsonConversion.Adapter.Deserialize(
                                        serializedArg,
                                        false, true,
                                        param.ParameterType);
                                }
                            }

                            return arg!;
                        }).ToArray();

                        var retVal = method.Invoke(opts.Service, argsArr);
                        return retVal;
                    };

                    return retFunc;
                });

            return methodsMap;
        }

        public DotNetServiceMethodsMapperOpts NormalizeOpts(
            DotNetServiceMethodsMapperOpts opts)
        {
            opts = new(opts);

            opts.ServiceType ??= opts.Service.GetType();
            opts.ServicePrefix ??= opts.ServiceType.Name.ServiceTypeNameToCamelCase();

            return opts;
        }

        private DotNetServiceMethodsMapperOpts NormalizeOptsIfReq(
            DotNetServiceMethodsMapperOpts opts,
            bool normalizeOpts)
        {
            if (normalizeOpts)
            {
                opts = NormalizeOpts(opts);
            }

            return opts;
        }
    }
}

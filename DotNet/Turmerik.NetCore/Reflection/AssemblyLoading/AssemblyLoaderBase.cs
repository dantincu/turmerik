using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public abstract class AssemblyLoaderBase
    {
        public const string NET_STD_ASMB_NAME = "netstandard";
        public const string NET_STD_ASMB_FILE_NAME = "netstandard.dll";

        public readonly string coreLibLocation = typeof(object).Assembly.Location;
        public readonly string coreLibName = typeof(object).Assembly.GetName().Name;

        public readonly ReadOnlyDictionary<TypeItemKind, TypeTuplesAgg> PrimitiveTypeNamesMap;

        protected readonly IFilteredDriveEntriesRetriever FilteredDriveEntriesRetriever;

        public AssemblyLoaderBase(
            IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever)
        {
            FilteredDriveEntriesRetriever = filteredDriveEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredDriveEntriesRetriever));

            PrimitiveTypeNamesMap = new Dictionary<TypeItemKind, TypeTuplesAgg>
            {
                { TypeItemKind.String, new (ReflH.StringType.Arr()) },
                { TypeItemKind.Boolean, new (ReflH.BoolType.Arr()) },
                { TypeItemKind.Number, CommonTypes.Instn.Value.NumberTypes },
                { TypeItemKind.Date, NetCoreCommonTypes.Instn.Value.DateTypes },
                { TypeItemKind.OtherPrimitive, new ([]) },
            }.RdnlD();
        }

        public AssemblyLoaderConfig NormalizeConfig(
            AssemblyLoaderConfig cfg)
        {
            cfg = new AssemblyLoaderConfig
            {
                NetStandard2p1LibDirLocation = cfg.NetStandard2p1LibDirLocation,
                NetStandard2p1LibFileLocation = cfg.NetStandard2p1LibFileLocation,
                UseNetStandard2p1 = cfg.UseNetStandard2p1 ?? true
            };

            cfg.NetStandard2p1LibDirLocation ??= Path.GetDirectoryName(
                cfg.NetStandard2p1LibFileLocation ??= NET_STD_ASMB_FILE_NAME) ?? throw new ArgumentException(
                    nameof(cfg.NetStandard2p1LibDirLocation));

            cfg.NetStandard2p1LibFileLocation = NormPathH.AssurePathIsRooted(
                cfg.NetStandard2p1LibFileLocation,
                () => cfg.NetStandard2p1LibDirLocation);

            return cfg;
        }

        public async Task<AssemblyLoaderOpts> NormalizeOptsAsync(
            AssemblyLoaderOpts opts)
        {
            opts = new AssemblyLoaderOpts
            {
                Config = opts.Config.With(NormalizeConfig),
                AssemblyDirPaths = opts.AssemblyDirPaths,
                AllAssembliesFilePaths = opts.AllAssembliesFilePaths ?? await GetAllAssembliesFilePathsAsync(
                    opts.AssemblyDirPaths),
                AssembliesToLoad = opts.AssembliesToLoad,
                LoadAllTypes = opts.LoadAllTypes,
                LoadPubInstnGetProps = opts.LoadPubInstnGetProps,
                LoadPubInstnMethods = opts.LoadPubInstnMethods,
                TreatPrimitivesAsRegularObjects = opts.TreatPrimitivesAsRegularObjects,
                TypeCustomDataFactory = opts.TypeCustomDataFactory ?? (opts => null)
            };

            if (!opts.AllAssembliesFilePaths.Contains(coreLibLocation))
            {
                opts.AllAssembliesFilePaths.Add(coreLibLocation);
            }

            if (opts.Config.UseNetStandard2p1 == true)
            {
                opts.AllAssembliesFilePaths.AddRange(
                    await GetAllAssembliesFilePathsAsync(
                        [ opts.Config.NetStandard2p1LibDirLocation ]));
            }

            opts.AssembliesToLoad = opts.AssembliesToLoad.Select(
                asmb => new AssemblyLoaderOpts.AssemblyOpts
                {
                    IsExecutable = asmb.IsExecutable,
                    AssemblyName = asmb.AssemblyName,
                    AssemblyFilePath = asmb.AssemblyFilePath ?? opts.AllAssembliesFilePaths.First(
                        filePath => Path.GetFileName(filePath) == asmb.AssemblyName),
                    LoadAllTypes = asmb.LoadAllTypes ?? opts.LoadAllTypes,
                }.ActWith(asmb => asmb.TypesToLoad = asmb.TypesToLoad?.Select(
                    type =>
                    {
                        var retObj = new AssemblyLoaderOpts.TypeOpts
                        {
                            TypeName = type.TypeName,
                            FullTypeName = type.FullTypeName,
                            DeclaringTypeOpts = type.DeclaringTypeOpts,
                            GenericTypeParamsCount = type.GenericTypeParamsCount,
                        };

                        retObj.GenericTypeParamsCount ??= ((retObj.DeclaringTypeOpts != null) switch
                        {
                            true => retObj.TypeName,
                            false => retObj.FullTypeName,
                        }).Split('`').With(namePartsArr => namePartsArr.Length switch
                        {
                            2 => (int?)int.Parse(namePartsArr[1]),
                            _ => null
                        });

                        return retObj;
                    }).ToList()!)).ToList();

            return opts;
        }

        public async Task<List<string>> GetAllAssembliesFilePathsAsync(
            string[] assemblyDirPathsArr)
        {
            var allAssembliesFilePathsList = new List<string>();

            foreach (var assemblyDirPath in assemblyDirPathsArr)
            {
                var assembliesFilePathsList = (await FilteredDriveEntriesRetriever.FindMatchingAsync(
                    new FilteredDriveRetrieverMatcherOpts
                    {
                        PrFolderIdnf = assemblyDirPath,
                        FsEntriesSerializableFilter = new Core.FileSystem.DriveEntriesSerializableFilter
                        {
                            IncludedRelPathRegexes = ["\\/[^\\/]+\\.dll$"]
                        }
                    })).ExtractItems().GetAllIdnfsRecursively();

                allAssembliesFilePathsList.AddRange(
                    assembliesFilePathsList);
            }

            return allAssembliesFilePathsList;
        }

        public string GetAssemblyExtension(
            AssemblyLoaderOpts.AssemblyOpts asmbOpts) => asmbOpts.IsExecutable switch
            {
                true => "exe",
                _ => "dll"
            };

        public string GetAssemblyFileName(
            AssemblyLoaderOpts.AssemblyOpts asmbOpts) => string.Join(
                ".", asmbOpts.AssemblyName, GetAssemblyExtension(asmbOpts));

        public async Task<Dictionary<string, AssemblyItem>> LoadAssembliesAsync(
            AssemblyLoaderOpts opts)
        {
            opts = await NormalizeOptsAsync(opts);
            WorkArgs wka = null;

            var resolver = new PathAssemblyResolver(
                opts.AllAssembliesFilePaths);

            MetadataLoadContext context = null;
            bool keepContext = true;

            try
            {
                context = new MetadataLoadContext(
                    resolver, coreAssemblyName: coreLibName);

                wka ??= new WorkArgs(opts, context);

                foreach (var asmbToLoad in wka.Opts.AssembliesToLoad)
                {
                    LoadAssemblyItem(wka, asmbToLoad);
                }

                ForEachType(wka, (asmb, type) =>
                {
                    type.TrySetCustomData(opts);

                    type.GetAllTypeDependencies().ActWith(allDepTypes =>
                    {
                        foreach (var depType in allDepTypes)
                        {
                            depType.TrySetCustomData(opts);
                        }
                    });
                });
            }
            catch (Exception exc)
            {
                keepContext = false;
                context?.Dispose();
                throw;
            }

            if (!keepContext)
            {
                context?.Dispose();
            }

            return wka?.AsmbMap;
        }

        public AssemblyItem LoadAssemblyItem(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbToLoad)
        {
            var asmbItem = GetAssemblyItem(
                wka, asmbToLoad,
                asmbToLoad.AssemblyName);

            if (asmbToLoad.LoadAllTypes == true)
            {
                foreach (var type in asmbItem.BclItem.ExportedTypes)
                {
                    LoadType(wka, type);
                }
            }
            else
            {
                foreach (var typeOpts in asmbToLoad.TypesToLoad)
                {
                    LoadType(wka, asmbToLoad, typeOpts);
                }
            }

            return asmbItem;
        }

        public AssemblyItem GetAssemblyItem(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbToLoad,
            string? asmbName = null)
        {
            var asmbObj = wka.Context.LoadFromAssemblyPath(
                asmbToLoad.AssemblyFilePath);

            var retAsmb = GetAssemblyItem(
                wka, asmbObj, asmbName);

            return retAsmb;
        }

        public AssemblyItem GetAssemblyItem(
            WorkArgs wka,
            Assembly asmbObj,
            string? asmbName = null,
            string? asmbFilPath = null) => wka.AsmbMap.GetOrAdd(
                asmbName ??= asmbObj.GetName().Name,
                asmbName => GetAssemblyItemCore(
                    wka, asmbObj, asmbName, asmbFilPath));

        public AssemblyItem GetAssemblyItemCore(
            WorkArgs wka,
            Assembly asmbObj,
            string? asmbName = null,
            string? asmbFilPath = null)
        {
            asmbName ??= asmbObj.GetName().Name;
            asmbFilPath ??= asmbObj.Location;

            bool isCoreLib = asmbName == coreLibName;
            bool isNetStandardLib = asmbName == NET_STD_ASMB_NAME;
            bool isSysLib = isCoreLib || isNetStandardLib;
            string dfNamespace = isSysLib ? ReflH.BaseObjectType.Type.Namespace! : asmbName;

            var retAsmb = new AssemblyItem(asmbObj, asmbName)
            {
                DefaultNamespace = dfNamespace,
                TypeNamesPfx = $"{dfNamespace}.",
                AssemblyFilePath = asmbFilPath,
                IsExecutable = Path.GetExtension(
                    asmbFilPath).ToLower() != ".dll",
                IsCoreLib = isCoreLib,
                IsNetStandardLib = isNetStandardLib,
                IsSysLib = isSysLib,
                TypesMap = new()
            };

            return retAsmb;
        }

        protected abstract TypeItemCoreBase LoadType(
            WorkArgs wka,
            Type type);

        protected abstract TypeItemCoreBase LoadType(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts);

        protected void ForEachType(
            WorkArgs wka,
            Action<AssemblyItem, TypeItemBase> callback)
        {
            foreach (var asmbKvp in wka.AsmbMap)
            {
                foreach (var typeKvp in asmbKvp.Value.TypesMap)
                {
                    callback(asmbKvp.Value, typeKvp.Value);
                }
            }
        }

        protected int CompareMethods(
            MethodItem m1,
            MethodItem m2)
        {
            int result = m1.Name.CompareTo(m2.Name);

            if (result == 0)
            {
                result = CompareTypes(
                    m1.ReturnType.Value,
                    m2.ReturnType.Value);
            }

            if (result == 0)
            {
                result = CompareMethodParams(
                    m1.Params, m2.Params);
            }

            return result;
        }

        protected int CompareProps(
            PropertyItem p1,
            PropertyItem p2)
        {
            int result = p1.Name.CompareTo(p2.Name);

            if (result == 0)
            {
                result = CompareTypes(
                    p1.PropertyType.Value,
                    p2.PropertyType.Value);
            }

            return result;
        }

        protected int CompareMethodParams(
            IEnumerable<KeyValuePair<string, TypeItemCoreBase>> nmrbl1,
            IEnumerable<KeyValuePair<string, TypeItemCoreBase>> nmrbl2) => CompareMethodParamsCollctn(
                nmrbl1, nmrbl2, value => value);

        protected int CompareMethodParams(
            IEnumerable<KeyValuePair<string, Lazy<TypeItemCoreBase>>> nmrbl1,
            IEnumerable<KeyValuePair<string, Lazy<TypeItemCoreBase>>> nmrbl2) => CompareMethodParamsCollctn(
                nmrbl1, nmrbl2, lazy => lazy.Value);

        protected int CompareMethodParamsCollctn<TParam>(
            IEnumerable<KeyValuePair<string, TParam>> nmrbl1,
            IEnumerable<KeyValuePair<string, TParam>> nmrbl2,
            Func<TParam, TypeItemCoreBase> paramFactory) => nmrbl1.CompareNmrbls(
                nmrbl2, (kvp1, kvp2) => CompareMethodParams(
                    kvp1, kvp2,
                    paramFactory), out _);

        protected int CompareMethodParams(
            KeyValuePair<string, TypeItemCoreBase> kvp1,
            KeyValuePair<string, TypeItemCoreBase> kvp2) => CompareMethodParams(
                kvp1, kvp2, value => value);

        protected int CompareMethodParams(
            KeyValuePair<string, Lazy<TypeItemCoreBase>> kvp1,
            KeyValuePair<string, Lazy<TypeItemCoreBase>> kvp2) => CompareMethodParams(
                kvp1, kvp2, lazy => lazy.Value);

        protected int CompareMethodParams<TParam>(
            KeyValuePair<string, TParam> kvp1,
            KeyValuePair<string, TParam> kvp2,
            Func<TParam, TypeItemCoreBase> paramFactory)
        {
            int result = kvp1.Key.CompareTo(kvp2.Key);

            if (result == 0)
            {
                result = CompareTypes(
                    paramFactory(kvp1.Value),
                    paramFactory(kvp2.Value));
            }

            return result;
        }

        protected int CompareTypes(
            TypeItemCoreBase t1,
            TypeItemCoreBase t2) => t1.FullIdnfName?.CompareTo(
                t2.FullIdnfName) ?? (t2.FullIdnfName is null) switch
                {
                    true => 0,
                    false => -1
                };

        public class WorkArgs
        {
            public WorkArgs(
                AssemblyLoaderOpts opts,
                MetadataLoadContext context,
                Dictionary<string, AssemblyItem>? asmbMap = null,
                CommonTypeItem? rootObject = null,
                CommonTypeItem? rootValueType = null,
                CommonTypeItem? voidType = null,
                CommonTypeItem? delegateType = null,
                CommonTypeItem? multicastDelegateType = null)
            {
                Opts = opts;
                Context = context;
                AsmbMap = asmbMap ?? new();

                RootObject = rootObject ?? new CommonTypeItem(
                    ReflH.BaseObjectType.Type,
                    TypeItemKind.RootObject);

                RootValueType = rootValueType ?? new CommonTypeItem(
                    ReflH.BaseValueType.Type,
                    TypeItemKind.RootValueType);

                VoidType = voidType ?? new CommonTypeItem(
                    ReflH.VoidType.Type,
                    TypeItemKind.VoidType);

                DelegateType = delegateType ?? new CommonTypeItem(
                    NetCoreReflH.DelegateType.Type,
                    TypeItemKind.DelegateRoot);

                MulticastDelegateType = multicastDelegateType ?? new CommonTypeItem(
                    NetCoreReflH.MulticastDelegateType.Type,
                    TypeItemKind.DelegateRoot);
            }

            public AssemblyLoaderOpts Opts { get; init; }
            public MetadataLoadContext Context { get; init; }
            public Dictionary<string, AssemblyItem> AsmbMap { get; init; }
            public CommonTypeItem RootObject { get; init; }
            public CommonTypeItem RootValueType { get; init; }
            public CommonTypeItem VoidType { get; init; }
            public CommonTypeItem DelegateType { get; init; }
            public CommonTypeItem MulticastDelegateType { get; init; }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public abstract class AssemblyLoader
    {
        public const string NET_STD_ASMB_NAME = "netstandard";
        public const string NET_STD_ASMB_FILE_NAME = "netstandard.dll";

        private readonly string coreLibLocation = typeof(object).Assembly.Location;
        private readonly string coreLibName = typeof(object).Assembly.GetName().Name;

        private readonly IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever;

        public AssemblyLoader(
            IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever)
        {
            this.filteredDriveEntriesRetriever = filteredDriveEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredDriveEntriesRetriever));
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
                AssembliesBaseDirPath = opts.AssembliesBaseDirPath,
                AllAssembliesFilePaths = opts.AllAssembliesFilePaths ?? await GetAllAssembliesFilePathsAsync(
                    opts.AssembliesBaseDirPath),
                AssembliesToLoad = opts.AssembliesToLoad,
                LoadAllTypes = opts.LoadAllTypes,
                LoadPubInstnGetProps = opts.LoadPubInstnGetProps,
                LoadPubInstnMethods = opts.LoadPubInstnMethods,
                TreatPrimitivesAsRegularObjects = opts.TreatPrimitivesAsRegularObjects,
            };

            if (!opts.AllAssembliesFilePaths.Contains(coreLibLocation))
            {
                opts.AllAssembliesFilePaths.Add(coreLibLocation);
            }

            if (opts.Config.UseNetStandard2p1 == true)
            {
                opts.AllAssembliesFilePaths.AddRange(
                    await GetAllAssembliesFilePathsAsync(
                        opts.Config.NetStandard2p1LibDirLocation));
            }

            opts.AssembliesToLoad = opts.AssembliesToLoad.Select(
                asmb => new AssemblyLoaderOpts.AssemblyOpts
                {
                    IsExecutable = asmb.IsExecutable,
                    AssemblyName = asmb.AssemblyName,
                    AssemblyFilePath = asmb.AssemblyFilePath ?? GetAssemblyFilePath(
                        opts, asmb),
                    LoadAllTypes = asmb.LoadAllTypes ?? opts.LoadAllTypes,
                    LoadPubInstnGetProps = asmb.LoadPubInstnGetProps ?? opts.LoadPubInstnGetProps,
                    LoadPubInstnMethods = asmb.LoadPubInstnMethods ?? opts.LoadPubInstnMethods,
                }.ActWith(asmb => asmb.TypesToLoad = asmb.TypesToLoad?.Select(
                    type =>
                    {
                        var retObj = new AssemblyLoaderOpts.TypeOpts
                        {
                            TypeName = type.TypeName,
                            FullTypeName = type.FullTypeName,
                            DeclaringTypeOpts = type.DeclaringTypeOpts,
                            GenericTypeParamsCount = type.GenericTypeParamsCount,
                            LoadPubInstnGetProps = type.LoadPubInstnGetProps ?? asmb.LoadPubInstnGetProps,
                            LoadPubInstnMethods = type.LoadPubInstnMethods ?? asmb.LoadPubInstnMethods
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
            string assembliesBaseDirPath)
        {
            var allAssembliesFilePathsList = (await filteredDriveEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = assembliesBaseDirPath,
                    FsEntriesSerializableFilter = new Core.FileSystem.DriveEntriesSerializableFilter
                    {
                        IncludedRelPathRegexes = ["\\/[^\\/]+\\.dll$"]
                    }
                })).ExtractItems().GetAllIdnfsRecursively();

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

        public string GetAssemblyFilePath(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts) => Path.Combine(
                opts.AssembliesBaseDirPath,
                GetAssemblyFileName(asmbOpts));

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
                    (type as TypeItem)?.ActWith(typeItem =>
                    {
                        typeItem?.Data.AllTypeDependencies.Value.ActWith(allDepTypes =>
                        {
                            foreach (var depType in allDepTypes)
                            {
                                _ = depType.Value;
                            }
                        });
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
                asmbName, asmbName => GetAssemblyItemCore(
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
            string dfNamespace = isSysLib ? ReflH.BaseObjectType.Namespace! : asmbName;

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

        protected abstract TypeItemCore LoadType(
            WorkArgs wka,
            Type type);

        protected abstract TypeItemCore LoadType(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts);

        private void ForEachType(
            WorkArgs wka,
            Action<AssemblyItem, TypeItemCore> callback)
        {
            foreach (var asmbKvp in wka.AsmbMap)
            {
                foreach (var typeKvp in asmbKvp.Value.TypesMap)
                {
                    callback(asmbKvp.Value, typeKvp.Value);
                }
            }
        }

        public class WorkArgs
        {
            public WorkArgs(
                AssemblyLoaderOpts opts,
                MetadataLoadContext context,
                Dictionary<string, AssemblyItem>? asmbMap = null,
                Dictionary<string, TypeItemCore>? allTypesMap = null,
                TypeItemCore rootObject = null,
                TypeItemCore rootValueType = null)
            {
                Opts = opts;
                Context = context;
                AsmbMap = asmbMap ?? new();
                AllTypesMap = allTypesMap ?? new();

                RootObject = rootObject ?? new TypeItemCore
                {
                    Kind = TypeItemKind.RootObject
                };

                RootValueType = rootValueType ?? new TypeItemCore
                {
                    Kind = TypeItemKind.RootValueType
                };

                AllTypesMap.Add(typeof(object).FullName, RootObject);
                AllTypesMap.Add(typeof(ValueType).FullName, RootValueType);
            }

            public AssemblyLoaderOpts Opts { get; init; }
            public MetadataLoadContext Context { get; init; }
            public Dictionary<string, AssemblyItem> AsmbMap { get; init; }
            public Dictionary<string, TypeItemCore> AllTypesMap { get; init; }
            public TypeItemCore RootObject { get; init; }
            public TypeItemCore RootValueType { get; init; }
        }

        public class TypeIdnfParts
        {
            public string IdnfName { get; init; }
            public int LastDotIdx { get; init; }
            public string ShortName { get; init; }
        }
    }
}

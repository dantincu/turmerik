﻿using System;
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
                    _ = type.GetIdnf().Value;
                    var data = type.GetData().Value;

                    type.GetAllTypeDependencies().Value.ActWith(allDepTypes =>
                    {
                        foreach (var depType in allDepTypes)
                        {
                            _ = depType.Value;
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

            if (isSysLib)
            {
                retAsmb.TypesMap.Add(
                    wka.RootObject.IdnfName,
                    wka.RootObject);

                retAsmb.TypesMap.Add(
                    wka.RootValueType.IdnfName,
                    wka.RootValueType);

                retAsmb.TypesMap.Add(
                    wka.VoidType.IdnfName,
                    wka.VoidType);

                retAsmb.TypesMap.Add(
                    wka.DelegateType.IdnfName,
                    wka.DelegateType);
            }

            return retAsmb;
        }

        protected abstract TypeItemCoreBase LoadType(
            WorkArgs wka,
            Type type);

        protected abstract TypeItemCoreBase LoadType(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts);

        private void ForEachType(
            WorkArgs wka,
            Action<AssemblyItem, TypeItemCoreBase> callback)
        {
            foreach (var asmbKvp in wka.AsmbMap.ToList())
            {
                foreach (var typeKvp in asmbKvp.Value.TypesMap.ToList())
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
                    TypeItemKind.RootObject,
                    ReflH.BaseObjectType.Type.Name,
                    ReflH.BaseObjectType.FullName);

                RootValueType = rootValueType ?? new CommonTypeItem(
                    TypeItemKind.RootValueType,
                    ReflH.BaseValueType.Type.Name,
                    ReflH.BaseValueType.FullName!);

                VoidType = voidType ?? new CommonTypeItem(
                    TypeItemKind.VoidType,
                    ReflH.VoidType.Type.Name,
                    ReflH.GetTypeShortDisplayName(
                        ReflH.VoidType.FullName));

                DelegateType = delegateType ?? new CommonTypeItem(
                    TypeItemKind.DelegateRoot,
                    NetCoreReflH.DelegateType.Type.Name,
                    NetCoreReflH.DelegateType.FullName!);

                MulticastDelegateType = multicastDelegateType ?? new CommonTypeItem(
                    TypeItemKind.DelegateRoot,
                    NetCoreReflH.MulticastDelegateType.Type.Name,
                    NetCoreReflH.MulticastDelegateType.FullName!);
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

        public class TypeIdnfParts
        {
            public string IdnfName { get; init; }
            public int LastDotIdx { get; init; }
            public string ShortName { get; init; }
        }
    }
}

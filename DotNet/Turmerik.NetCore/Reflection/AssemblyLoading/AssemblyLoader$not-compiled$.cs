using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing.Text;
using System.Linq;
using System.Linq.Expressions;
using System.Numerics;
using System.Reflection;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public class AssemblyLoader
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
                    type.AllGenericTypeArguments?.Value.ActWith(allDepTypes =>
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
                TypesMap = new ()
            };

            return retAsmb;
        }

        public Type GetTypeToLoad(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts)
        {
            Type typeToLoad;
            AssemblyItem asmbItem;

            Func<Type, bool> genericTypePredicate = type => type.IsGenericType && type.GetGenericArguments(
                ).Length == typeOpts.GenericTypeParamsCount.Value;

            if (typeOpts.DeclaringTypeOpts != null)
            {
                var declaringTypeItem = LoadType(
                    wka, asmbOpts, typeOpts.DeclaringTypeOpts);

                asmbItem = declaringTypeItem.Idnf!.AssemblyItem;

                if (typeOpts.GenericTypeParamsCount.HasValue)
                {
                    typeToLoad = declaringTypeItem.Idnf!.BclItem.GetNestedTypes().First(
                        type => genericTypePredicate(type) && type.Name == typeOpts.TypeName);
                }
                else
                {
                    typeToLoad = declaringTypeItem.Idnf!.BclItem.GetNestedType(
                        typeOpts.TypeName) ?? throw new InvalidOperationException(
                            $"Type {declaringTypeItem.Idnf!.BclItem} does not have a nested type with name {typeOpts.TypeName}");
                }
            }
            else
            {
                asmbItem = GetAssemblyItem(wka, asmbOpts);

                if (typeOpts.GenericTypeParamsCount.HasValue)
                {
                    (var typeName, var @namespace) = typeOpts.FullTypeName.Split('.').ToList().With(
                        fullNamePartsList =>
                        {
                            var retName = fullNamePartsList.Last();

                            fullNamePartsList.RemoveAt(
                                fullNamePartsList.Count - 1);

                            return Tuple.Create(
                                retName,
                                string.Join(".", fullNamePartsList));
                        });

                    typeToLoad = asmbItem.BclItem.ExportedTypes.First(
                        type => genericTypePredicate(type) && (
                            type.Namespace == @namespace && type.Name == typeName));
                }
                else
                {
                    typeToLoad = asmbItem.BclItem.GetType(
                        typeOpts.FullTypeName);
                }
            }

            return typeToLoad;
        }

        public EnumTypeItem LoadType(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts)
        {
            var typeToLoad = GetTypeToLoad(wka, asmbOpts, typeOpts);
            var retType = LoadType(wka, typeToLoad);

            return retType;
        }

        public EnumTypeItem LoadType(
            WorkArgs wka,
            Type type)
        {
            TypeIdnfParts typeIdnfParts = null;
            EnumTypeItem? declaringType = null;
            EnumTypeItem retItem = null;

            if (wka.Opts.TreatPrimitivesAsRegularObjects != true)
            {
                if (type.IsArray)
                {
                    var genericTypeArgs = new Lazy<EnumTypeItem>(
                        () => LoadType(wka, type.GetElementType()!)).Arr().RdnlC();

                    retItem = new EnumTypeItem
                    {
                        Kind = TypeItemKind.Array,
                        GenericTypeArguments = genericTypeArgs,
                        AllGenericTypeArguments = new Lazy<ReadOnlyCollection<Lazy<EnumTypeItem>>>(
                            () => genericTypeArgs)
                    };
                }
                else if (type.IsEnum)
                {
                    var asmbObj = GetAssemblyItem(
                        wka, type.Assembly);

                    typeIdnfParts = GetTypeIdnfParts(type.FullName);

                    retItem = new EnumTypeItem
                    {
                        Kind = TypeItemKind.Enum,
                        Idnf = new TypeIdnf(type,
                            typeIdnfParts.IdnfName,
                            asmbObj,
                            typeIdnfParts.ShortName)
                    };
                }
            }

            if (retItem == null)
            {
                string idnfName;

                if (type.IsNested)
                {
                    declaringType = LoadType(
                        wka, type.DeclaringType);

                    idnfName = string.Join(".",
                        declaringType.Idnf!.IdnfName,
                        type.Name);
                }
                else
                {
                    idnfName = string.Join(".",
                        type.Namespace,
                        type.Name);
                }

                typeIdnfParts = GetTypeIdnfParts(idnfName);

                Action genericTypeAction = () =>
                {
                    var genericTypeDefItem = wka.AllTypesMap.GetOrAdd(
                        idnfName, name => LoadTypeTuple(
                            wka, type.GetGenericTypeDefinition(),
                            declaringType.GenericTypeDefinition,
                            idnfName).Type);

                    genericTypeDefItem.AssemblyItem.TypesMap[idnfName] = genericTypeDefItem;

                    retItem = LoadTypeCore(wka, type,
                        declaringType, idnfName,
                        genericTypeDefItem);
                };

                Action defaultAction = () =>
                {
                    var tuple = LoadTypeTuple(wka, type,
                        declaringType, idnfName);

                    retItem = wka.AllTypesMap.GetOrAdd(
                        idnfName, name => tuple.Type);

                    retItem.AssemblyItem.TypesMap[idnfName] = retItem;
                };

                if (type.IsGenericType)
                {
                    if (type.IsGenericTypeDefinition)
                    {
                        defaultAction();
                    }
                    else
                    {
                        genericTypeAction();
                    }
                }
                else
                {
                    defaultAction();
                }
            }

            return retItem;
        }

        public EnumTypeItem LoadTypeCore(
            WorkArgs wka,
            Type type,
            EnumTypeItem? declaringTypeItem,
            TypeIdnfParts typeIdnfParts,
            EnumTypeItem? genericTypeDefItem)
        {
            EnumTypeItem typeItem = null;

            var asmbObj = GetAssemblyItem(
                wka, type.Assembly);

            int typeNamesPfxLen = asmbObj.TypeNamesPfx.Length;

            bool nsStartsWithAsmbPfx = typeIdnfParts.IdnfName.StartsWith(
                asmbObj.TypeNamesPfx);

            string relNsStr = nsStartsWithAsmbPfx switch
            {
                true => typeIdnfParts.IdnfName.Substring(
                    typeNamesPfxLen,
                    typeIdnfParts.LastDotIdx - typeNamesPfxLen),
                false => typeIdnfParts.IdnfName.Substring(
                    0, typeIdnfParts.LastDotIdx)
            };

            string[] relNsPartsArr = relNsStr.Split('.');
            bool isNullableType = typeIdnfParts.IdnfName == ReflH.NullableGenericTypeName;
            bool isArrayType = type.IsArray;
            bool isEnumType = type.IsEnum;

            var nullableEnclosedValueType = isNullableType switch
            {
                true => new Lazy<EnumTypeItem>(() => typeItem.GenericTypeArguments.Single().Value)
            };

            var arrayElementType = isArrayType switch
            {
                true => new Lazy<EnumTypeItem>(() => LoadType(wka, type.GetElementType()))
            };

            var enumDefinedMembers = isEnumType switch
            {
                true => Enum.GetValues(type).ToArray().ToDictionary(
                    value => Enum.GetName(type, value)!,
                    value => value).RdnlD()
            };

            Func<Func<EnumTypeItem, ReadOnlyCollection<Lazy<EnumTypeItem>>>, Func<EnumTypeItem, ReadOnlyCollection<Lazy<EnumTypeItem>>?>, ReadOnlyCollection<Lazy<EnumTypeItem>>> typesCollectionFactory;

            typesCollectionFactory = (allItemsPropValFactory, itemsPropValFactory) => 
            {
                Func<EnumTypeItem, ReadOnlyCollection<Lazy<EnumTypeItem>>> normItemsPropValFactory;

                normItemsPropValFactory = item => itemsPropValFactory(
                    item) ?? new Lazy<EnumTypeItem>[0].RdnlC();

                ReadOnlyCollection<Lazy<EnumTypeItem >> retLazy;

                if (typeItem!.DeclaringType != null)
                {
                    retLazy = allItemsPropValFactory(
                        typeItem.DeclaringType).Concat(
                            normItemsPropValFactory(typeItem)).RdnlC();
                }
                else
                {
                    retLazy = normItemsPropValFactory(typeItem);
                }

                return retLazy;
            };

            typeItem = new TypeItem(
                type,
                typeIdnfParts,
                asmbObj,
                typeIdnfParts.ShortName)
            {
                Namespace = type.Namespace,
                NsStartsWithAsmbPfx = nsStartsWithAsmbPfx,
                RelNsParts = relNsPartsArr.RdnlC(),
                IsEnumType = isEnumType,
                IsNestedType = type.IsNested,
                IsValueType = type.IsValueType,
                IsNullableType = isNullableType,
                IsArrayType = type.IsArray,
                IsGenericParameter = type.IsGenericParameter,
                IsGenericTypeParameter = type.IsGenericTypeParameter,
                IsGenericMethodParameter = type.IsGenericMethodParameter,
                IsConstructedGenericType = type.IsConstructedGenericType,
                IsGenericType = type.IsGenericType,
                IsGenericTypeDefinition = type.IsGenericTypeDefinition,
                ContainsGenericParameters = type.ContainsGenericParameters,
                DeclaringType = declaringTypeItem,
                EnumDefinedMembers = enumDefinedMembers,
                BaseType = type.BaseType?.With(
                    baseType => new Lazy<EnumTypeItem>(
                        () => LoadType(wka, baseType))),
                ArrayElementType = arrayElementType,
                NullableEnclosedValueType = nullableEnclosedValueType,
                InterfaceTypes = type.GetInterfaces().ToList(
                    ).ActWith(ReflH.ReduceInterfaces).Select(
                        intf => new Lazy<EnumTypeItem>(
                            LoadType(wka, intf))).ToList().RdnlC(),
                GenericTypeDefinition = genericTypeDefItem,
                GenericTypeArguments = typeItem.IsGenericType switch
                {
                    true => type.GetGenericArguments().Select(
                        typeArg => new Lazy<EnumTypeItem>(LoadType(wka, typeArg))).RdnlC()
                },
                GenericTypeParameters = typeItem.IsGenericType switch
                {
                    true => type.GetGenericParameterConstraints().Select(
                        typeArg => new Lazy<EnumTypeItem>(LoadType(wka, typeArg))).RdnlC()
                },
                AllGenericTypeArguments = typesCollectionFactory(
                    item => item.AllGenericTypeArguments,
                    item => item.GenericTypeArguments),
                AllGenericTypeParameters = typesCollectionFactory(
                    item => item.AllGenericTypeParameters,
                    item => item.GenericTypeParameters),
                PubInstnProps = wka.Opts.LoadPubInstnGetProps switch
                {
                    true => type.GetProperties().Where(
                        prop => prop.GetIndexParameters().None() && (prop.GetGetMethod()?.With(
                            getter => !getter.IsStatic && getter.IsPublic && prop.DeclaringType == type) ?? false)).Select(
                                prop => new PropertyItem(prop, prop.Name)
                                {
                                    CanRead = prop.CanRead,
                                    CanWrite = prop.CanWrite,
                                    IsStatic = false,
                                    PropertyType = new Lazy<EnumTypeItem>(
                                        () => LoadType(wka, prop.PropertyType))
                                }).RdnlC()
                },
                PubInstnMethods = wka.Opts.LoadPubInstnMethods switch
                {
                    true => type.GetMethods().Where(
                        method => method.IsPublic && method.DeclaringType == type && !method.IsSpecialName).Select(
                            method => new MethodItem(method, method.Name)
                            {
                                IsStatic = false,
                                IsVoidMethod = method.ReturnType.FullName?.TrimEnd('*', '&') == ReflH.VoidType.FullName,
                                Parameters = method.GetParameters().OrderBy(param => param.Position).ToDictionary(
                                    param => param.Name!, param => new Lazy<EnumTypeItem>(
                                        LoadType(wka, param.ParameterType))).RdnlD(),
                                ReturnType = new Lazy<EnumTypeItem>(() => LoadType(wka, method.ReturnType))
                            }).RdnlC()
                },
                AllTypeDependencies = new Lazy<ReadOnlyCollection<Lazy<EnumTypeItem>>>(
                    () => )
            };

            return typeItem;
        }

        public TypeItemsTuple LoadTypeTuple(
            WorkArgs wka,
            Type type,
            EnumTypeItem? declaringTypeItem,
            string idnfName)
        {
            Type typeToLoad = type;
            EnumTypeItem genericTypeDefItem = null;

            if (typeToLoad.IsGenericType && !typeToLoad.IsGenericTypeDefinition)
            {
                typeToLoad = typeToLoad.GetGenericTypeDefinition();

                genericTypeDefItem = LoadTypeCore(
                    wka, typeToLoad,
                    declaringTypeItem?.GenericTypeDefinition ?? declaringTypeItem,
                    idnfName,
                    null);
            }

            var typeItem = LoadTypeCore(
                wka, type, declaringTypeItem,
                idnfName, genericTypeDefItem);

            return new TypeItemsTuple(
                typeItem, genericTypeDefItem);
        }

        private void ForEachType(
            WorkArgs wka,
            Action<AssemblyItem, EnumTypeItem> callback)
        {
            foreach (var asmbKvp in wka.AsmbMap)
            {
                foreach (var typeKvp in asmbKvp.Value.TypesMap)
                {
                    callback(asmbKvp.Value, typeKvp.Value);
                }
            }
        }

        private TypeIdnfParts GetTypeIdnfParts(
            string idnfName)
        {
            int lastDotIdx = idnfName.LastIndexOf('.');

            string shortName = idnfName.Substring(
                lastDotIdx).Split('`')[0];

            var retObj = new TypeIdnfParts
            {
                IdnfName = idnfName,
                LastDotIdx = lastDotIdx,
                ShortName = shortName,
            };

            return retObj;
        }

        public class WorkArgs
        {
            public WorkArgs(
                AssemblyLoaderOpts opts,
                MetadataLoadContext context,
                Dictionary<string, AssemblyItem>? asmbMap = null,
                Dictionary<string, EnumTypeItem>? allTypesMap = null,
                EnumTypeItem rootObject = null,
                EnumTypeItem rootValueType = null)
            {
                Opts = opts;
                Context = context;
                AsmbMap = asmbMap ?? new ();
                AllTypesMap = allTypesMap ?? new();

                RootObject = rootObject ?? new EnumTypeItem
                {
                    Kind = TypeItemKind.RootObject
                };

                RootValueType = rootValueType ?? new EnumTypeItem
                {
                    Kind = TypeItemKind.RootValueType
                };

                AllTypesMap.Add(typeof(object).FullName, RootObject);
                AllTypesMap.Add(typeof(ValueType).FullName, RootValueType);
            }

            public AssemblyLoaderOpts Opts { get; init; }
            public MetadataLoadContext Context { get; init; }
            public Dictionary<string, AssemblyItem> AsmbMap { get; init; }
            public Dictionary<string, EnumTypeItem> AllTypesMap { get; init; }
            public EnumTypeItem RootObject { get; init; }
            public EnumTypeItem RootValueType { get; init; }
        }

        public class TypeIdnfParts
        {
            public string IdnfName { get; init; }
            public int LastDotIdx { get; init; }
            public string ShortName { get; init; }
        }
    }
}

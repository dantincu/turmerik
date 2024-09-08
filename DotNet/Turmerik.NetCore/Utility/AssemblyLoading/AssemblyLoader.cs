using Jint.Runtime.Interop;
using Microsoft.PowerShell.Commands;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Reflection.Metadata;
using System.Reflection.Metadata.Ecma335;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;
using static Turmerik.NetCore.Utility.AssemblyLoading.AssemblyLoaderOpts;

namespace Turmerik.NetCore.Utility.AssemblyLoading
{
    public interface IAssemblyLoader : IComponentCore
    {
        AssemblyLoaderConfig NormalizeConfig(
            AssemblyLoaderConfig config);

        Task<AssemblyLoaderOpts> NormalizeOptsAsync(
            AssemblyLoaderOpts opts);

        Task<List<string>> GetAllAssembliesFilePathsAsync(
            string assembliesBaseDirPath);

        Task<AssemblyLoader.WorkArgs> LoadAssembliesAsync(
            AssemblyLoaderOpts opts);

        DotNetAssembly ConvertAssembly(
            AssemblyLoader.WorkArgs wka);

        DotNetAssemblyName ConvertAssemblyName(
            AssemblyName asmbObjName);

        DotNetAssemblyVersion ConvertAssemblyVersion(
            Version asmbObjVersion);

        DotNetType ConvertAssemblyType(
            AssemblyLoader.WorkArgs wka,
            Type typeObj);

        DotNetType ConvertAssemblyType(
            AssemblyLoader.WorkArgs wka,
            TypeOpts typeOpts);

        DotNetProperty ConvertDotNetProperty(
            AssemblyLoader.WorkArgs wka,
            PropertyInfo propInfo);

        DotNetMethod ConvertDotNetMethod(
            AssemblyLoader.WorkArgs wka,
            MethodInfo methodInfo);

        DotNetConstructor ConvertDotNetConstructor(
            AssemblyLoader.WorkArgs wka,
            ConstructorInfo constructorInfo);

        DotNetMethodParameter ConvertDotNetParameter(
            AssemblyLoader.WorkArgs wka,
            ParameterInfo paramInfo);

        GenericTypeArg ConvertGenericTypeArg(
            AssemblyLoader.WorkArgs wka,
            Type genericTypeArg);

        Type GetTypeObj(
            AssemblyLoader.WorkArgs wka,
            TypeOpts typeOpts);

        TypeOpts GetTypeOpts(
            AssemblyLoader.WorkArgs wka,
            Type typeObj);

        string GetAssemblyExtension(
            AssemblyOpts asmbOpts);

        string GetAssemblyFileName(
            AssemblyOpts asmbOpts);

        string GetAssemblyFilePath(
            AssemblyLoaderOpts opts,
            AssemblyOpts asmbOpts);

        DotNetType FindMatching(
            AssemblyLoader.WorkArgs wka,
            Type typeObj,
            IEnumerable<DotNetType> typesNmrbl);

        bool GenericArgsAreEqual(
            GenericTypeArg trgArg,
            GenericTypeArg refArg);

        bool TypesAreEqual(
            DotNetType trgType,
            DotNetType refType);

        bool AssembliesAreEqual(
            Assembly trgAsmb,
            Assembly refAsmb);
    }

    public class AssemblyLoader : ComponentCoreBase, IAssemblyLoader
    {
        public const string NET_STD_ASMB_NAME = "netstandard";
        public const string NET_STD_ASMB_FILE_NAME = "netstandard.dll";

        private readonly string coreLibLocation = typeof(object).Assembly.Location;
        private readonly string coreLibName = typeof(object).Assembly.GetName().Name;

        private readonly IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever;

        public AssemblyLoader(
            IObjectMapperFactory objMapperFactory,
            IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever) : base(objMapperFactory)
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
                LoadPubGetProps = opts.LoadPubGetProps,
                LoadPubInstnGetProps = opts.LoadPubInstnGetProps,
                LoadPubMethods = opts.LoadPubMethods,
                LoadPubInstnMethods = opts.LoadPubInstnMethods,
                AssembliesCallback = opts.AssembliesCallback
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
                asmb => new AssemblyOpts
                {
                    IsExecutable = asmb.IsExecutable,
                    AssemblyName = asmb.AssemblyName,
                    AssemblyFilePath = asmb.AssemblyFilePath ?? GetAssemblyFilePath(
                        opts, asmb),
                    LoadAllTypes = asmb.LoadAllTypes ?? opts.LoadAllTypes,
                    LoadPubGetProps = asmb.LoadPubGetProps ?? opts.LoadPubGetProps,
                    LoadPubInstnGetProps = asmb.LoadPubInstnGetProps ?? opts.LoadPubInstnGetProps,
                    LoadPubMethods = asmb.LoadPubMethods ?? opts.LoadPubMethods,
                    LoadPubInstnMethods = asmb.LoadPubInstnMethods ?? opts.LoadPubInstnMethods,
                    TypesToLoad = asmb.TypesToLoad?.Select(
                        type => new TypeOpts
                        {
                            TypeName = type.TypeName,
                            FullTypeName = type.FullTypeName,
                            DeclaringTypeOpts = type.DeclaringTypeOpts,
                            GenericTypeParamsCount = type.GenericTypeParamsCount,
                            LoadPubInstnConstructors = type.LoadPubInstnConstructors,
                            LoadAllPubGetProps = type.LoadAllPubGetProps ?? asmb.LoadPubGetProps,
                            LoadPubInstnGetProps = type.LoadPubInstnGetProps ?? asmb.LoadPubInstnGetProps,
                            LoadAllPubMethods = type.LoadAllPubMethods ?? asmb.LoadPubMethods,
                            LoadPubInstnMethods = type.LoadPubInstnMethods ?? asmb.LoadPubInstnMethods,
                        }).ToList()!,
                }).ToList();

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

        public async Task<WorkArgs> LoadAssembliesAsync(
            AssemblyLoaderOpts opts)
        {
            opts = await NormalizeOptsAsync(opts);

            var wka = new WorkArgs
            {
                Opts = opts,
            };

            var resolver = new PathAssemblyResolver(
                opts.AllAssembliesFilePaths);

            MetadataLoadContext context = null;
            bool keepContext = true;

            try
            {
                context = new MetadataLoadContext(
                    resolver, coreAssemblyName: coreLibName);

                var retAssembliesList = opts.AssembliesToLoad.Select(
                    asmb =>
                    {
                        var asmbObj = context.LoadFromAssemblyPath(
                            asmb.AssemblyFilePath);

                        var dotNetAsmb = ConvertAssembly(new WorkArgs(wka)
                        {
                            AsmbOpts = asmb,
                            AsmbObj = asmbObj,
                            AsmbTypes = asmbObj.GetTypes().ToList()
                        });

                        return dotNetAsmb;
                    }).ToList();

                wka = MapprFactry.MapObj(
                    wka, () => new (wka), (src, cnXpr, mppr) => mppr.OptsFm(
                        src, cnXpr, mppr.OptsTp(() => () => new()
                        {
                            Opts = wka.Opts,
                            AsmbOpts = null,
                            AsmbObj = null,
                        }, true),
                        mppr.OptsTp(() => () => new()
                        {
                            PathAssemblyResolver = resolver,
                            MetadataLoadContext = context
                        }, keepContext = opts.AssembliesCallback?.Invoke(wka) ?? false)));
            }
            catch(Exception exc)
            {
                keepContext = false;
                context?.Dispose();
                throw;
            }

            if (!keepContext)
            {
                context?.Dispose();
            }

            return wka;
        }

        public DotNetAssembly ConvertAssembly(
            WorkArgs wka)
        {
            string assemblyFilePath = wka.AsmbObj.Location;
            string fullName = wka.AsmbObj.GetName().Name;

            bool isCoreLib = fullName == coreLibName;
            bool isNetStandardLib = fullName == NET_STD_ASMB_NAME;

            bool isSysLib = isCoreLib || isNetStandardLib;

            var assembliesList = wka.LoadedAssemblies;

            var asmb = assembliesList.FirstOrDefault(
                asmbInstn => asmbInstn.BclItem == wka.AsmbObj);

            if (asmb == null)
            {
                asmb = new DotNetAssembly(wka.AsmbObj)
                {
                    BclAsmbName = ConvertAssemblyName(
                        wka.AsmbObj.GetName()),
                    Name = fullName,
                    TypeNamesPfx = isSysLib ? ReflH.BaseObjectType.Namespace! : $"{fullName}.",
                    AssemblyFilePath = assemblyFilePath,
                    IsExecutable = Path.GetExtension(
                        assemblyFilePath).ToLower() != ".dll",
                    TypesList = [],
                    IsCoreLib = isCoreLib,
                    IsNetStandardLib = isNetStandardLib,
                    IsSysLib = isSysLib
                };

                assembliesList.Add(asmb);

                asmb.ReferencedBclAsmbNames = wka.AsmbObj.GetReferencedAssemblies(
                    ).Select(ConvertAssemblyName).ToList();

                if (wka.AsmbOpts.LoadAllTypes == true)
                {
                    wka.AsmbObj.GetExportedTypes(
                        ).Select(typeObj => ConvertAssemblyType(wka, typeObj)).ToList();
                }
                else
                {
                    wka.AsmbOpts.TypesToLoad?.Select(
                        typeOpts => ConvertAssemblyType(wka, typeOpts)).ToList();
                }
            }

            return asmb;
        }

        public DotNetAssemblyName ConvertAssemblyName(
            AssemblyName asmbObjName)
        {
            var asmbVersion = asmbObjName.Version;

            var retObj = new DotNetAssemblyName(
                asmbObjName)
            {
                Name = asmbObjName.Name,
                BclVersion = ConvertAssemblyVersion(asmbVersion),
                CultureInfo = asmbObjName.CultureInfo,
                CultureName = asmbObjName.CultureName,
                ContentType = asmbObjName.ContentType,
            };

            return retObj;
        }

        public DotNetAssemblyVersion ConvertAssemblyVersion(
            Version asmbObjVersion) => new DotNetAssemblyVersion(
                asmbObjVersion)
            {
                Major = asmbObjVersion.Major,
                Minor = asmbObjVersion.Minor,
                Build = asmbObjVersion.Build,
                Revision = asmbObjVersion.Revision,
                MajorRevision = asmbObjVersion.MajorRevision,
                MinorRevision = asmbObjVersion.MinorRevision,
            };

        public DotNetType ConvertAssemblyType(
            WorkArgs wka,
            Type typeObj) => ConvertAssemblyType(
                wka, typeObj, null);

        public DotNetType ConvertAssemblyType(
            WorkArgs wka,
            TypeOpts typeOpts) => ConvertAssemblyType(
                wka, null, typeOpts);

        public DotNetProperty ConvertDotNetProperty(
            WorkArgs wka,
            PropertyInfo propInfo)
        {
            var dotNetProp = new DotNetProperty(propInfo)
            {
                Name = propInfo.Name,
                CanRead = propInfo.CanRead,
                CanWrite = propInfo.CanWrite,
                IsStatic = (propInfo.GetGetMethod() ?? propInfo.GetSetMethod()).IsStatic,
                PropType = ConvertAssemblyType(wka, propInfo.PropertyType),
            };

            return dotNetProp;
        }

        public DotNetMethod ConvertDotNetMethod(
            WorkArgs wka,
            MethodInfo methodInfo)
        {
            var returnType = methodInfo.ReturnType;
            var isVoidMethod = returnType.FullName?.TrimEnd('*') == ReflH.VoidType.FullName;

            var dotNetMethod = new DotNetMethod(methodInfo)
            {
                Name = methodInfo.Name,
                IsVoidMethod = isVoidMethod,
                ReturnType = isVoidMethod ? null : ConvertAssemblyType(wka, returnType),
                IsStatic = methodInfo.IsStatic,
                Parameters = methodInfo.GetParameters().Select(
                    @param => ConvertDotNetParameter(wka, param)).ToList(),
            };

            return dotNetMethod;
        }

        public DotNetConstructor ConvertDotNetConstructor(
            WorkArgs wka,
            ConstructorInfo constructorInfo)
        {
            var dotNetConstructor = new DotNetConstructor(constructorInfo)
            {
                Name = constructorInfo.Name,
                IsStatic = constructorInfo.IsStatic,
                Parameters = constructorInfo.GetParameters().Select(
                    @param => ConvertDotNetParameter(wka, param)).ToList(),
            };

            return dotNetConstructor;
        }

        public DotNetMethodParameter ConvertDotNetParameter(
            WorkArgs wka,
            ParameterInfo paramInfo)
        {
            var dotNetMethodParameter = new DotNetMethodParameter(paramInfo)
            {
                Name = paramInfo.Name,
                Position = paramInfo.Position,
                ParamType = ConvertAssemblyType(wka, paramInfo.ParameterType)
            };

            return dotNetMethodParameter;
        }

        public GenericTypeArg ConvertGenericTypeArg(
            WorkArgs wka,
            Type genericTypeArg)
        {
            var genericTypeArgObj = new GenericTypeArg
            {
                TypeArg = ConvertAssemblyType(
                    wka, genericTypeArg),
                TypeParamConstraints = genericTypeArg.IsGenericTypeParameter ? genericTypeArg.GetGenericParameterConstraints(
                    ).Select(param => ConvertAssemblyType(wka, param)).ToList() : null
            };

            return genericTypeArgObj;
        }

        public Type GetTypeObj(
            WorkArgs wka,
            TypeOpts? typeOpts)
        {
            Type typeObj = GetTypeObjCore(
                wka, typeOpts, typeOpts.DeclaringTypeOpts?.With(
                    declaringTypeOpts => GetTypeObj(
                        wka, declaringTypeOpts)));

            return typeObj;
        }

        public TypeOpts GetTypeOpts(
            WorkArgs wka,
            Type typeObj) => new TypeOpts
            {
                FullTypeName = typeObj.GetTypeFullDisplayName(),
                LoadAllPubGetProps = wka.AsmbOpts.LoadPubGetProps,
                LoadPubInstnGetProps = wka.AsmbOpts.LoadPubInstnGetProps,
                LoadAllPubMethods = wka.AsmbOpts.LoadPubMethods,
                LoadPubInstnMethods = wka.AsmbOpts.LoadPubInstnMethods,
            };

        public string GetAssemblyExtension(
            AssemblyOpts asmbOpts) => asmbOpts.IsExecutable switch
            {
                true => "exe",
                _ => "dll"
            };

        public string GetAssemblyFileName(
            AssemblyOpts asmbOpts) => string.Join(
                ".", asmbOpts.AssemblyName, GetAssemblyExtension(asmbOpts));

        public string GetAssemblyFilePath(
            AssemblyLoaderOpts opts,
            AssemblyOpts asmbOpts) => Path.Combine(
                opts.AssembliesBaseDirPath,
                GetAssemblyFileName(asmbOpts));

        public DotNetType FindMatching(
            WorkArgs wka,
            Type typeObj,
            IEnumerable<DotNetType> typesNmrbl)
        {
            DotNetType? matchingType = null;

            if (typeObj.FullName == null)
            {
                matchingType = typesNmrbl.FirstOrDefault(
                    type => type.MetadataToken == typeObj.MetadataToken && type.BclItem?.Module == typeObj.Module);
            }
            else
            {
                matchingType = typesNmrbl.FirstOrDefault(
                    type => type.BclItem == typeObj);
            }

            return matchingType;
        }

        public bool AssembliesAreEqual(
            Assembly trgAsmb,
            Assembly refAsmb) => trgAsmb.FullName == refAsmb.FullName;

        public bool TypesAreEqual(
            DotNetType trgType,
            DotNetType refType)
        {
            bool areEqual = trgType.FullName == refType.FullName;
            areEqual = areEqual && trgType.Namespace == refType.Namespace;
            areEqual = areEqual && trgType.MetadataToken == refType.MetadataToken;

            bool trgTypeHasAssembly = trgType.Assembly?.BclItem != null;
            bool refTypeHasAssembly = refType.Assembly?.BclItem != null;

            areEqual = areEqual && trgTypeHasAssembly == refTypeHasAssembly;

            if (areEqual && trgTypeHasAssembly)
            {
                areEqual = AssembliesAreEqual(
                    trgType.Assembly.BclItem,
                    refType.Assembly.BclItem);
            }

            areEqual = areEqual && (trgType.IsValueType ?? false) == (refType.IsValueType ?? false);
            areEqual = areEqual && (trgType.IsNested ?? false) == (refType.IsNested ?? false);
            areEqual = areEqual && (trgType.IsGenericType ?? false) == (refType.IsGenericType ?? false);
            areEqual = areEqual && (trgType.IsGenericTypeDef ?? false) == (refType.IsGenericTypeDef ?? false);
            areEqual = areEqual && (trgType.IsConstructedGenericType ?? false) == (refType.IsConstructedGenericType ?? false);
            areEqual = areEqual && (trgType.IsGenericParam ?? false) == (refType.IsGenericParam ?? false);
            areEqual = areEqual && (trgType.IsGenericTypeParam ?? false) == (refType.IsGenericTypeParam ?? false);
            areEqual = areEqual && (trgType.IsGenericMethodParam ?? false) == (refType.IsGenericMethodParam ?? false);
            areEqual = areEqual && (trgType.IsGenericTypeDef ?? false) == (refType.IsGenericTypeDef ?? false);

            if (areEqual && trgType.IsNested == true)
            {
                areEqual = TypesAreEqual(
                    trgType.DeclaringType,
                    refType.DeclaringType);
            }

            if (areEqual && trgType.IsGenericType == true)
            {
                areEqual = trgType.GenericTypeArgs != null && refType.GenericTypeArgs != null;
                areEqual = areEqual && trgType.GenericTypeArgs.Count == refType.GenericTypeArgs.Count;

                areEqual = areEqual && trgType.GenericTypeArgs.All(
                    (trgGenericType, i) => GenericArgsAreEqual(
                        trgGenericType,
                        refType.GenericTypeArgs[i]));
            }

            return areEqual;
        }

        public bool GenericArgsAreEqual(
            GenericTypeArg trgArg,
            GenericTypeArg refArg)
        {
            bool areEqual = (trgArg.TypeArg != null) == (refArg != null);

            areEqual = areEqual && TypesAreEqual(
                trgArg.TypeArg,
                refArg.TypeArg);

            areEqual = areEqual && (trgArg.TypeParamConstraints != null) == (
                refArg.TypeParamConstraints != null);

            areEqual = areEqual && trgArg.TypeParamConstraints.Count == refArg.TypeParamConstraints.Count;

            areEqual = areEqual && trgArg.TypeParamConstraints.All(
                (trgConstraint, i) => TypesAreEqual(
                    trgConstraint, refArg.TypeParamConstraints[i]));

            return areEqual;
        }

        private DotNetType ConvertAssemblyType(
            WorkArgs wka,
            Type? typeObj,
            TypeOpts? typeOpts)
        {
            typeObj ??= GetTypeObj(wka, typeOpts);
            typeOpts ??= GetTypeOpts(wka, typeObj);

            var typesList = wka.LoadedTypes;
            string fullName = typeObj.GetTypeFullDisplayName();

            var dotNetType = FindMatching(wka, typeObj, typesList);

            if (dotNetType == null)
            {
                dotNetType = new DotNetType(typeObj)
                {
                    MetadataToken = typeObj.MetadataToken,
                    FullName = fullName,
                    Name = typeObj.Name,
                    Namespace = typeObj.Namespace,
                    IsValueType = typeObj.IsValueType,
                    IsGenericParam = typeObj.IsGenericParameter,
                    IsGenericTypeParam = typeObj.IsGenericTypeParameter,
                    IsGenericMethodParam = typeObj.IsGenericMethodParameter,
                    IsNested = typeObj.IsNested && !typeObj.IsGenericParameter,
                    IsGenericType = typeObj.IsGenericType,
                    IsGenericTypeDef = typeObj.IsGenericTypeDefinition,
                    IsConstructedGenericType = typeObj.IsConstructedGenericType,
                    ContainsGenericParameters = typeObj.ContainsGenericParameters,
                    IsArrayType = typeObj.IsArray
                };

                dotNetType.Assembly = typeObj.Assembly.With(asmb => ConvertAssembly(
                    new WorkArgs(wka)
                    {
                        AsmbObj = asmb,
                        AsmbOpts = new AssemblyOpts(),
                    })).ActWith(asmbObj =>
                    {
                        asmbObj.TypesList.Add(dotNetType);
                    });

                if (dotNetType.Assembly.IsCoreLib == true)
                {
                    if (!typeObj.IsArray)
                    {
                        dotNetType.IsNullableType = HasGenericTypeDef(
                            dotNetType.BclItem,
                            typeof(int?));
                    }
                }

                typesList.Add(dotNetType);

                if (dotNetType.IsGenericType == true)
                {
                    if (dotNetType.IsGenericTypeDef != true)
                    {
                        dotNetType.GenericTypeDef = typeObj.GetGenericTypeDefinition().With(
                            genericTypeDef => ConvertAssemblyType(wka, genericTypeDef));
                    }

                    dotNetType.GenericTypeArgs = typeObj.GetGenericArguments().Select(
                        genericArg => ConvertGenericTypeArg(wka, genericArg)).ToList();
                }
                else if (dotNetType.IsArrayType == true)
                {
                    dotNetType.ArrayElementType = ConvertAssemblyType(
                        wka, typeObj.GetElementType());
                }

                dotNetType.DeclaringType = dotNetType.IsNested == true ? typeObj.DeclaringType.With(
                    declaringType => ConvertAssemblyType(wka, declaringType)) : null;

                dotNetType.DeclaringType.ActIfNotNull(declaringType =>
                {
                    dotNetType.RelNsPartsArr = (declaringType.RelNsPartsArr ?? []).AppendToArr(
                        declaringType.Name);

                    dotNetType.NsStartsWithAsmbPfx = declaringType.NsStartsWithAsmbPfx;
                },
                () =>
                {
                    if ((dotNetType.NsStartsWithAsmbPfx = dotNetType.Namespace?.StartsWith(
                        dotNetType.Assembly.TypeNamesPfx)) ?? false)
                    {
                        dotNetType.RelNsPartsArr = dotNetType.FullName?.Substring(
                            dotNetType.Assembly.TypeNamesPfx.Length).Split('.');
                    }
                    else
                    {
                        dotNetType.RelNsPartsArr = dotNetType.FullName?.Split('.');
                    }

                    dotNetType.RelNsPartsArr = dotNetType.RelNsPartsArr?.Reverse().Skip(1).Reverse().ToArray();
                });

                dotNetType.BaseType = typeObj.BaseType?.With(
                    baseType => ConvertAssemblyType(
                        wka, baseType, null));

                dotNetType.Interfaces = typeObj.GetInterfaces().Select(
                    intfType => ConvertAssemblyType(wka, intfType)).ToList();

                if (wka.Opts.LoadAllTypes == true || wka.AsmbOpts.LoadAllTypes == true || typeOpts.LoadAllPubGetProps == true || typeOpts.LoadPubInstnGetProps == true)
                {
                    var properties = typeObj.GetProperties();

                    if (typeOpts.LoadAllPubGetProps != true)
                    {
                        properties = properties.Where(
                            prop => prop.GetGetMethod()?.IsStatic == false).ToArray();
                    }

                    dotNetType.Properties = properties.Select(
                        propInfo => ConvertDotNetProperty(wka, propInfo)).ToList();
                }

                if (wka.Opts.LoadAllTypes == true || wka.AsmbOpts.LoadAllTypes == true || typeOpts.LoadAllPubMethods == true || typeOpts.LoadPubInstnMethods == true)
                {
                    var methodInfos = typeObj.GetMethods();

                    if (typeOpts.LoadAllPubMethods != true)
                    {
                        methodInfos = methodInfos.Where(
                            method => !method.IsStatic).ToArray();
                    }

                    dotNetType.Methods = methodInfos.Select(
                        methodInfo => ConvertDotNetMethod(wka, methodInfo)).ToList();
                }

                if (typeOpts.LoadPubInstnConstructors == true)
                {
                    var constructorInfos = typeObj.GetConstructors().Where(
                        constrInfo => !constrInfo.IsStatic);

                    dotNetType.Constructors = constructorInfos.Select(
                        constrInfo => ConvertDotNetConstructor(wka, constrInfo)).ToList();
                }
            }

            if (dotNetType.Name.Contains("*"))
            {

            }

            return dotNetType;
        }

        private bool HasGenericTypeDef(
            Type trgType,
            Type genericTypeDef)
        {
            bool areEqual = trgType.IsGenericType == true && trgType.GetGenericTypeDefinition(
                ).FullName == genericTypeDef.GetGenericTypeDefinition(
                    ).FullName;

            return areEqual;
        }

        private Type GetTypeObjCore(
            WorkArgs wka,
            TypeOpts? typeOpts,
            Type? declaringType)
        {
            var typePredicate = typeOpts!.GenericTypeParamsCount.WithNllbl<Func<Type, bool>, int>(
                genericTypeParamsCount => type => type.IsGenericType && type.GetGenericArguments(
                    ).Length == genericTypeParamsCount,
                () => type => true);

            var typeObj = declaringType.IfNotNull(
                dclringType => dclringType!.GetNestedTypes(
                    ReflH.MatchAllFlatHcyBindingFlags).First(
                        nestedType => nestedType.Name == typeOpts.TypeName && typePredicate(nestedType)),
                () => typeOpts!.GenericTypeParamsCount.HasValue switch
                {
                    true => wka.AsmbTypes.First(
                        type => ReflH.GetTypeDisplayName(
                            type.Name, '`') == typeOpts.TypeName && typePredicate(type)),
                    _ => wka.AsmbObj!.GetType(
                        typeOpts.FullTypeName)
                });

            return typeObj;
        }

        public readonly struct WorkArgs
        {
            public WorkArgs()
            {
                LoadedAssemblies = [];
                LoadedTypes = [];
            }

            public WorkArgs(WorkArgs src)
            {
                LoadedAssemblies = src.LoadedAssemblies;
                LoadedTypes = src.LoadedTypes;

                this.Opts = src.Opts;
                this.AsmbOpts = src.AsmbOpts;
                this.AsmbObj = src.AsmbObj;
                this.AsmbTypes = src.AsmbTypes;
            }

            public List<DotNetAssembly> LoadedAssemblies { get; }
            public List<DotNetType> LoadedTypes { get; }

            public AssemblyLoaderOpts? Opts { get; init; }
            public AssemblyOpts? AsmbOpts { get; init; }
            public Assembly? AsmbObj { get; init; }
            public List<Type> AsmbTypes { get; init; }

            public PathAssemblyResolver? PathAssemblyResolver { get; init; }
            public MetadataLoadContext? MetadataLoadContext { get; init; }
        }
    }
}

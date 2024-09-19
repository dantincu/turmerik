using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;
using Turmerik.NetCore.Utility.AsmbLoading;

namespace Turmerik.NetCore.Utility.Assemblies
{
    public class AssemblyLoaderCore : ComponentCoreBase
    {
        public const string NET_STD_ASMB_NAME = "netstandard";
        public const string NET_STD_ASMB_FILE_NAME = "netstandard.dll";

        private readonly string coreLibLocation = typeof(object).Assembly.Location;
        private readonly string coreLibName = typeof(object).Assembly.GetName().Name;

        private readonly IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever;

        public AssemblyLoaderCore(
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
                LoadPubInstnMethods = opts.LoadPubInstnMethods
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
                    LoadPubGetProps = asmb.LoadPubGetProps ?? opts.LoadPubGetProps,
                    LoadPubInstnGetProps = asmb.LoadPubInstnGetProps ?? opts.LoadPubInstnGetProps,
                    LoadPubMethods = asmb.LoadPubMethods ?? opts.LoadPubMethods,
                    LoadPubInstnMethods = asmb.LoadPubInstnMethods ?? opts.LoadPubInstnMethods,
                    TypesToLoad = asmb.TypesToLoad?.Select(
                        type =>
                        {
                            var retObj = new AssemblyLoaderOpts.TypeOpts
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

        public async Task<List<DotNetAssembly>> LoadAssembliesAsync(
            AssemblyLoaderOpts opts)
        {
            opts = await NormalizeOptsAsync(opts);
            var retAssembliesList = new List<DotNetAssembly>();

            var resolver = new PathAssemblyResolver(
                opts.AllAssembliesFilePaths);

            MetadataLoadContext context = null;
            bool keepContext = true;

            try
            {
                context = new MetadataLoadContext(
                    resolver, coreAssemblyName: coreLibName);

                var tempAssembliesList = GetDotNetAssemblies(
                    opts, context);

                foreach (var dotNetAssembly in tempAssembliesList)
                {

                }
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

            return retAssembliesList;
        }

        public List<DotNetAssemblyCore> GetDotNetAssemblies(
            AssemblyLoaderOpts opts,
            MetadataLoadContext context)
        {
            var tempAssembliesList = new List<DotNetAssemblyCore>();
            var typeIdnfList = new List<DotNetTypeIdnf>();

            foreach (var asmbToLoad in opts.AssembliesToLoad)
            {
                (var asmbObj, var dotNetAssembly) = LoadDotNetAssembly(
                    tempAssembliesList, asmbToLoad, context);

                var loadedTypesList = asmbToLoad.LoadAllTypes switch
                {
                    true => asmbObj.ExportedTypes.Select(
                        type => LoadDotNetTypeIdnf(
                            typeIdnfList, type)).ToList()!,
                    _ => asmbToLoad.TypesToLoad.Select(
                        typeOpts => LoadDotNetTypeIdnfFromOpts(
                            typeIdnfList, asmbObj, typeOpts)).ToList()
                };

                foreach (var loadedTypeIdnf in loadedTypesList)
                {
                    LoadDependantDotNetTypeIdnfs(
                        opts, context,
                        dotNetAssembly,
                        typeIdnfList,
                        loadedTypeIdnf);
                }

                tempAssembliesList.Add(dotNetAssembly);
            }

            return tempAssembliesList;
        }

        public Tuple<Assembly, DotNetAssemblyCore> LoadDotNetAssembly(
            List<DotNetAssemblyCore> tempAssembliesList,
            AssemblyLoaderOpts.AssemblyOpts asmbToLoad,
            MetadataLoadContext context)
        {
            var asmbObj = context.LoadFromAssemblyPath(
                asmbToLoad.AssemblyFilePath);

            var dotNetAssembly = LoadDotNetAssemblyCore(
                tempAssembliesList,
                asmbObj,
                asmbToLoad.AssemblyFilePath);

            return Tuple.Create(
                asmbObj, dotNetAssembly);
        }

        public DotNetAssemblyCore LoadDotNetAssemblyCore(
            List<DotNetAssemblyCore> asmbList,
            Assembly asmb,
            string assemblyFilePath)
        {
            string asmbName = DotNetAssembly.GetName(
                asmb) ?? throw new ArgumentNullException(
                    nameof(asmbName));

            var retAsmb = asmbList.FirstOrDefault(
                refAsmb => refAsmb.Name == asmbName);

            if (retAsmb == null)
            {
                retAsmb = GetDotNetAssembly(
                    asmb, asmbName, assemblyFilePath);

                asmbList.Add(retAsmb);
            }

            return retAsmb;
        }

        public DotNetAssemblyCore GetDotNetAssembly(
            Assembly asmb,
            string name,
            string assemblyFilePath)
        {
            bool isCoreLib = name == coreLibName;
            bool isNetStandardLib = name == NET_STD_ASMB_NAME;
            bool isSysLib = isCoreLib || isNetStandardLib;
            string dfNamespace = isSysLib ? ReflH.BaseObjectType.Namespace! : name;

            var retAsmb = new DotNetAssemblyCore
            {
                BclItem = asmb,
                Name = name,
                DefaultNamespace = dfNamespace,
                TypeNamesPfx = $"{dfNamespace}.",
                AssemblyFilePath = assemblyFilePath,
                IsExecutable = Path.GetExtension(
                    assemblyFilePath).ToLower() != ".dll",
                IsCoreLib = isCoreLib,
                IsNetStandardLib = isNetStandardLib,
                IsSysLib = isSysLib
            };

            return retAsmb;
        }

        public void LoadDependantDotNetTypeIdnfs(
            AssemblyLoaderOpts opts,
            MetadataLoadContext context,
            DotNetAssemblyCore dotNetAssembly,
            List<DotNetTypeIdnf> idnfList,
            DotNetTypeIdnf dotNetTypeIdnf)
        {
            LoadDotNetTypeIdnf(
                idnfList,
                dotNetTypeIdnf.BclItem.BaseType);

            foreach (var intfType in dotNetTypeIdnf.BclItem.GetInterfaces())
            {
                LoadDotNetTypeIdnf(idnfList, intfType);
            }
        }

        public DotNetTypeIdnf? LoadDotNetTypeIdnf(
            DotNetAssembly dotNetAssembly,
            List<DotNetTypeIdnf> idnfList,
            Type type) => LoadDotNetTypeIdnf(
                dotNetAssembly, idnfList, type, out _);

        public DotNetTypeIdnf? LoadDotNetTypeIdnf(
            DotNetAssembly dotNetAssembly,
            List<DotNetTypeIdnf> idnfList,
            Type type,
            out Type genericTypeDef)
        {
            DotNetTypeIdnf? retIdnf = null;
            genericTypeDef = null;

            if (!type.IsGenericTypeParameter)
            {
                if (type.IsGenericType && !type.IsGenericTypeDefinition)
                {
                    type = type.GetGenericTypeDefinition();
                    genericTypeDef = type;
                }

                string fullIdnfName = string.Join(".",
                    type.Namespace, type.Name);

                DotNetTypeIdnf? declaringIdnf = null;

                if (type.IsNested)
                {
                    declaringIdnf = LoadDotNetTypeIdnf(
                        dotNetAssembly, idnfList, type.DeclaringType);

                    fullIdnfName = string.Join(".",
                        declaringIdnf.FullIdnfName,
                        type.Name);
                }

                retIdnf = idnfList.FirstOrDefault(
                    idnf => idnf.FullName == fullIdnfName);

                if (retIdnf == null)
                {
                    retIdnf = GetDotNetTypeIdnfCore(
                        dotNetAssembly, type, declaringIdnf, fullIdnfName);

                    idnfList.Add(retIdnf);
                }
            }

            return retIdnf;
        }

        public DotNetTypeIdnf LoadDotNetTypeIdnfFromOpts(
            List<DotNetTypeIdnf> idnfList,
            Assembly asmbObj,
            AssemblyLoaderOpts.TypeOpts typeOpts)
        {
            var matchingTypeFullIdnfName = GetDotNetTypeOptsFullIdnfName(typeOpts);

            var matchingIdnf = idnfList.FirstOrDefault(
                idnf => idnf.FullIdnfName == matchingTypeFullIdnfName);

            if (matchingIdnf == null)
            {
                matchingIdnf = typeOpts.DeclaringTypeOpts.IfNotNull(
                    declaringTypeOpts => LoadDotNetTypeIdnfFromOpts(
                        idnfList, asmbObj, declaringTypeOpts)).IfNotNull(
                    declaringTypeIdnf => GetNestedDotNetTypeIdnfFromOptsCore(
                        asmbObj, typeOpts, declaringTypeIdnf),
                    () => GetDotNetTypeIdnfFromOptsCore(asmbObj, typeOpts));

                idnfList.Add(matchingIdnf);
            }

            return matchingIdnf;
        }

        public string GetDotNetTypeOptsFullIdnfName(
            AssemblyLoaderOpts.TypeOpts typeOpts) => typeOpts.DeclaringTypeOpts.IfNotNull(
                declaringTypeOpts => string.Join(".", GetDotNetTypeOptsFullIdnfName(
                    declaringTypeOpts),
                    typeOpts.TypeName),
                () => typeOpts.FullTypeName);

        public DotNetTypeIdnf GetDotNetTypeIdnfFromOptsCore(
            Assembly asmbObj,
            AssemblyLoaderOpts.TypeOpts typeOpts) => typeOpts.GenericTypeParamsCount.IfNotNull(
                genericTypeParamsCount =>
                {
                    (var name, var @namespace) = typeOpts.FullTypeName.Split('.').ToList().With(
                        fullNamePartsList =>
                        {
                            var retName = fullNamePartsList.Last();

                            fullNamePartsList.RemoveAt(
                                fullNamePartsList.Count - 1);

                            return Tuple.Create(
                                retName,
                                string.Join(".", fullNamePartsList));
                        });

                    var reType = asmbObj.ExportedTypes.First(
                        type => type.GenericTypeArguments.Count() == genericTypeParamsCount && (
                            type.Namespace == @namespace && type.Name == name));

                    return reType;
                },
                () => asmbObj.GetType(typeOpts.FullTypeName) ?? throw new InvalidOperationException(
                    $"No type with full name {typeOpts.FullTypeName} has been found in assembly {asmbObj.FullName}")).With(
                        retType => GetDotNetTypeIdnfCore(
                            retType, null, string.Join(".",
                                retType.Namespace,
                                retType.Name)));

        public DotNetTypeIdnf GetNestedDotNetTypeIdnfFromOptsCore(
            Assembly asmbObj,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetTypeIdnf declaringTypeIdnf) => typeOpts.GenericTypeParamsCount.IfNotNull(
                genericTypeParamsCount => declaringTypeIdnf.BclItem.GetNestedTypes().First(
                    type => type.GenericTypeArguments.Count() == genericTypeParamsCount && (
                        type.Name == typeOpts.TypeName)),
                () => declaringTypeIdnf.BclItem.GetNestedTypes().First(
                    type => type.Name == typeOpts.TypeName)).With(
                        retType => GetDotNetTypeIdnfCore(
                            retType, null, string.Join(".",
                                retType.Namespace,
                                retType.Name)));

        public DotNetTypeIdnf GetDotNetTypeIdnfCore(
            DotNetAssembly dotNetAssembly,
            Type type,
            DotNetTypeIdnf? declaringIdnf,
            string fullIdnfName) => new()
            {
                BclItem = type,
                Name = type.Name,
                CoreName = type.Name.Split('`')[0],
                FullName = type.FullName,
                FullIdnfName = fullIdnfName,
                Namespace = type.Namespace,
                DeclaringTypeIdnf = declaringIdnf,
                DotNetAssembly = dotNetAssembly,
            };

        public DotNetType GetDotNetTypeCore(
            DotNetTypeIdnf idnf,
            Type type,
            DotNetAssembly dotNetAssembly)
        {
            bool nsStartsWithAsmbPfx = idnf.FullIdnfName.StartsWith(
                dotNetAssembly.TypeNamesPfx);

            string relFullName = nsStartsWithAsmbPfx switch
            {
                true => idnf.FullIdnfName.Substring(
                    dotNetAssembly.TypeNamesPfx.Length),
                false => idnf.FullIdnfName
            };

            string relNsPartsStr = relFullName.Substring(
                0, relFullName.Length - 1 - idnf.Name.Length);

            string[] relNsPartsArr = relNsPartsStr.Split('.');

            var retType = new DotNetType(idnf)
            {
                Assembly = dotNetAssembly,
                NsStartsWithAsmbPfx = nsStartsWithAsmbPfx,
                RelNsParts = relNsPartsArr.RdnlC()
            };
            return retType;
        }
    }
}

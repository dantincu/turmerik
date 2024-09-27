using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public class AssemblyLoader : AssemblyLoaderBase
    {
        public AssemblyLoader(
            IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever) : base(
                filteredDriveEntriesRetriever)
        {
        }

        protected override TypeItemCoreBase LoadType(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts)
        {
            var asmbItem = GetAssemblyItem(
                wka, asmbOpts);

            var type = GetTypeObj(wka, asmbItem, typeOpts);
            var typeItem = LoadType(wka, type);

            return typeItem;
        }

        protected override TypeItemCoreBase LoadType(
            WorkArgs wka,
            Type type)
        {
            TypeItemCoreBase retItem = null;
            string idnfName = GetTypeIdnfName(type);

            if (!type.IsGenericParameter && type.IsGenericType && !type.IsGenericTypeDefinition)
            {
                if (!TryLoadGenericInteropType(
                    wka, type, out retItem))
                {
                    retItem = LoadTypeCore(wka, type);
                }
            }
            else
            {
                if (type.IsArray)
                {
                    retItem = LoadArrayType(wka, type);
                }
                else if (type.IsEnum)
                {
                    retItem = LoadEnumType(wka, type);
                }
                else if (type.IsGenericParameter)
                {
                    retItem = LoadGenericParamType(wka, type);
                }
                else
                {
                    bool loaded = false;

                    if (!type.IsGenericType && (type.Namespace?.StartsWith(
                        ReflH.BaseObjectType.Type.Namespace!) ?? false))
                    {
                        loaded = TryLoadPrimitiveType(
                            wka, type, out retItem);
                    }

                    if (!loaded)
                    {
                        var asmbItem = GetAssemblyItem(
                            wka, type.Assembly);

                        retItem = asmbItem.TypesMap.GetOrAdd(
                            idnfName, name => LoadRegularType(wka, type));
                    }
                }

            }

            return retItem;
        }

        private TypeItemCoreBase LoadTypeCore(
            WorkArgs wka,
            Type type)
        {
            TypeItemCoreBase retItem = null;

            if (type.IsArray)
            {
                retItem = LoadArrayType(wka, type);
            }
            else if (type.IsEnum)
            {
                retItem = LoadEnumType(wka, type);
            }
            else if (type.IsGenericParameter)
            {
                retItem = LoadGenericParamType(wka, type);
            }
            else
            {
                bool loaded = false;

                if (!type.IsGenericType && (type.Namespace?.StartsWith(
                    ReflH.BaseObjectType.Type.Namespace!) ?? false))
                {
                    loaded = TryLoadPrimitiveType(
                        wka, type, out retItem);
                }

                if (!loaded)
                {
                    retItem = LoadRegularType(
                        wka, type);
                }
            }

            return retItem;
        }

        private TypeItemCoreBase LoadArrayType(
            WorkArgs wka,
            Type type)
        {
            var retItem = new GenericInteropTypeItem(
                    TypeItemKind.Array,
                    item => item.GenericTypeArgs.Single().Value.IdnfName + "[]",
                    item => item.GenericTypeArgs.Single().Value.FullIdnfName + "[]")
                {
                    GenericTypeArgs = new Lazy<GenericTypeArg>(
                        () =>
                        {
                            var elemType = type.GetElementType();
                            var typeArg = LoadType(wka, elemType);

                            var genericTypeArg = new GenericTypeArg
                            {
                                TypeArg = typeArg
                            };

                            return genericTypeArg;
                        }).Arr().RdnlC()
                };

            return retItem;
        }

        private TypeItemCoreBase LoadEnumType(
            WorkArgs wka,
            Type type)
        {
            var retItem = new EnumTypeItem(
                    TypeItemKind.Enum,
                    item => (item.DeclaringType != null) switch
                    {
                        true => string.Join("+",
                            item.DeclaringType.Value.IdnfName,
                            type.Name),
                        false => type.FullName!
                    },
                    item => (item.DeclaringType != null) switch
                    {
                        true => string.Join(".",
                            item.DeclaringType.Value.FullIdnfName,
                            type.Name),
                        false => type.FullName!
                    })
            {
                DeclaringType = type.DeclaringType?.With(
                        declaringType => new Lazy<TypeItemCoreBase>(
                            () => LoadType(wka, declaringType))),
                DefinedValuesMap = Enum.GetNames(type).With(namesArr =>
                {
                    var valuesArr = Enum.GetValuesAsUnderlyingType(type);

                    var retMap = namesArr.Select((name, idx) => new KeyValuePair<string, object>(
                        name, valuesArr.GetValue(idx))).Dictnr().RdnlD();

                    return retMap;
                })
            };

            return retItem;
        }

        private TypeItemCoreBase LoadGenericParamType(
            WorkArgs wka,
            Type typeParam)
        {
            var retItem = new GenericTypeParameter(
                    TypeItemKind.GenericParam)
            {
                Name = typeParam.Name,
                GenericParamPosition = typeParam.GenericParameterPosition,
                ParamConstraints = typeParam.GetGenericParameterConstraints().With(
                    constraintsArr => GetGenericTypeParamConstraints(
                        wka, typeParam, constraintsArr))
            };

            return retItem;
        }

        private bool TryLoadGenericInteropType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem)
        {
            bool retVal = TryLoadNullableType(
                wka, type, out retItem);

            retVal = retVal || TryLoadDictionaryType(
                wka, type, out retItem);

            retVal = retVal || TryLoadEnumerableType(
                wka, type, out retItem);

            return retVal;
        }

        private bool TryLoadNullableType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem) => TryLoadGenericInteropTypeCore(
                wka, type, out retItem,
                [ReflH.NullableGenericTypeDef.FullName],
                TypeItemKind.Nullable);

        private bool TryLoadDictionaryType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem) => TryLoadGenericInteropTypeCore(
                wka, type, out retItem,
                NetCoreCommonTypes.Instn.Value.DictionaryTypes.TypeNames,
                TypeItemKind.Dictionary);

        private bool TryLoadEnumerableType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem) => TryLoadGenericInteropTypeCore(
                wka, type, out retItem,
                NetCoreCommonTypes.Instn.Value.EnumerableTypes.TypeNames,
                TypeItemKind.Enumerable);

        private bool TryLoadPrimitiveType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem) => TryLoadKnownType(
                wka, type, out retItem,
                fullName => PrimitiveTypeNamesMap.FirstKvp(
                    kvp => kvp.Value.TypeNames.Contains(fullName)),
                match => match.Key >= 0,
                match => match.Value.Key);

        private bool TryLoadGenericInteropTypeCore(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem,
            IEnumerable<string> typeNamesNmrbl,
            TypeItemKind kind) => TryLoadKnownType(
                wka, type, out retItem,
                fullName => fullName,
                fullName => typeNamesNmrbl.Contains(fullName),
                fullName => kind);

        private bool TryLoadKnownType<TTempData>(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem,
            Func<string, TTempData> tempDataFactory,
            Func<TTempData, bool> isMatchPredicate,
            Func<TTempData, TypeItemKind> typeItemKindFactory)
        {
            retItem = null;
            string idnfName = type.FullName!;

            var tempData = tempDataFactory(idnfName);
            bool foundMatch = isMatchPredicate(tempData);

            if (foundMatch)
            {
                var typeItemKind = typeItemKindFactory(
                    tempData);

                retItem = new TypeItemCore(
                    typeItemKind, idnfName);
            }

            return foundMatch;
        }

        private TypeItemCoreBase LoadRegularType(
            WorkArgs wka,
            Type type)
        {
            var declaringTypeItem = type.DeclaringType?.With(
                declaringType => new Lazy<TypeItemCoreBase> (() => LoadType(
                    wka, declaringType)));

            TypeItemCoreBase retItem = null;

            var idnfFactory = new Lazy<TypeIdnf>(() =>
            {
                string idnfName = declaringTypeItem.IfNotNull(
                    declTypeItem => string.Join(".",
                        declTypeItem!.Value.IdnfName,
                        type.Name),
                    () => string.Join(".",
                        type.Namespace,
                        type.Name));

                string fullIdnfName = declaringTypeItem.IfNotNull(
                    declTypeItem => string.Join("+",
                        declTypeItem!.Value.FullIdnfName,
                        type.Name),
                    () => string.Join(".", type.Namespace,
                        string.Concat(ReflH.GetTypeDisplayName(type.Name, '`'),
                            (retItem as GenericTypeItem)?.With(
                                genericItem => string.Join(", ", genericItem.GenericTypeArgs.Select(
                                arg => arg.Value.FullIdnfName).ToArray())) ?? "")));

                var asmbItem = GetAssemblyItem(wka, type.Assembly);

                bool nsStartsWithAsmbPfx = idnfName.StartsWith(
                    asmbItem.TypeNamesPfx);

                var relNsParts = (nsStartsWithAsmbPfx switch
                {
                    true => idnfName.Substring(
                        asmbItem.TypeNamesPfx.Length),
                    false => idnfName
                }).Split(".").RdnlC();

                return new TypeIdnf(type, asmbItem, type.Name,
                    ReflH.GetTypeDisplayName(type.Name),
                    idnfName, fullIdnfName)
                {
                    Namespace = type.Namespace,
                    NsStartsWithAsmbPfx = idnfName.StartsWith(
                        asmbItem.DefaultNamespace),
                    RelNsParts = relNsParts
                };
            });

            var dataFactory = new Lazy<TypeData>(() =>
            {
                TypeData typeData = null;

                typeData = new TypeData
                {
                    BaseType = type.BaseType?.With(baseType => new Lazy<TypeItemCoreBase>(
                        () => LoadType(wka, baseType))),
                    GenericTypeDefinition = type.IsGenericType ? new Lazy<TypeItemCoreBase>(
                        () => LoadType(wka, type.GetGenericTypeDefinition())) : null,
                    InterfaceTypes = type.GetDistinctInterfaces().SelectTypes().Select(
                        intf => new Lazy<TypeItemCoreBase>(
                            () => LoadType(wka, intf))).RdnlC(),
                    IsConstructedGenericType = type.IsConstructedGenericType,
                    IsGenericMethodParameter = type.IsGenericMethodParameter,
                    IsGenericParameter = type.IsGenericParameter,
                    IsGenericTypeDefinition = type.IsGenericTypeDefinition,
                    IsGenericTypeParameter = type.IsGenericTypeParameter,
                    IsInterface = type.IsInterface,
                    IsValueType = type.IsValueType,
                    PubInstnProps = wka.Opts.LoadPubInstnGetProps switch
                    {
                        true => type.GetProperties(
                            BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public).Select(
                            prop => new PropertyItem(prop, prop.Name)
                            {
                                CanRead = prop.CanRead,
                                CanWrite = prop.CanWrite,
                                IsStatic = false,
                                PropertyType = new Lazy<TypeItemCoreBase>(
                                    () => LoadType(wka, prop.PropertyType))
                            }).RdnlC()
                    },
                    PubInstnMethods = wka.Opts.LoadPubInstnMethods switch
                    {
                        true => type.GetMethods(
                            BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public).Select(
                            method => new MethodItem(method, method.Name)
                            {
                                IsStatic = false,
                                IsVoidMethod = type.GetTypeFullDisplayName(
                                    null) == ReflH.VoidType.FullName,
                                ReturnType = new Lazy<TypeItemCoreBase>(
                                    () => LoadType(wka, method.ReturnType)),
                                Params = method.GetParameters().Where(
                                    param => param.Name != null).ToDictionary(
                                    param => param.Name!, param => new Lazy<TypeItemCoreBase>(
                                        () => LoadType(wka, param.ParameterType))).RdnlD()
                            }).RdnlC()
                    },
                    AllTypeDependencies = new Lazy<System.Collections.ObjectModel.ReadOnlyCollection<Lazy<TypeItemCoreBase>>>(
                        () =>
                        {
                            var retList = typeData!.InterfaceTypes.ToList();
                            AddDependencies(retList, [ typeData.BaseType ]);
                            AddDependencies(retList, [ typeData.GenericTypeDefinition ]);

                            AddDependencies(retList, typeData.PubInstnProps.Select(
                                prop => prop.PropertyType));

                            AddDependencies(retList, typeData.PubInstnMethods.SelectMany(
                                method => method.ReturnType.Arr(
                                    method.Params.Select(
                                        param => param.Value).ToArray())));

                            if (retItem is GenericTypeItem genericTypeItem)
                            {
                                AddDependencies(retList, genericTypeItem.GenericTypeArgs!);
                            }
                            else if (retItem is GenericInteropTypeItem genericInteropTypeItem)
                            {
                                AddDependencies(retList, genericInteropTypeItem.GenericTypeArgs);
                            }

                            return retList.RdnlC();
                        })
                };

                return typeData;
            });

            if (type.IsGenericType)
            {
                GenericTypeItem genericTypeItem = null;

                genericTypeItem = new GenericTypeItem(
                    TypeItemKind.Regular,
                    item => item.Idnf.Value.IdnfName,
                    item => item.Idnf.Value.FullIdnfName)
                {
                    Idnf = idnfFactory,
                    Data = dataFactory,
                    DeclaringType = declaringTypeItem,
                    GenericTypeArgs = type.GetGenericArguments().Select(
                        arg => new Lazy<GenericTypeArg>(() => arg.IsGenericTypeParameter switch
                        {
                            true => new GenericTypeArg
                            {
                                Param = new GenericTypeParameter(
                                    TypeItemKind.GenericParam)
                                {
                                    GenericParamPosition = arg.GenericParameterPosition,
                                    Name = arg.Name,
                                    ParamConstraints = arg.GetGenericParameterConstraints().With(
                                        constraintsArr => GetGenericTypeParamConstraints(
                                            wka, arg, constraintsArr)),
                                },
                                DeclaringType = genericTypeItem,
                                BelongsToDeclaringType = type.DeclaringType == type
                            },
                            false => new GenericTypeArg
                            {
                                TypeArg = arg.IsGenericTypeParameter switch
                                {
                                    false => LoadType(wka, arg)
                                }
                            }
                        })).RdnlC()
                };

                retItem = genericTypeItem;
            }
            else
            {
                retItem = new TypeItem(
                    TypeItemKind.Regular,
                    item => item.Idnf.Value.IdnfName,
                    item => item.Idnf.Value.FullIdnfName)
                    {
                        Idnf = idnfFactory,
                        Data = dataFactory,
                        DeclaringType = declaringTypeItem
                };
            }

            return retItem;
        }

        private GenericTypeParamConstraints GetGenericTypeParamConstraints(
            WorkArgs wka,
            Type typeParam,
            Type[] constraintsArr)
        {
            bool isStruct = typeParam.IsValueType;
            Lazy<TypeItemCoreBase>? baseClass = null;
            var genericParameterAttributes = typeParam.GenericParameterAttributes;

            if (!isStruct)
            {
                if (typeParam.BaseType?.IsValueType == false &&
                typeParam.BaseType.FullName != wka.RootObject.IdnfName)
                {
                    baseClass = new Lazy<TypeItemCoreBase>(
                        () => LoadType(wka, typeParam.BaseType));
                }
            }

            var retObj = new GenericTypeParamConstraints
            {
                GenericParameterAttributes = genericParameterAttributes,
                IsStruct = isStruct,
                IsClass = genericParameterAttributes.HasFlag(
                    GenericParameterAttributes.ReferenceTypeConstraint),
                HasDefaultConstructor = genericParameterAttributes.HasFlag(
                    GenericParameterAttributes.DefaultConstructorConstraint),
                IsNotNullableValueType = genericParameterAttributes.HasFlag(
                    GenericParameterAttributes.NotNullableValueTypeConstraint),
                BaseClass = baseClass,
                RestOfTypes = constraintsArr.Where(
                    intf => !intf.IsValueType).Select(
                    intf => new Lazy<TypeItemCoreBase>(
                        () => LoadType(wka, intf))).RdnlC()
            };

            return retObj;
        }

        private Type GetTypeObj(
            WorkArgs wka,
            AssemblyItem asmb,
            AssemblyLoaderOpts.TypeOpts? typeOpts) => GetTypeObjCore(
                wka, asmb, typeOpts, typeOpts.DeclaringTypeOpts?.With(
                    declaringTypeOpts => GetTypeObj(
                        wka, asmb, declaringTypeOpts)));

        private Type GetTypeObjCore(
            WorkArgs wka,
            AssemblyItem asmb,
            AssemblyLoaderOpts.TypeOpts typeOpts,
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
                    true => asmb.BclItem.GetTypes().First(
                        type => type.GetTypeFullDisplayName() == typeOpts.FullTypeName && typePredicate(type)),
                    _ => asmb.BclItem!.GetType(
                        typeOpts.FullTypeName)
                });

            return typeObj;
        }

        private string GetTypeIdnfName(
            Type type)
        {
            string idnfName;

            if (type.IsNested)
            {
                var nestedIdnfName = GetTypeIdnfName(
                    type.DeclaringType);

                idnfName = string.Join(".",
                    nestedIdnfName,
                    type.Name);
            }
            else
            {
                idnfName = string.Join(".",
                    type.Namespace,
                    type.Name);
            }

            return idnfName;
        }

        private void AddDependencies(
            List<Lazy<TypeItemCoreBase?>> list,
            IEnumerable<Lazy<GenericTypeArg>?> itemsToAdd) => AddDependencies(
                list, itemsToAdd.SelectMany(arg => new Lazy<TypeItemCoreBase>(
                    arg.Value.TypeArg!).Arr(arg.Value.Param?.ParamConstraints?.With(
                        paramConstraints => paramConstraints.BaseClass.Arr(
                            paramConstraints.RestOfTypes.ToArray())) ?? [])));

        private void AddDependencies(
            List<Lazy<TypeItemCoreBase?>> list,
            IEnumerable<TypeItemCoreBase?> itemsToAdd) => AddDependencies(
                list, itemsToAdd.Select(item => new Lazy<TypeItemCoreBase>(item)));

        private void AddDependencies(
            List<Lazy<TypeItemCoreBase?>> list,
            IEnumerable<Lazy<TypeItemCoreBase>?> itemsToAdd)
        {
            foreach (var lazy in itemsToAdd)
            {
                if (IsDependency(lazy?.Value))
                {
                    list.Add(lazy);
                }
            }
        }

        private bool IsDependency(
            TypeItemCoreBase? typeItem) => typeItem?.Kind == TypeItemKind.Regular;
    }
}

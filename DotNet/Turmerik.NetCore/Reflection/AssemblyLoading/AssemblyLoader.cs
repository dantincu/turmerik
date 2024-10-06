using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public partial class AssemblyLoader : AssemblyLoaderBase
    {
        public delegate TGenericType GenericTypeItemFactory<TGenericType>(
            WorkArgs wka, Type type, out TGenericType? genericDef)
            where TGenericType : ReflectionItemBase, IGenericType<TGenericType>;

        public delegate TGenericType GenericTypeItemCoreFactory<TGenericType>(
            WorkArgs wka, Type type, TGenericType? genericDef)
            where TGenericType : ReflectionItemBase, IGenericType<TGenericType>;

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

            if (type.IsByRef)
            {
                retItem = LoadElementType(
                    wka, type, TypeItemKind.ByRefValue);
            }
            else if (type.IsPointer)
            {
                retItem = LoadElementType(
                    wka, type, TypeItemKind.PointerValue);
            }
            else if (type.IsArray)
            {
                retItem = LoadElementType(
                    wka, type, TypeItemKind.Array);
            }
            else if (type.IsEnum)
            {
                retItem = LoadEnumType(wka, type);
            }
            else if (type.IsGenericParameter)
            {
                retItem = LoadGenericParamType(wka, type);
            }
            else if (type.IsGenericType && !type.IsGenericTypeDefinition)
            {
                if (!TryLoadGenericInteropType(
                    wka, type, out retItem))
                {
                    if (type.IsDelegateType())
                    {
                        retItem = LoadGenericDelegateType(wka, type, out _);
                    }
                    else
                    {
                        retItem = LoadGenericType(wka, type, out _);
                    }
                }
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
                    if (type.IsDelegateType())
                    {
                        retItem = LoadDelegateType(wka, type);
                    }
                    else
                    {
                        retItem = LoadRegularType(wka, type);
                    }
                }
            }

            return retItem;
        }

        private TypeItemCoreBase LoadElementType(
            WorkArgs wka,
            Type type,
            TypeItemKind typeItemKind) => new ElementTypeItem(
                type, typeItemKind,
                LoadType(wka, type.GetElementType()));

        private TypeItemCoreBase LoadEnumType(
            WorkArgs wka,
            Type type) => new EnumTypeItem(
                type, GetAssemblyItem(wka, type.Assembly));

        private TypeItemCoreBase LoadGenericParamType(
            WorkArgs wka,
            Type typeParam) => new GenericTypeParameter(
                typeParam)
            {
                GenericParamPosition = typeParam.GenericParameterPosition,
                ParamConstraints = typeParam.GetGenericParameterConstraints().With(
                    constraintsArr => GetGenericTypeParamConstraints(
                        wka, typeParam, constraintsArr))
            };

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
                fullName => typeNamesNmrbl.Contains(fullName) && type.GetGenericArguments().With(
                    genericArgs => genericArgs.Count() switch
                    {
                        2 => genericArgs[0].FullName?.With(
                            firstArgFullName => PrimitiveTypeNamesMap.Any(
                                kvp => kvp.Value.TypeNames.Contains(firstArgFullName))) ?? false,
                        _ => true
                    }),
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

                retItem = new CommonTypeItem(
                    type, typeItemKind);
            }

            return foundMatch;
        }

        private TGenericType LoadGenericTypeItem<TGenericType>(
            WorkArgs wka,
            Type type,
            out TGenericType genericDef,
            GenericTypeItemFactory<TGenericType> genericTypeItemFactory,
            GenericTypeItemCoreFactory<TGenericType> genericTypeItemCoreFactory)
            where TGenericType : TypeItemCoreBase, IGenericType<TGenericType>
        {
            TGenericType retItem = null;

            if (type.IsGenericTypeDefinition)
            {
                string idnfName = type.GetTypeFullDisplayName();

                var asmbItem = GetAssemblyItem(
                    wka, type.Assembly);

                retItem = (TGenericType)asmbItem.TypesMap.GetOrAdd(
                    idnfName, name => genericTypeItemCoreFactory(wka, type, null));

                genericDef = retItem;
            }
            else
            {
                genericDef = genericTypeItemFactory(
                    wka, type.GetGenericTypeDefinition(),
                    out _);

                retItem = genericTypeItemCoreFactory(wka, type, genericDef);
            }

            return retItem;
        }

        private DelegateTypeItem LoadDelegateType(
            WorkArgs wka,
            Type type)
        {
            (var retType, var @params) = LoadDelegateTypeCore(
                wka, type, out var declaringType, out var isVoid);

            var retItem = new DelegateTypeItem(
                type, GetAssemblyItem(wka, type.Assembly))
            {
                ReturnType = retType,
                Params = @params,
                IsVoidDelegate = isVoid,
                DeclaringType = declaringType
            };

            return retItem;
        }

        private Tuple<Lazy<TypeItemCoreBase>, ReadOnlyDictionary<string, Lazy<TypeItemCoreBase>>> LoadDelegateTypeCore(
            WorkArgs wka,
            Type type,
            out Lazy<TypeItemCoreBase>? declaringType,
            out bool isVoidMethod)
        {
            declaringType = null;

            if (type.IsNested)
            {
                declaringType = new(() => LoadType(wka, type.DeclaringType!));
            }

            var invokeMethod = type.GetMethod("Invoke") ?? throw new InvalidOperationException(
                $"If type {type} were a delegate type, it would contain a method called 'Invoke'");

            var retTypeItem = new Lazy<TypeItemCoreBase>(() => LoadType(wka,
                invokeMethod!.ReturnType));

            isVoidMethod = type.GetTypeFullDisplayName(
                null) == ReflH.VoidType.FullName;

            var @params = invokeMethod.GetParameters().ToDictionary(
                param => param.Name,
                param => new Lazy<TypeItemCoreBase>(
                    () => LoadType(wka, param.ParameterType))).RdnlD();

            return Tuple.Create(retTypeItem, @params)!;
        }

        private GenericDelegateTypeItem LoadGenericDelegateType(
            WorkArgs wka,
            Type type,
            out GenericDelegateTypeItem genericDef) => LoadGenericTypeItem(
                wka, type, out genericDef,
                LoadGenericDelegateType,
                LoadGenericDelegateTypeCore);

        private GenericDelegateTypeItem LoadGenericDelegateTypeCore(
            WorkArgs wka,
            Type type,
            GenericDelegateTypeItem? genericDef)
        {
            (var retType, var @params) = LoadDelegateTypeCore(
                wka, type, out var declaringType, out var isVoid);

            var retItem = new GenericDelegateTypeItem(
                type, GetAssemblyItem(wka, type.Assembly))
            {
                ReturnType = retType,
                Params = @params,
                IsVoidDelegate = isVoid,
                DeclaringType = declaringType,
                GenericArgs = GetGenericTypeArgs(
                    wka, type.GetGenericArguments(),
                    type, t => t, null),
                GenericDef = genericDef
            };

            return retItem;
        }

        private GenericTypeItem LoadGenericType(
            WorkArgs wka,
            Type type,
            out GenericTypeItem genericTypeDef) => LoadGenericTypeItem(
                wka, type, out genericTypeDef,
                LoadGenericType,
                LoadGenericTypeCore);

        private GenericTypeItem LoadGenericTypeCore(
            WorkArgs wka,
            Type type,
            GenericTypeItem? genericTypeDef)
        {
            GenericTypeItem retItem = null;

            retItem = new GenericTypeItem(
                type, GetAssemblyItem(
                    wka, type.Assembly))
            {
                GenericArgs = GetGenericTypeArgs(
                    wka, type.GetGenericArguments(),
                    type, t => t, null),
                GenericDef = genericTypeDef,
                TypeData = GetTypeDataLazy(
                    wka, () => retItem, type),
                DeclaringType = type.DeclaringType?.With(
                    declaringType => new Lazy<TypeItemCoreBase>(() => LoadType(wka, declaringType)))
            };

            return retItem;
        }

        private TypeItemCoreBase LoadRegularType(
            WorkArgs wka,
            Type type)
        {
            string idnfName = type.GetTypeFullDisplayName();

            var asmbItem = GetAssemblyItem(
                wka, type.Assembly);

            var retItem = asmbItem.TypesMap.GetOrAdd(
                idnfName, name => LoadRegularTypeCore(wka, type));

            return retItem;
        }

        private TypeItemCoreBase LoadRegularTypeCore(
            WorkArgs wka,
            Type type)
        {
            RegularTypeItem retItem = null;

            retItem = new RegularTypeItem(
                type, GetAssemblyItem(wka, type.Assembly))
            {
                TypeData = GetTypeDataLazy(
                    wka, () => retItem, type),
                DeclaringType = type.DeclaringType?.With(
                    declaringType => new Lazy<TypeItemCoreBase>(() => LoadType(
                        wka, declaringType)))
            };

            return retItem;
        }
    }
}

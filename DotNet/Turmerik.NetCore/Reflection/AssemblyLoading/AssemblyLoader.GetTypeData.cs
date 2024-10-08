using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public partial class AssemblyLoader
    {
        private Lazy<TypeData> GetTypeDataLazy(
            WorkArgs wka,
            Func<TypeItemCoreBase> retItemFactory,
            Type type) => new Lazy<TypeData>(() => new TypeData(
                wka.Opts.LoadPubInstnGetProps switch
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
                        }).ToList(),
                    _ => null
                },
                wka.Opts.LoadPubInstnMethods switch
                {
                    true => type.GetMethods(
                        BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public).Where(
                            method => !method.IsSpecialName).Select(
                            method =>
                            {
                                var isVoidMethod = type.GetTypeFullDisplayName(
                                    null) == ReflH.VoidType.FullName;

                                var returnType = new Lazy<TypeItemCoreBase>(
                                    () => LoadType(wka, method.ReturnType));

                                var @params = method.GetParameters().Where(
                                    param => param.Name != null).ToDictionary(
                                    param => param.Name!, param => new Lazy<TypeItemCoreBase>(
                                        () => LoadType(wka, param.ParameterType))).RdnlD();

                                var retObj = method.IsGenericMethod switch
                                {
                                    true => new GenericMethodItem(method, method.Name)
                                    {
                                        IsStatic = false,
                                        IsVoidMethod = isVoidMethod,
                                        ReturnType = returnType,
                                        Params = @params,
                                        GenericArgs = GetGenericTypeArgs(
                                            wka, method.GetGenericArguments(),
                                            method, m => m.DeclaringType, null)
                                    },
                                    false => new MethodItem(method, method.Name)
                                    {
                                        IsStatic = false,
                                        IsVoidMethod = isVoidMethod,
                                        ReturnType = returnType,
                                        Params = @params
                                    }
                                };

                                return retObj;
                            }).ToList(),
                    _ => null
                })
            {
                BaseType = type.BaseType?.With(baseType => new Lazy<TypeItemCoreBase>(
                    () => LoadType(wka, baseType))),
                InterfaceTypes = type.GetDistinctInterfaces().SelectTypes().Select(
                        intf => new Lazy<TypeItemCoreBase>(
                            () => LoadType(wka, intf))).ToList(),
                IsConstructedGenericType = type.IsConstructedGenericType,
                IsGenericMethodParameter = type.IsGenericMethodParameter,
                IsGenericParameter = type.IsGenericParameter,
                IsGenericTypeDefinition = type.IsGenericTypeDefinition,
                IsGenericTypeParameter = type.IsGenericTypeParameter,
                IsInterface = type.IsInterface,
                IsValueType = type.IsValueType,
            });

        private ReadOnlyCollection<Lazy<GenericTypeArg>> GetGenericTypeArgs<TItemInfo>(
            WorkArgs wka,
            Type[] genericArgs,
            TItemInfo itemInfo,
            Func<TItemInfo, Type> declaringTypeFactory,
            TypeItemCoreBase? declaringType) => genericArgs.Select(
                arg => new Lazy<GenericTypeArg>(() => arg.IsGenericTypeParameter switch
                {
                    true => new GenericTypeArg
                    {
                        Param = new GenericTypeParameter(arg)
                        {
                            GenericParamPosition = arg.GenericParameterPosition,
                            ParamConstraints = arg.GetGenericParameterConstraints().With(
                                constraintsArr => GetGenericTypeParamConstraints(
                                    wka, arg, constraintsArr)),
                        },
                        DeclaringType = declaringType ?? LoadType(wka, arg.DeclaringType!),
                        BelongsToDeclaringType = declaringTypeFactory(itemInfo) == arg.DeclaringType
                    },
                    false => new GenericTypeArg
                    {
                        TypeArg = arg.IsGenericTypeParameter switch
                        {
                            false => LoadType(wka, arg),
                            _ => null
                        }
                    }
                })).RdnlC();

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
                genericTypeParamsCount => type => type.GetGenericArgs()?.Length == genericTypeParamsCount,
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
    }
}

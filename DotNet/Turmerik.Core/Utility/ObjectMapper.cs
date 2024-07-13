using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Collections.ObjectModel;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public interface IObjectMapper
    {
        TObj CreateWith<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr)
            where TObj : T;

        TObj CreateFrom<TObj>(
            TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr);
    }

    public class ObjectMapper : IObjectMapper
    {
        private readonly StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> typePropsMap;
        private readonly StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> writtableTypePropsMap;

        public ObjectMapper()
        {
            typePropsMap = new StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>>(
                type => type.GetProperties(
                BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy).RdnlC());

            writtableTypePropsMap = new StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>>(
                type => typePropsMap.Get(type).Where(
                propInfo => propInfo.CanWrite).RdnlC());
        }

        public TObj CreateWith<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr)
            where TObj : T
        {
            var basePubPropInfos = typePropsMap.Get(typeof(TObj));
            var pubPropInfos = writtableTypePropsMap.Get(typeof(TObj));
            var inputLambda = (LambdaExpression)constructorCallFunc;

            var firstInitializer = inputLambda.Body as MemberInitExpression;
            var constructorCall = firstInitializer?.NewExpression ?? (NewExpression)inputLambda.Body;

            var memberBindingsList = initializersArr.SelectMany(
                init => ((MemberInitExpression)init.Body).Bindings).ToList();

            if (firstInitializer != null)
            {
                memberBindingsList.AddRange(firstInitializer.Bindings);
            }

            var memberBindingsMap = memberBindingsList.ToDictionary(
                memberBinding => memberBinding.Member.Name,
                memberBinding => memberBinding);

            var propsToAdd = basePubPropInfos.Where(
                basePropInfo => !memberBindingsMap.Keys.Contains(basePropInfo.Name)).Select(
                basePropInfo => new PropInfosTuple(
                    basePropInfo,
                    pubPropInfos.SingleOrDefault(
                        propInfo => propInfo.Name == basePropInfo.Name))).Where(
                tuple => tuple.ObjProp != null).ToList();

            memberBindingsList.AddRange(propsToAdd.Select(
                tuple => Expression.Bind(
                    tuple.ObjProp, Expression.Constant(
                        tuple.BaseProp.GetValue(src)))));

            var memberInit = Expression.MemberInit(
                constructorCall, initializersArr.Select(
                    init => ((MemberInitExpression)init.Body).Bindings).Aggregate(
                    (a, b) => new ReadOnlyCollection<MemberBinding>(
                        memberBindingsList.ToArray())));

            var lambda = Expression.Lambda<Func<TObj>>(memberInit);
            var lambdaFunc = lambda.Compile();

            var instance = lambdaFunc();
            return instance;
        }

        public TObj CreateFrom<TObj>(
            TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr) => CreateWith<TObj, TObj>(
                src, constructorCallFunc, initializersArr);

        private readonly struct PropInfosTuple
        {
            public PropInfosTuple(
                PropertyInfo baseProp,
                PropertyInfo objProp)
            {
                BaseProp = baseProp;
                ObjProp = objProp;
            }

            public readonly PropertyInfo BaseProp { get; init; }
            public readonly PropertyInfo ObjProp { get; init; }
        }
    }
}

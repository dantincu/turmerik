using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Collections.ObjectModel;
using Turmerik.Core.Helpers;
using Turmerik.Core.Reflection;

namespace Turmerik.Core.Utility
{
    public interface IObjectMapper
    {
        ObjectMapperOpts<T, TObj> Opts<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr)
            where TObj : T;

        ObjectMapperOpts<T, TObj> OptsW<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Tuple<NllblObjExprFactory<TObj>, bool>[] initializersArr)
            where TObj : T;

        ObjectMapperOpts<TObj, TObj> OptsF<TObj>(
            TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            params Tuple<NllblObjExprFactory<TObj>, bool>[] initializersArr);

        Tuple<NllblObjExprFactory<TObj>, bool> OptsTp<TObj>(
            NllblObjExprFactory<TObj> exprFactory,
            bool includeExpr);

        TObj CreateWith<T, TObj>(
            ObjectMapperOpts<T, TObj> opts)
            where TObj : T;

        TObj CreateWith<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr)
            where TObj : T;

        TObj CreateFrom<TObj>(
            TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr);

        TObj CreateFrom<TObj>(
            ObjectMapperOpts<TObj, TObj> opts);

        TObj Create<TObj>(
            Expression<Func<TObj>> constructorCallFunc,
            Func<ReadOnlyCollection<PropertyInfo>, ILambdaExprHelper<TObj>, Dictionary<PropertyInfo, object>>? propValuesMapFactory = null,
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>>? propValuesMapBuilder = null);

        Dictionary<PropertyInfo, object> AddPropValMappings<TObj>(
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>> builder,
            Dictionary<PropertyInfo, object>? propValMap = null);
    }

    public delegate Expression<Func<TObj>>? NllblObjExprFactory<TObj>();

    public class ObjectMapper : IObjectMapper
    {
        private readonly ILambdaExprHelperFactory lambdaExprHelperFactory;

        private readonly StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> typePropsMap;
        private readonly StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> writtableTypePropsMap;

        public ObjectMapper(
            ILambdaExprHelperFactory lambdaExprHelperFactory)
        {
            this.lambdaExprHelperFactory = lambdaExprHelperFactory ?? throw new ArgumentNullException(
                nameof(lambdaExprHelperFactory));

            typePropsMap = new StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>>(
                type => type.GetProperties(
                BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy).RdnlC());

            writtableTypePropsMap = new StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>>(
                type => typePropsMap.Get(type).Where(
                propInfo => propInfo.CanWrite).RdnlC());
        }

        public ObjectMapperOpts<T, TObj> Opts<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr)
            where TObj : T => new ObjectMapperOpts<T, TObj>(src, constructorCallFunc, initializersArr);

        public ObjectMapperOpts<T, TObj> OptsW<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Tuple<NllblObjExprFactory<TObj>, bool>[] initializersArr)
            where TObj : T => Opts(
                src, constructorCallFunc, initializersArr.Where(
                    tuple => tuple.Item2).Select(
                    tuple => tuple.Item1()!).ToArray());

        public ObjectMapperOpts<TObj, TObj> OptsF<TObj>(
            TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            params Tuple<NllblObjExprFactory<TObj>, bool>[] initializersArr) => OptsW(
                src, constructorCallFunc, initializersArr);

        public Tuple<NllblObjExprFactory<TObj>, bool> OptsTp<TObj>(
            NllblObjExprFactory<TObj> exprFactory,
            bool includeExpr) => Tuple.Create(exprFactory, includeExpr);

        public TObj CreateWith<T, TObj>(
            ObjectMapperOpts<T, TObj> opts)
            where TObj : T
        {
            var src = opts.Src;
            var constructorCallFunc = opts.ConstructorCallFunc;
            var initializersArr = opts.InitializersArr;

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

            var propsToAddList = basePubPropInfos.Where(
                basePropInfo => !memberBindingsMap.Keys.Contains(basePropInfo.Name)).Select(
                basePropInfo => new PropInfosTuple(
                    basePropInfo,
                    pubPropInfos.SingleOrDefault(
                        propInfo => propInfo.Name == basePropInfo.Name))).Where(
                tuple => tuple.ObjProp != null).ToList();

            foreach (var propToAdd in propsToAddList)
            {
                var propVal = propToAdd.BaseProp.GetValue(src);

                var memberBinding = Expression.Bind(
                    propToAdd.ObjProp, Expression.Constant(
                        propVal, propToAdd.ObjProp.PropertyType));

                memberBindingsList.Add(memberBinding);
            }

            var memberInit = Expression.MemberInit(
                constructorCall, memberBindingsList.ToArray());

            var lambda = Expression.Lambda<Func<TObj>>(memberInit);
            var lambdaFunc = lambda.Compile();

            var instance = lambdaFunc();
            return instance;
        }

        public TObj CreateWith<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr)
            where TObj : T => CreateWith(new ObjectMapperOpts<T, TObj>(
                src, constructorCallFunc, initializersArr));

        public TObj CreateFrom<TObj>(
            TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr) => CreateWith(
                src, constructorCallFunc, initializersArr);

        public TObj CreateFrom<TObj>(
            ObjectMapperOpts<TObj, TObj> opts) => CreateWith(opts);

        public TObj Create<TObj>(
            Expression<Func<TObj>> constructorCallFunc,
            Func<ReadOnlyCollection<PropertyInfo>, ILambdaExprHelper<TObj>, Dictionary<PropertyInfo, object>>? propValuesMapFactory = null,
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>>? propValuesMapBuilder = null)
        {
            var lambdaHelper = lambdaExprHelperFactory.GetHelper<TObj>();
            var pubPropInfos = writtableTypePropsMap.Get(typeof(TObj));
            var propValuesMap = propValuesMapFactory?.Invoke(pubPropInfos, lambdaHelper) ?? new ();
            propValuesMapBuilder?.Invoke(propValuesMap, lambdaHelper);

            var inputLambda = (LambdaExpression)constructorCallFunc;
            var firstInitializer = inputLambda.Body as MemberInitExpression;
            var constructorCall = firstInitializer?.NewExpression ?? (NewExpression)inputLambda.Body;

            var memberBindingsList = new List<MemberBinding>();

            if (firstInitializer != null)
            {
                memberBindingsList.AddRange(firstInitializer.Bindings);
            }

            memberBindingsList.AddRange(propValuesMap.Select(
                kvp => Expression.Bind(
                    kvp.Key, Expression.Constant(
                        kvp.Value))));

            var memberInit = Expression.MemberInit(
                constructorCall, memberBindingsList.ToArray());

            var lambda = Expression.Lambda<Func<TObj>>(memberInit);
            var lambdaFunc = lambda.Compile();

            var instance = lambdaFunc();
            return instance;
        }

        public Dictionary<PropertyInfo, object> AddPropValMappings<TObj>(
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>> builder,
            Dictionary<PropertyInfo, object>? propValMap = null)
        {
            propValMap ??= new();
            builder(propValMap, lambdaExprHelperFactory.GetHelper<TObj>());
            return propValMap;
        }

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

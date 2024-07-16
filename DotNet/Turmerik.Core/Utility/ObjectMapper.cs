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
    public interface IObjectMapperFactory
    {
        IObjectMapper<T, TObj> Mapper<T, TObj>() where TObj : T;
        IObjectMapper<TObj> Mapper<TObj>();
    }

    public interface IObjectMapper<T, TObj>
        where TObj : T
    {
        ObjectMapperOpts<T, TObj> Opts(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr);

        ObjectMapperOpts<T, TObj> OptsW(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Tuple<NllblObjExprFactory<TObj>, bool>[] initializersArr);

        Tuple<NllblObjExprFactory<TObj>, bool> OptsTp(
            NllblObjExprFactory<TObj> exprFactory,
            bool includeExpr);

        TObj CreateWith(
            ObjectMapperOpts<T, TObj> opts);

        TObj CreateWith(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr);

        TObj Create(
            Expression<Func<TObj>> constructorCallFunc,
            Func<ReadOnlyCollection<PropertyInfo>, ILambdaExprHelper<TObj>, Dictionary<PropertyInfo, object>>? propValuesMapFactory = null,
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>>? propValuesMapBuilder = null);

        Dictionary<PropertyInfo, object> AddPropValMappings(
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>> builder,
            Dictionary<PropertyInfo, object>? propValMap = null);
    }

    public interface IObjectMapper<TObj> : IObjectMapper<TObj, TObj>
    {
    }

    public delegate Expression<Func<TObj>>? NllblObjExprFactory<TObj>();

    public class ObjectMapperFactory : IObjectMapperFactory
    {
        private readonly ILambdaExprHelperFactory lambdaExprHelperFactory;

        private readonly StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> typePropsMap;
        private readonly StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> writtableTypePropsMap;

        public ObjectMapperFactory(
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

        public IObjectMapper<T, TObj> Mapper<T, TObj>(
            ) where TObj : T => new ObjectMapper<T, TObj>(
                lambdaExprHelperFactory,
                typePropsMap.Get(typeof(T)),
                writtableTypePropsMap.Get(typeof(TObj)));

        public IObjectMapper<TObj> Mapper<TObj>(
            ) => new ObjectMapper<TObj>(
                lambdaExprHelperFactory,
                typePropsMap.Get(typeof(TObj)),
                writtableTypePropsMap.Get(typeof(TObj)));
    }

    public class ObjectMapper<T, TObj> : IObjectMapper<T, TObj>
        where TObj : T
    {
        private readonly ILambdaExprHelperFactory lambdaExprHelperFactory;

        private readonly ReadOnlyCollection<PropertyInfo> typePropsCollctn;
        private readonly ReadOnlyCollection<PropertyInfo> writtableTypePropsCollctn;

        public ObjectMapper(
            ILambdaExprHelperFactory lambdaExprHelperFactory,
            ReadOnlyCollection<PropertyInfo> typePropsMap,
            ReadOnlyCollection<PropertyInfo> writtableTypePropsMap)
        {
            this.lambdaExprHelperFactory = lambdaExprHelperFactory ?? throw new ArgumentNullException(
                nameof(lambdaExprHelperFactory));

            this.typePropsCollctn = typePropsMap ?? throw new ArgumentNullException(
                nameof(typePropsMap));

            this.writtableTypePropsCollctn = writtableTypePropsMap ?? throw new ArgumentNullException(
                nameof(writtableTypePropsMap));
        }

        public ObjectMapperOpts<T, TObj> Opts(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr) => new ObjectMapperOpts<T, TObj>(
                src, constructorCallFunc, initializersArr);

        public ObjectMapperOpts<T, TObj> OptsW(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Tuple<NllblObjExprFactory<TObj>, bool>[] initializersArr) => Opts(
                src, constructorCallFunc, initializersArr.Where(
                    tuple => tuple.Item2).Select(
                    tuple => tuple.Item1()!).ToArray());

        public Tuple<NllblObjExprFactory<TObj>, bool> OptsTp(
            NllblObjExprFactory<TObj> exprFactory,
            bool includeExpr) => Tuple.Create(exprFactory, includeExpr);

        public TObj CreateWith(
            ObjectMapperOpts<T, TObj> opts)
        {
            var src = opts.Src;
            var constructorCallFunc = opts.ConstructorCallFunc;
            var initializersArr = opts.InitializersArr;

            var basePubPropInfos = typePropsCollctn;
            var pubPropInfos = writtableTypePropsCollctn;
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

        public TObj CreateWith(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            params Expression<Func<TObj>>[] initializersArr) => CreateWith(new ObjectMapperOpts<T, TObj>(
                src, constructorCallFunc, initializersArr));

        public TObj Create(
            Expression<Func<TObj>> constructorCallFunc,
            Func<ReadOnlyCollection<PropertyInfo>, ILambdaExprHelper<TObj>, Dictionary<PropertyInfo, object>>? propValuesMapFactory = null,
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>>? propValuesMapBuilder = null)
        {
            var lambdaHelper = lambdaExprHelperFactory.GetHelper<TObj>();
            var pubPropInfos = writtableTypePropsCollctn;
            var propValuesMap = propValuesMapFactory?.Invoke(pubPropInfos, lambdaHelper) ?? new();
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

        public Dictionary<PropertyInfo, object> AddPropValMappings(
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>> builder,
            Dictionary<PropertyInfo, object>? propValMap = null)
        {
            propValMap ??= new();
            builder(propValMap, lambdaExprHelperFactory.GetHelper<TObj>());
            return propValMap;
        }

        protected readonly struct PropInfosTuple
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

    public class ObjectMapper<TObj> : ObjectMapper<TObj, TObj>, IObjectMapper<TObj>
    {
        public ObjectMapper(
            ILambdaExprHelperFactory lambdaExprHelperFactory,
            ReadOnlyCollection<PropertyInfo> typePropsMap,
            ReadOnlyCollection<PropertyInfo> writtableTypePropsMap) : base(
                lambdaExprHelperFactory,
                typePropsMap,
                writtableTypePropsMap)
        {
        }
    }
}

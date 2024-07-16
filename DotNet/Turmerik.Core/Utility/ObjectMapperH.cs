using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public static class ObjectMapperH
    {
        public static IObjectMapper<TObj> ObjMppr<TObj>(
            this IComponentCore component) =>
                component.ObjMapperFactory.Mapper<TObj>();

        public static IObjectMapper<T, TObj> ObjMppr<T, TObj>(
            this IComponentCore component)
            where TObj : T => component.ObjMapperFactory.Mapper<T, TObj>();

        public static TObj WtObjMppr<TObj>(
            this IComponentCore component,
            TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            Func<TObj, Expression<Func<TObj>>, IObjectMapper<TObj>, ObjectMapperOpts<TObj, TObj>> optsFactory)
                => component.ObjMapperFactory.Mapper<TObj>().With(
                    mppr => optsFactory(src, constructorCallFunc, mppr).With(
                        mpprOpts => mppr.CreateWith(mpprOpts)));

        public static TObj WtObjMppr<T, TObj>(
            this IComponentCore component,
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            Func<T, Expression<Func<TObj>>, IObjectMapper<T, TObj>, ObjectMapperOpts<T, TObj>> optsFactory)
            where TObj : T => component.ObjMapperFactory.Mapper<T, TObj>().With(
                mppr => optsFactory(src, constructorCallFunc, mppr).With(
                    mpprOpts => mppr.CreateWith(mpprOpts)));
    }
}

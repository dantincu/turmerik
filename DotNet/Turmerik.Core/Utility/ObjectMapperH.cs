using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq.Expressions;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public static class ObjectMapperH
    {
        public static IObjectMapper<TObj> ObjMppr<TObj>(
            this IObjectMapperFactory objMapperFactory) =>
                objMapperFactory.Mapper<TObj>();

        public static IObjectMapper<T, TObj> ObjMppr<T, TObj>(
            this IObjectMapperFactory objMapperFactory)
            where TObj : T => objMapperFactory.Mapper<T, TObj>();

        public static TObj MapObj<TObj>(
            this IObjectMapperFactory objectMapperFactory, TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            Func<TObj, Expression<Func<TObj>>, IObjectMapper<TObj>, ObjectMapperOpts<TObj, TObj>> optsFactory)
                => objectMapperFactory.Mapper<TObj>().With(
                    mppr => optsFactory(src, constructorCallFunc, mppr).With(
                        mpprOpts => mppr.Create(mpprOpts)));

        public static TObj MapObj<T, TObj>(
            this IObjectMapperFactory objectMapperFactory, T src,
            Expression<Func<TObj>> constructorCallFunc,
            Func<T, Expression<Func<TObj>>, IObjectMapper<T, TObj>, ObjectMapperOpts<T, TObj>> optsFactory)
            where TObj : T => objectMapperFactory.Mapper<T, TObj>().With(
                mppr => optsFactory(src, constructorCallFunc, mppr).With(
                    mpprOpts => mppr.Create(mpprOpts)));
    }
}

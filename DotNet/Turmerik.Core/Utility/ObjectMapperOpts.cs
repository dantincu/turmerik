using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Turmerik.Core.Utility
{
    public class ObjectMapperOpts<T, TObj>
        where TObj : T
    {
        public ObjectMapperOpts(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            Expression<Func<TObj>>[] initializersArr)
        {
            Src = src;
            ConstructorCallFunc = constructorCallFunc ?? throw new ArgumentNullException(nameof(constructorCallFunc));
            InitializersArr = initializersArr ?? throw new ArgumentNullException(nameof(initializersArr));
        }

        public T Src { get; }
        public Expression<Func<TObj>> ConstructorCallFunc { get; }
        public Expression<Func<TObj>>[] InitializersArr { get; }
    }
}

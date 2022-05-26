using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Turmerik.Core.Collections.Cache;
using Turmerik.Core.Reflection.Wrappers;

namespace Turmerik.Core.Components
{
    public interface ITypesStaticDataCache : IStaticDataCache<Type, TypeWrapper>
    {
        TypeWrapper Get<T>();
        TResult GetFromType<TResult>(Type type, Func<TypeWrapper, TResult> factory);
        TResult GetFromType<T, TResult>(Func<TypeWrapper, TResult> factory);
        TypeWrapper GetGenericTypeDef(Type type, bool isRequired = false);
        TypeWrapper GetGenericTypeDef<T>(bool isRequired = false);
    }

    public class TypesStaticDataCache : StaticDataCache<Type, TypeWrapper>, ITypesStaticDataCache
    {
        public TypesStaticDataCache() : base(
                type => new TypeWrapper(type))
        {
        }

        public TypeWrapper Get<T>()
        {
            var wrapper = Get(typeof(T));
            return wrapper;
        }

        public TResult GetFromType<TResult>(Type type, Func<TypeWrapper, TResult> factory)
        {
            var wrapper = Get(type);
            var result = factory(wrapper);

            return result;
        }

        public TResult GetFromType<T, TResult>(Func<TypeWrapper, TResult> factory)
        {
            var result = GetFromType(typeof(T), factory);
            return result;
        }

        public TypeWrapper GetGenericTypeDef(Type type, bool isRequired = false)
        {
            TypeWrapper wrapper = null;
            var genericTypeDef = Get(type).GenericTypeDef.Value;

            if (genericTypeDef != null)
            {
                wrapper = Get(genericTypeDef);
            }
            else if (isRequired)
            {
                throw new InvalidOperationException(
                    $"Provided type {type.FullName} is not a generic type, while the provided flag {isRequired} is set to true");
            }

            return wrapper;
        }

        public TypeWrapper GetGenericTypeDef<T>(bool isRequired = false)
        {
            var wrapper = GetGenericTypeDef(typeof(T), isRequired);
            return wrapper;
        }
    }
}

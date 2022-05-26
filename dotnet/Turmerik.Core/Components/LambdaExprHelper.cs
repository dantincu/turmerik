using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace Turmerik.Core.Components
{
    public interface ILambdaExprHelperFactory
    {
        ILambdaExprHelper<TSource> GetHelper<TSource>();
    }

    public interface ILambdaExprHelper<TSource>
    {
        PropertyInfo Prop<TProperty>(
            Expression<Func<TSource, TProperty>> propertyLambda,
            Type type = null, bool checkReflectedType = false);

        string Name<TProperty>(
            Expression<Func<TSource, TProperty>> propertyLambda,
            Type type = null, bool checkReflectedType = false);

        MethodInfo Method<TProperty>(Expression<Func<TSource, TProperty>> methodLambda,
            Type type = null, bool checkReflectedType = false);

        string MethodName<TProperty>(Expression<Func<TSource, TProperty>> methodLambda,
            Type type = null, bool checkReflectedType = false);
    }

    public class LambdaExprHelper<TSource> : ILambdaExprHelper<TSource>
    {
        public PropertyInfo Prop<TProperty>(
            Expression<Func<TSource, TProperty>> propertyLambda,
            Type type = null, bool checkReflectedType = false)
        {
            type = type ?? typeof(TSource);

            MemberExpression member = propertyLambda.Body as MemberExpression;
            ThrowErrIfReq(() => member == null, propertyLambda);

            PropertyInfo propInfo = member.Member as PropertyInfo;
            ThrowErrIfReq(() => propInfo == null, propertyLambda);

            ThrowErrIfReq(
                () => checkReflectedType && !propInfo.ReflectedType.IsAssignableFrom(type),
                propertyLambda,
                () => string.Format(
                    "Expression '{0}' refers to a property that is not from type {1}.",
                    propertyLambda.ToString(),
                    type));

            return propInfo;
        }

        public string Name<TProperty>(
            Expression<Func<TSource, TProperty>> propertyLambda,
            Type type = null, bool checkReflectedType = false)
        {
            PropertyInfo propInfo = Prop(propertyLambda, type, checkReflectedType);
            string name = propInfo.Name;

            return name;
        }

        public MethodInfo Method<TProperty>(Expression<Func<TSource, TProperty>> methodLambda, Type type = null, bool checkReflectedType = false)
        {
            type = type ?? typeof(TSource);

            MethodCallExpression member = methodLambda.Body as MethodCallExpression;
            ThrowErrIfReq(() => member == null, methodLambda);

            MethodInfo methodInfo = member.Method;
            ThrowErrIfReq(() => methodInfo == null, methodLambda);

            ThrowErrIfReq(
                () => checkReflectedType && !methodInfo.ReflectedType.IsAssignableFrom(type),
                methodLambda,
                () => string.Format(
                    "Expression '{0}' refers to a method that is not from type {1}.",
                    methodLambda.ToString(),
                    type));

            return methodInfo;
        }

        public string MethodName<TProperty>(Expression<Func<TSource, TProperty>> methodLambda, Type type = null, bool checkReflectedType = false)
        {
            MethodInfo methodInfo = Method(methodLambda, type, checkReflectedType);
            string name = methodInfo.Name;

            return name;
        }

        private static T ThrowErr<T, TProperty>(
            Expression<Func<TSource, TProperty>> propertyLambda,
            Func<string> messageFactory = null)
        {
            string message = messageFactory?.Invoke() ?? string.Format(
                "Expression '{0}' does not refer to a property.",
                propertyLambda.ToString());

            throw new ArgumentException(message);
        }

        private static void ThrowErrIfReq<TProperty>(
            Func<bool> condition,
            Expression<Func<TSource, TProperty>> propertyLambda,
            Func<string> messageFactory = null)
        {
            if (condition())
            {
                ThrowErr<object, TProperty>(
                    propertyLambda, messageFactory);
            }
        }
    }

    public class LambdaExprHelperFactory : ILambdaExprHelperFactory
    {
        public ILambdaExprHelper<TSource> GetHelper<TSource>()
        {
            var helper = new LambdaExprHelper<TSource>();
            return helper;
        }
    }
}

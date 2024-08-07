using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Dependencies
{
    public interface IPropertyInjector
    {
        void InjectSvc(
            PropertyInjectorArgs args);

        void InjectAllSvcs(
            PropertyInjectorAggArgs args);
    }

    public class InjectSvcAttribute : Attribute
    {
    }

    public class PropertyInjectorArgs
    {
        public PropertyInjectorArgs(
            IServiceProvider svcProv,
            object component,
            Type componentType,
            PropertyInfo propInfo,
            Action<object, PropertyInfo, object> propSetter,
            Func<IServiceProvider, Type, object> reqSvcFactory = null)
        {
            this.SvcProv = svcProv ?? throw new ArgumentNullException(nameof(svcProv));
            this.Component = component ?? throw new ArgumentNullException(nameof(component));
            this.ComponentType = componentType ?? throw new ArgumentNullException(nameof(componentType));
            this.PropInfo = propInfo ?? throw new ArgumentNullException(nameof(propInfo));
            this.PropSetter = propSetter ?? throw new ArgumentNullException(nameof(propSetter));
            this.ReqSvcFactory = reqSvcFactory;
        }

        public IServiceProvider SvcProv { get; init; }
        public object Component { get; init; }
        public Type ComponentType { get; init; }
        public PropertyInfo PropInfo { get; init; }
        public Action<object, PropertyInfo, object> PropSetter { get; init; }
        public Func<IServiceProvider, Type, object> ReqSvcFactory { get; init; }
    }

    public class PropertyInjectorAggArgs
    {
        public PropertyInjectorAggArgs(
            IServiceProvider svcProv,
            object component,
            Type componentType,
            Action<object, PropertyInfo, object> propSetter,
            Func<IServiceProvider, Type, object> reqSvcFactory = null)
        {
            this.SvcProv = svcProv ?? throw new ArgumentNullException(nameof(svcProv));
            this.Component = component ?? throw new ArgumentNullException(nameof(component));
            this.ComponentType = componentType ?? throw new ArgumentNullException(nameof(componentType));
            this.PropSetter = propSetter ?? throw new ArgumentNullException(nameof(propSetter));
            this.ReqSvcFactory = reqSvcFactory;
        }

        public IServiceProvider SvcProv { get; init; }
        public object Component { get; init; }
        public Type ComponentType { get; init; }
        public Action<object, PropertyInfo, object> PropSetter { get; init; }
        public Func<IServiceProvider, Type, object> ReqSvcFactory { get; init; }
    }

    public class PropertyInjector : IPropertyInjector
    {
        private StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> typesMap;

        public PropertyInjector()
        {
            typesMap = new StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>>(
                type => type.GetProperties(
                    BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.NonPublic).Where(
                        propInfo => propInfo.GetCustomAttribute<InjectSvcAttribute>() != null).ToArray().RdnlC());
        }

        public void InjectSvc(
            PropertyInjectorArgs args)
        {
            var propType = args.PropInfo.PropertyType;

            var reqSvcFactory = args.ReqSvcFactory.FirstNotNull(
                (svcProv, propType) => svcProv.GetRequiredService(propType));

            var svcInstn = reqSvcFactory(args.SvcProv, propType);

            args.PropSetter(args.Component, args.PropInfo, svcInstn);
        }

        public void InjectAllSvcs(
            PropertyInjectorAggArgs args)
        {
            var propInfosCllctn = typesMap.Get(
                args.ComponentType);

            foreach (var propInfo in propInfosCllctn)
            {
                InjectSvc(new PropertyInjectorArgs(
                    args.SvcProv,
                    args.Component,
                    args.ComponentType,
                    propInfo,
                    args.PropSetter,
                    args.ReqSvcFactory));
            }
        }
    }
}

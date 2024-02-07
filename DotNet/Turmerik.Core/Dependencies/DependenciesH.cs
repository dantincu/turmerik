using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Dependencies
{
    public static class DependenciesH
    {
        public static Func<IServiceCollection, bool> NormalizeSvcCondition(
            Func<IServiceCollection, bool> condition,
            Type implementationType = null)
        {
            if (condition == null)
            {
                if (implementationType == null)
                {
                    condition = svcs => true;
                }
                else
                {
                    condition = svcs => svcs.None(
                        descriptor => descriptor.ImplementationType == implementationType);
                }
            }

            return condition;
        }

        public static IServiceCollection AddSvcIfReq<TService>(
            this IServiceCollection services,
            Func<IServiceProvider, TService> factory,
            DependencyLifetime? dependencyLifetime = null,
            Func<IServiceCollection, bool> condition = null)
            where TService : class
        {
            if (NormalizeSvcCondition(condition).Invoke(services))
            {
                AddSvc(services, factory,
                    dependencyLifetime);
            }

            return services;
        }

        public static IServiceCollection AddSvcIfReq<TService, TImplementation>(
            this IServiceCollection services,
            DependencyLifetime? dependencyLifetime = null,
            Action<IServiceCollection> singletonCallback = null,
            Action<IServiceCollection> scopedCallback = null,
            Action<IServiceCollection> transientCallback = null,
            Func<IServiceCollection, bool> condition = null)
            where TService : class
            where TImplementation : class, TService
        {
            if (NormalizeSvcCondition(condition, typeof(TImplementation)).Invoke(services))
            {
                AddSvc<TService>(services,
                    singletonCallback.FirstNotNull(
                        svcs => svcs.AddSingleton<TService, TImplementation>()),
                    scopedCallback.FirstNotNull(
                        svcs => svcs.AddScoped<TService, TImplementation>()),
                    transientCallback.FirstNotNull(
                        svcs => svcs.AddTransient<TService, TImplementation>()),
                    dependencyLifetime);
            }

            return services;
        }

        public static IServiceCollection AddSvcIfReq<TService>(
            this IServiceCollection services,
            Action<IServiceCollection> singletonCallback,
            Action<IServiceCollection> scopedCallback,
            Action<IServiceCollection> transientCallback,
            DependencyLifetime? dependencyLifetime = null,
            Func<IServiceCollection, bool> condition = null)
        {
            if (NormalizeSvcCondition(condition).Invoke(services))
            {
                AddSvc<TService>(services,
                    singletonCallback,
                    scopedCallback,
                    transientCallback,
                    dependencyLifetime);
            }

            return services;
        }

        public static IServiceCollection AddSvc<TService>(
            this IServiceCollection services,
            Func<IServiceProvider, TService> factory,
            DependencyLifetime? dependencyLifetime = null)
            where TService : class => AddSvc<TService>(
                services,
                svcs => svcs.AddSingleton(factory),
                svcs => svcs.AddScoped(factory),
                svcs => svcs.AddTransient(factory),
                dependencyLifetime);

        public static IServiceCollection AddSvc<TService, TImplementation>(
            this IServiceCollection services,
            DependencyLifetime? dependencyLifetime = null,
            Action<IServiceCollection> singletonCallback = null,
            Action<IServiceCollection> scopedCallback = null,
            Action<IServiceCollection> transientCallback = null)
            where TService : class
            where TImplementation : class, TService => services.AddSvc<TService>(
                singletonCallback.FirstNotNull(
                    svcs => svcs.AddSingleton<TService, TImplementation>()),
                scopedCallback.FirstNotNull(
                    svcs => svcs.AddScoped<TService, TImplementation>()),
                transientCallback.FirstNotNull(
                    svcs => svcs.AddTransient<TService, TImplementation>()),
                dependencyLifetime);

        public static IServiceCollection AddSvc<TService>(
            this IServiceCollection services,
            Action<IServiceCollection> singletonCallback,
            Action<IServiceCollection> scopedCallback,
            Action<IServiceCollection> transientCallback,
            DependencyLifetime? dependencyLifetime = null)
        {
            dependencyLifetime ??= DependencyLifetime.Singleton;

            switch (dependencyLifetime)
            {
                case DependencyLifetime.Transient:
                    transientCallback(services);
                    break;
                case DependencyLifetime.Scoped:
                    scopedCallback(services);
                    break;
                case DependencyLifetime.Singleton:
                    singletonCallback(services);
                    break;
                default:
                    throw new ArgumentException(
                        nameof(dependencyLifetime));
            }

            return services;
        }
    }
}

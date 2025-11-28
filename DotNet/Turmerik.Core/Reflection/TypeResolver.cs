using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Reflection
{
    public interface ITypeResolver
    {
        bool TryResolve(
            string typeName,
            string? assemblyName,
            out Type? type);
    }

    public class TypeResolver : ITypeResolver
    {
        private readonly IAssemblyFinder assemblyFinder;

        public TypeResolver(
            IAssemblyFinder assemblyFinder)
        {
            this.assemblyFinder = assemblyFinder ?? throw new ArgumentNullException(
                nameof(assemblyFinder));
        }

        public bool TryResolve(
            string typeName,
            string? assemblyName,
            out Type? type)
        {
            bool resolved = false;
            Type? matchingType = null;

            if (assemblyName != null)
            {
                assemblyFinder.FindAssembly(
                    (wrapper, _, _) => wrapper.Name.Name == assemblyName)?.ActWith(asmb =>
                    {
                        matchingType = asmb.Asmb.Value.GetType(typeName, false, false);
                    });
            }
            else
            {
                _ = assemblyFinder.FindAssembly((wrapper, _, _) =>
                {
                    bool retVal = typeName.StartsWith(
                        wrapper.Name.Name + ".");

                    if (retVal)
                    {
                        matchingType = wrapper.Asmb.Value.GetType(typeName, false, false);
                        retVal = matchingType != null;
                    }

                    return retVal;
                }) ?? assemblyFinder.FindAssembly((wrapper, _, _) =>
                {
                    matchingType = wrapper.Asmb.Value.GetType(typeName, false, false);
                    bool retVal = matchingType != null;
                    return retVal;
                });
            }

            resolved = matchingType != null;
            type = matchingType;

            return resolved;
        }
    }
}

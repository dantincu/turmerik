using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Utility.AssemblyLoading
{
    public class AssemblyLoaderInstnOpts<TData>
    {
        public Func<AssemblyLoader<TData>.WorkArgs, ParameterInfo, DotNetMethodParameter<TData>, TData> MethodParameterDataFactory { get; init; }
        public Func<AssemblyLoader<TData>.WorkArgs, ConstructorInfo, DotNetConstructor<TData>, TData> ConstructorDataFactory { get; init; }
        public Func<AssemblyLoader<TData>.WorkArgs, MethodInfo, DotNetMethod<TData>, TData> MethodDataFactory { get; init; }
        public Func<AssemblyLoader<TData>.WorkArgs, PropertyInfo, DotNetProperty<TData>, TData> PropertyDataFactory { get; init; }
        public Func<AssemblyLoader<TData>.WorkArgs, Type, AssemblyLoaderOpts<TData>.TypeOpts, DotNetType<TData>, TData> TypeDataFactory { get; init; }
        public Func<AssemblyLoader<TData>.WorkArgs, Assembly, DotNetAssembly<TData>, TData> AssemblyDataFactory { get; init; }
        public Func<AssemblyLoader<TData>.WorkArgs, Version, DotNetAssemblyVersion<TData>, TData> AssemblyVersionDataFactory { get; init; }
        public Func<AssemblyLoader<TData>.WorkArgs, AssemblyName, DotNetAssemblyName<TData>, TData> AssemblyNameDataFactory { get; init; }
    }
}

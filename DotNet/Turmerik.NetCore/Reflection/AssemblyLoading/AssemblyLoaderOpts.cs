using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public class AssemblyLoaderOpts
    {
        public AssemblyLoaderConfig Config { get; set; }
        public string[] AssemblyDirPaths { get; set; }
        public List<string> AllAssembliesFilePaths { get; set; }

        public bool? LoadAllTypes { get; set; }

        public bool? LoadPubInstnGetProps { get; set; }
        public bool? LoadPubInstnMethods { get; set; }

        public bool? TreatPrimitivesAsRegularObjects { get; set; }

        public List<AssemblyOpts> AssembliesToLoad { get; set; }

        public Func<TypeCustomDataArgs, object> TypeCustomDataFactory { get; set; }

        public class AssemblyOpts
        {
            public string AssemblyName { get; set; }
            public string AssemblyFilePath { get; set; }
            public bool? IsExecutable { get; set; }

            public bool? LoadAllTypes { get; set; }

            public List<TypeOpts> TypesToLoad { get; set; }
        }

        public class TypeOpts
        {
            public string FullTypeName { get; set; }
            public string TypeName { get; set; }
            public int? GenericTypeParamsCount { get; set; }
            public TypeOpts? DeclaringTypeOpts { get; set; }
        }

        public class TypeCustomDataArgs
        {
            public TypeItemBase TypeItem { get; init; }
            public string TypeName { get; init; }
            public string TypeIdnfName { get; init; }
            public string TypeFullIdnfName { get; init; }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public partial class ProgramComponent
    {
        public class WorkArgs
        {
            public WorkArgs(
                ProgramArgs pgArgs)
            {
                PgArgs = pgArgs ?? throw new ArgumentNullException(nameof(pgArgs));
            }

            public ProgramArgs PgArgs { get; init; }
        }

        public class SectionWorkArgs : WorkArgs
        {
            public SectionWorkArgs(
                WorkArgs src,
                ProgramConfig.ProfileSection section,
                Dictionary<string, AssemblyItem> asmbMap) : base(
                    src.PgArgs)
            {
                Section = section ?? throw new ArgumentNullException(nameof(section));
                AsmbMap = asmbMap ?? throw new ArgumentNullException(nameof(asmbMap));
            }

            public ProgramConfig.ProfileSection Section { get; init; }
            public Dictionary<string, AssemblyItem> AsmbMap { get; init; }
        }

        public class CsProjWorkArgs : SectionWorkArgs
        {
            public CsProjWorkArgs(
                SectionWorkArgs src,
                ProgramConfig.DotNetCsProject asmb) : base(
                    src,
                    src.Section,
                    src.AsmbMap)
            {
                Asmb = asmb ?? throw new ArgumentNullException(nameof(asmb));
            }

            public ProgramConfig.DotNetCsProject Asmb { get; init; }
        }

        public class CsProjAsmbWorkArgs : CsProjWorkArgs
        {
            public CsProjAsmbWorkArgs(
                CsProjWorkArgs src,
                KeyValuePair<string, AssemblyItem> asmbKvp) : base(
                src, src.Asmb)
            {
                AsmbKvp = asmbKvp;
            }

            public KeyValuePair<string, AssemblyItem> AsmbKvp { get; init; }
        }

        public class TypeWorkArgs : CsProjAsmbWorkArgs
        {
            public TypeWorkArgs(
                CsProjAsmbWorkArgs src,
                KeyValuePair<string, TypeItemCoreBase> typeKvp) : base(src, src.AsmbKvp)
            {
                TypeKvp = typeKvp;
            }

            public KeyValuePair<string, TypeItemCoreBase> TypeKvp { get; init; }
        }

        public class TsCodeWorkArgs : TypeWorkArgs
        {
            public TsCodeWorkArgs(
                TypeWorkArgs src,
                string shortTypeName,
                Dictionary<string, TypeItemCoreBase?>? typeNamesMap,
                Stack<List<string>>? identifierNames) : base(
                    src,
                    src.TypeKvp)
            {
                ShortTypeName = shortTypeName ?? throw new ArgumentNullException(nameof(shortTypeName));
                TypeNamesMap = typeNamesMap;
                IdentifierNamesStack = identifierNames;
            }

            public string ShortTypeName { get; init; }
            public Dictionary<string, TypeItemCoreBase?>? TypeNamesMap { get; init; }
            public Stack<List<string>>? IdentifierNamesStack { get; init; }

            public List<string> IdentifierNames => IdentifierNamesStack.Peek();

            public List<string> PushIdentifierNames()
            {
                var retList = new List<string>();
                IdentifierNamesStack!.Push(retList);
                return retList;
            }

            public List<string> PopIdentifierNames(
                ) => IdentifierNamesStack!.Pop();
        }

        public class TsIntfCodeWorkArgs : TsCodeWorkArgs
        {
            public TsIntfCodeWorkArgs(
                TsCodeWorkArgs src,
                List<string> codeLines,
                List<PropertyItem>? props,
                List<MethodItem>? methods) : base(
                    src,
                    src.ShortTypeName,
                    src.TypeNamesMap,
                    src.IdentifierNamesStack)
            {
                CodeLines = codeLines ?? throw new ArgumentNullException(
                    nameof(codeLines));

                Props = props;
                Methods = methods;
            }

            public List<string> CodeLines { get; }
            public List<PropertyItem>? Props { get; }
            public List<MethodItem>? Methods { get; }
        }
    }
}

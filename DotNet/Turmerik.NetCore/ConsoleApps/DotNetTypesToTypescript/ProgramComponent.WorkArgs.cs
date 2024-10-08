﻿using System;
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

        public class AsmbWorkArgs : SectionWorkArgs
        {
            public AsmbWorkArgs(
                SectionWorkArgs src,
                KeyValuePair<string, AssemblyItem> asmbKvp) : base(
                src, src.Section, src.AsmbMap)
            {
                AsmbKvp = asmbKvp;
            }

            public KeyValuePair<string, AssemblyItem> AsmbKvp { get; init; }
            public Dictionary<string, DotNetTypeData> TypesMap { get; init; }
        }

        public class TypeWorkArgs : AsmbWorkArgs
        {
            public TypeWorkArgs(
                AsmbWorkArgs src,
                KeyValuePair<string, DotNetTypeData> typeKvp) : base(src, src.AsmbKvp)
            {
                TypeKvp = typeKvp;
            }

            public KeyValuePair<string, DotNetTypeData> TypeKvp { get; init; }
        }

        public class TsCodeWorkArgs : TypeWorkArgs
        {
            public TsCodeWorkArgs(
                TypeWorkArgs src,
                List<string> tempTypeNames,
                Stack<List<string>> identifierNames) : base(
                    src,
                    src.TypeKvp)
            {
                TempTypeNames = tempTypeNames ?? throw new ArgumentNullException(
                    nameof(tempTypeNames));

                IdentifierNamesStack = identifierNames ?? throw new ArgumentNullException(
                    nameof(identifierNames));
            }

            public List<string> TempTypeNames { get; init; }
            public Stack<List<string>> IdentifierNamesStack { get; init; }

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
                List<string> codeLines) : base(
                    src,
                    src.TempTypeNames,
                    src.IdentifierNamesStack)
            {
                CodeLines = codeLines ?? throw new ArgumentNullException(
                    nameof(codeLines));
            }

            public List<string> CodeLines { get; }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.LocalDeviceEnv;
using System.Reflection;
using System.IO;
using System.Reflection.PortableExecutable;
using System.Reflection.Metadata;
using Turmerik.Core.Utility;
using Turmerik.NetCore.Utility;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramComponent
    {
        Task RunAsync(
            string[] rawArgs);

        Task RunAsync(
            ProgramArgs args);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IJsonConversion jsonConversion;
        private readonly ITextMacrosReplacer textMacrosReplacer;

        public ProgramComponent(
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IJsonConversion jsonConversion,
            ITextMacrosReplacer textMacrosReplacer)
        {
            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = programArgsRetriever.GetArgs(rawArgs);

            if (args.PrintHelpMessage != true)
            {
                programArgsNormalizer.NormalizeArgs(args);
                await RunAsync(args);
            }
        }

        public async Task RunAsync(ProgramArgs args)
        {
            var wka = GetWorkArgs(args);
            await RunAsync(wka);
        }

        private WorkArgs GetWorkArgs(
            ProgramArgs args)
        {
            var wka = new WorkArgs
            {
                PgArgs = args,
                CsProjAssemblies = [],
                ExternalAssemblies = []
            };

            return wka;
        }

        private async Task RunAsync(WorkArgs wka)
        {
            foreach (var section in wka.PgArgs.Sections)
            {
                foreach (var csProj in section.CsProjectsArr)
                {
                    var csProjAsmb = csProj.CsProjectAssembly;

                }
            }
        }

        private class WorkArgs
        {
            public ProgramArgs PgArgs { get; set; }

            public List<DotNetCsProjectAssembly> CsProjAssemblies { get; set; }
            public List<DotNetExternalAssembly> ExternalAssemblies { get; set; }

            public class DotNetAssembly
            {
                public Assembly AsmbObj { get; set; }
                public string Name { get; set; }
                public string TypeNamesPfx { get; set; }
                public string DestnDirPath { get; set; }

                public DotNetType[] TypesArr { get; set; }
            }

            public class DotNetExternalAssembly : DotNetAssembly
            {
            }

            public class DotNetCsProjectAssembly : DotNetAssembly
            {
                public bool? IsExecutable { get; set; }
                public bool? IncludeAllTypes { get; set; }
            }

            public class DotNetType
            {
                public Type TypeObj { get; set; }
                public string Name { get; set; }
                public string Namespace { get; set; }
                public string FullName { get; set; }
                public string[] RelNsPartsArr { get; set; }

                public DotNetType DeclaringType { get; set; }
            }
        }
    }
}

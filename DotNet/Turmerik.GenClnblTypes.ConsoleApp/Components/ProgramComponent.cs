using Acornima.Ast;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Code.CSharp.Components;
using Turmerik.Code.CSharp.Components.ClnblTypesCsCode;
using Turmerik.Core.Cloneables;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.GenClnblTypes.ConsoleApp.Components
{
    public class ProgramComponent
    {
        public const string GENERATED_CS_REGION_NAME_CORE = "GENERATED-CODE";
        public const string GENERATED_CS_REGION_NAME_TPL = GENERATED_CS_REGION_NAME_CORE + "-{0}";

        public static readonly string ClnblIntfAttrName = AttrH.GetAttrName(nameof(ClnblIntfAttribute));

        private readonly ProgramArgsRetriever programArgsRetriever;
        private readonly ProgramArgsNormalizer programArgsNormalizer;
        private readonly IClnblTypesCsCodeGenerator clnblTypesCsCodeGenerator;

        public ProgramComponent(
            ProgramArgsRetriever programArgsRetriever,
            ProgramArgsNormalizer programArgsNormalizer,
            IClnblTypesCsCodeGenerator clnblTypesCsCodeGenerator)
        {
            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.clnblTypesCsCodeGenerator = clnblTypesCsCodeGenerator ?? throw new ArgumentNullException(
                nameof(clnblTypesCsCodeGenerator));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = programArgsRetriever.GetArgs(rawArgs);
            programArgsNormalizer.NormalizeArgs(args);

            string csFilePath = Path.Combine(
                Environment.CurrentDirectory,
                args.CsFilePath);

            string csCode = File.ReadAllText(csFilePath);
            var tree = CSharpSyntaxTree.ParseText(csCode);

            var compilationUnit = clnblTypesCsCodeGenerator.Generate(new()
            {
                CompilationUnit = tree.GetRoot()
            }).CompilationUnit;

            csCode = compilationUnit.ToFullString();
            File.WriteAllText(csFilePath, csCode);
        }
    }
}

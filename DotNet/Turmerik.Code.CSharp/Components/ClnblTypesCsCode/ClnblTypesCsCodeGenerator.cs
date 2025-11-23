using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.Cloneables;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface IClnblTypesCsCodeGenerator
    {
        ClnblTypesCsCodeGeneratorOutput Generate(
            ClnblTypesCsCodeGeneratorOpts opts);
    }

    public class ClnblTypesCsCodeGeneratorOpts
    {
        public SyntaxNode CompilationUnit { get; set; }
    }

    public class ClnblTypesCsCodeGeneratorOutput
    {
        public SyntaxNode CompilationUnit { get; set; }
    }

    public class ClnblTypesCsCodeGenerator : IClnblTypesCsCodeGenerator
    {
        private readonly IClnblTypesCsCodeParser clnblTypesCsCodeParser;

        public ClnblTypesCsCodeGenerator(
            IClnblTypesCsCodeParser clnblTypesCsCodeParser)
        {
            this.clnblTypesCsCodeParser = clnblTypesCsCodeParser ?? throw new ArgumentNullException(
                nameof(clnblTypesCsCodeParser));
        }

        public ClnblTypesCsCodeGeneratorOutput Generate(
            ClnblTypesCsCodeGeneratorOpts opts)
        {
            var wka = new WorkArgs
            {
                Opts = opts,
                RootNode = opts.CompilationUnit,
            };

            clnblTypesCsCodeParser.Parse(wka);
            GenerateOutput(wka);
            return wka.Output;
        }

        private void GenerateOutput(
            WorkArgs wka)
        {
            var rootNodes = wka.RootNode.ChildNodes();

            wka.Output = new()
            {
                CompilationUnit = SyntaxFactory.CompilationUnit().WithMembers(
                        SyntaxFactory.List(rootNodes.OfType<MemberDeclarationSyntax>()))
                    .WithUsings(SyntaxFactory.List(rootNodes.OfType<UsingDirectiveSyntax>()))
                    .WithEndOfFileToken(((ITokenT)wka.Unit.ChildNodesOrTokens.Last()).GetNode())
            };
        }
    }
}

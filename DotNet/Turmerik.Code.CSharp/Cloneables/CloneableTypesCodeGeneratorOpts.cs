using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Code.CSharp.Utility;

namespace Turmerik.Code.CSharp.Cloneables
{
    public class CloneableTypesCodeGeneratorOpts
    {
        public CloneableTypesCodeGeneratorOpts()
        {
        }

        public CloneableTypesCodeGeneratorOpts(
            CloneableTypesCodeGeneratorOpts src)
        {
            CodeType = src.CodeType;
            InputCode = src.InputCode;
            InputDeclaredTypeName = src.InputDeclaredTypeName;
            StaticClassName = src.StaticClassName;
            ImmtblClassName = src.ImmtblClassName;
            MtblClassName = src.MtblClassName;
            MtblSuffix = src.MtblSuffix;
            ImmtblSuffix = src.ImmtblSuffix;
        }

        public CloneablesGeneratedCodeType CodeType { get; set; }
        public string InputCode { get; set; }
        public string InputDeclaredTypeName { get; set; }
        public CSharpTypeKind? InputDeclaredCSharpTypeKind { get; set; }
        public CloneableDataTypeKind? InputDeclaredTypeKind { get; set; }
        public string StaticClassName { get; set; }
        public string ImmtblClassName { get; set; }
        public string MtblClassName { get; set; }
        public string MtblSuffix { get; set; }
        public string ImmtblSuffix { get; set; }
    }
}

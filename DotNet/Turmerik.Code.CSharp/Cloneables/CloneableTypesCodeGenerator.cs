using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Code.CSharp.Cloneables
{
    public interface ICloneableTypesCodeGenerator
    {
        CloneableTypesCodeGeneratorOpts NormalizeOpts(
            CloneableTypesCodeGeneratorOpts opts);

        CloneableDataTypeKind GetCloneableDataTypeKind(
            CloneableTypesCodeGeneratorOpts opts,
            out string staticClassName);

        string GenerateCode(
            CloneableTypesCodeGeneratorOpts opts);

        string GetDeclaredTypeName(
            CloneableTypesCodeGeneratorOpts opts);

        string GetCloneableTypeName(
            CloneableTypesCodeGeneratorOpts opts,
            CloneableDataTypeKind targetDataTypeKind);
    }

    public class CloneableTypesCodeGenerator : ICloneableTypesCodeGenerator
    {
        public const string DEFAULT_MTBL_SUFFIX = "Mtbl";
        public const string DEFAULT_IMMTBL_SUFFIX = "Immtbl";

        public CloneableTypesCodeGeneratorOpts NormalizeOpts(
            CloneableTypesCodeGeneratorOpts opts)
        {
            opts = NormalizeOptsCore(opts);

            if (!opts.InputDeclaredTypeKind.HasValue)
            {
                opts.InputDeclaredTypeKind = GetCloneableDataTypeKind(
                    opts, out string staticClassName);

                opts.StaticClassName ??= staticClassName;
            }
            else
            {
                opts.InputDeclaredTypeName ??= GetDeclaredTypeName(opts);

                if (opts.StaticClassName == null)
                {
                    GetCloneableDataTypeKind(
                        opts, out string staticClassName);

                    opts.StaticClassName = staticClassName;
                }
            }

            return opts;
        }

        public CloneableDataTypeKind GetCloneableDataTypeKind(
            CloneableTypesCodeGeneratorOpts opts,
            out string staticClassName)
        {
            opts = NormalizeOptsCore(opts);
            opts.InputDeclaredTypeName ??= GetDeclaredTypeName(opts);

            CloneableDataTypeKind cloneableDataTypeKind;

            if (opts.InputDeclaredCSharpTypeKind == Utility.CSharpTypeKind.Interface)
            {
                cloneableDataTypeKind = CloneableDataTypeKind.Interface;
                staticClassName = opts.InputDeclaredTypeName;

                if (staticClassName.First() == 'I')
                {
                    staticClassName = staticClassName.Substring(1);
                }
            }
            else if (opts.InputDeclaredCSharpTypeKind == Utility.CSharpTypeKind.Class)
            {
                bool isImmtbl = opts.InputDeclaredTypeName.Contains(opts.ImmtblSuffix);
                bool isMtbl = opts.InputDeclaredTypeName.Contains(opts.MtblSuffix);

                if (isImmtbl && isMtbl)
                {
                    throw new ArgumentException(
                        $"Type {opts.InputDeclaredTypeName} contains both {opts.ImmtblSuffix} and {opts.MtblSuffix} suffixes");
                }
                else if (isImmtbl)
                {
                    cloneableDataTypeKind = CloneableDataTypeKind.ImmtblClass;

                    staticClassName = opts.InputDeclaredTypeName.Replace(
                        opts.ImmtblSuffix, string.Empty);
                }
                else if (isMtbl)
                {
                    cloneableDataTypeKind = CloneableDataTypeKind.MtblClass;

                    staticClassName = opts.InputDeclaredTypeName.Replace(
                        opts.MtblSuffix, string.Empty);
                }
                else
                {
                    cloneableDataTypeKind = default;
                    staticClassName = opts.InputDeclaredTypeName;
                }
            }
            else
            {
                throw new InvalidOperationException(
                    $"The input code should contain either an interface or a class definition");
            }

            return cloneableDataTypeKind;
        }

        public string GenerateCode(
            CloneableTypesCodeGeneratorOpts opts)
        {
            opts = NormalizeOpts(opts);
            throw new NotImplementedException();
        }

        public string GetDeclaredTypeName(
            CloneableTypesCodeGeneratorOpts opts)
        {
            opts = NormalizeOpts(opts);
            throw new NotImplementedException();
        }

        public string GetCloneableTypeName(
            CloneableTypesCodeGeneratorOpts opts,
            CloneableDataTypeKind targetDataTypeKind)
        {
            opts = NormalizeOpts(opts);
            string staticClassName = opts.StaticClassName;

            string? targetDataTypeName = targetDataTypeKind switch
            {
                CloneableDataTypeKind.Interface => $"I{staticClassName}",
                CloneableDataTypeKind.ImmtblClass => $"{staticClassName}{opts.ImmtblSuffix}",
                CloneableDataTypeKind.MtblClass => $"{staticClassName}{opts.MtblSuffix}",
                _ => staticClassName
            };

            return targetDataTypeName;
        }

        private CloneableTypesCodeGeneratorOpts NormalizeOptsCore(
            CloneableTypesCodeGeneratorOpts opts)
        {
            opts = new CloneableTypesCodeGeneratorOpts(opts);

            opts.MtblSuffix ??= DEFAULT_MTBL_SUFFIX;
            opts.ImmtblSuffix ??= DEFAULT_IMMTBL_SUFFIX;

            return opts;
        }
    }
}

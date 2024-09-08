using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing.IndexesFilter;
using Turmerik.Core.TextParsing;
using System.IO;
using Turmerik.Core.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramArgsNormalizer
    {
        void NormalizeArgs(
            ProgramArgs args);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.DotNetCsProject csProject);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.DotNetCsProject csProject,
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.DotNetCsProject csProject,
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly,
            ProgramConfig.DotNetType dotNetType);

        void NormalizeSrcDestnDirPaths(
            ProgramArgs args,
            ProgramConfig.SrcDestnPaths srcDestnPaths);

        void NormalizeSrcDestnDirPaths(
            ProgramArgs args,
            ProgramConfig.SrcDestnPaths srcDestnPaths,
            ProgramConfig.SrcDestnPaths prSrcDestnPaths);

        string? NormalizePathIfReq(
            ProgramArgs args,
            string? path);

        string GetDefaultAssemblyFileName(
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly);

        string GetDefaultAssemblyExtension(
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly);
    }

    public class ProgramArgsNormalizer : IProgramArgsNormalizer
    {
        public const string DESTN_CS_PROJECT_ASSEMBLIES_DIR_NAME = "csproj-asmb";
        public const string DESTN_EXTERNAL_ASSEMBLIES_DIR_NAME = "extern-asmb";
        public const string TYPES_NODE_DIR_NAME = "t";
        public const string TYPES_HCY_NODE_DIR_NAME = "h";
        public const string TYPES_INFO_DIR_NAME = "i";
        public const string TYPES_INFO_FILE_NAME = "types.json";

        public const decimal DF_NET_STD_VERSION = 2.0M;
        public const decimal DF_NET_CORE_VERSION = 8.0M;

        public static readonly string DfReleaseSrcBinsRelDirPath = Path.Combine(
            "bin", "Release");

        public static readonly string DfDebugSrcBinsRelDirPath = Path.Combine(
            "bin", "Debug");

        public const string DOTNET_STD_DF_SRC_BUILD_DIR_NAME = "netstandard{0:0.0#}";
        public const string DOTNET_DF_SRC_BUILD_DIR_NAME_FMT = "net{0:0.0#}";

        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IIdxesFilterParser idxesFilterParser;

        public ProgramArgsNormalizer(
            IProgramConfigRetriever programConfigRetriever,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IIdxesFilterParser idxesFilterParser)
        {
            this.programConfigRetriever = programConfigRetriever ?? throw new ArgumentNullException(
                nameof(programConfigRetriever));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.idxesFilterParser = idxesFilterParser ?? throw new ArgumentNullException(
                nameof(idxesFilterParser));
        }

        public void NormalizeArgs(
            ProgramArgs args)
        {
            NormalizeArgs(args, args.Profile);
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile)
        {
            profile.IsTurmerikAssemblyPredicate ??= Trmrk.IsTurmerikAssembly;
            profile.DestnCsProjectAssembliesDirName ??= DESTN_CS_PROJECT_ASSEMBLIES_DIR_NAME;
            profile.DestnExternalAssemblliesDirName ??= DESTN_EXTERNAL_ASSEMBLIES_DIR_NAME;
            profile.TypesNodeDirName ??= TYPES_NODE_DIR_NAME;
            profile.TypesHcyNodeDirName ??= TYPES_HCY_NODE_DIR_NAME;
            profile.TypesInfoDirName ??= TYPES_INFO_DIR_NAME;
            profile.TypesInfoFileName ??= TYPES_INFO_FILE_NAME;

            profile.DfSrcBinsRelDirPath ??= args.LoadDebugAssemblies switch
            {
                true => DfDebugSrcBinsRelDirPath,
                _ => DfReleaseSrcBinsRelDirPath
            };

            NormalizeSrcDestnDirPaths(args, profile.DirPaths);

            foreach (var section in args.Sections)
            {
                NormalizeArgs(args, profile, section);
            }
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section)
        {
            NormalizeSrcDestnDirPaths(args,
                section.DirPaths ??= new());

            section.DirPaths.SrcPath = PathH.AssurePathRooted(
                section.DirPaths.SrcPath ?? string.Empty,
                () => profile.DirPaths.SrcPath);

            section.DirPaths.DestnPath = PathH.AssurePathRooted(
                section.DirPaths.DestnPath ?? string.Empty,
                () => profile.DirPaths.DestnPath);

            section.DfSrcBinsRelDirPath ??= profile.DfSrcBinsRelDirPath;

            foreach (var csProj in section.CsProjectsArr)
            {
                NormalizeArgs(args, profile, section, csProj);
            }
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.DotNetCsProject csProject)
        {
            csProject.DirPaths ??= new();
            csProject.DirPaths.SrcPath ??= csProject.Name;

            csProject.DirPaths.DestnPath ??= Path.Combine(
                profile.DestnCsProjectAssembliesDirName,
                csProject.DirPaths.SrcPath);

            NormalizeSrcDestnDirPaths(args,
                csProject.DirPaths,
                section.DirPaths);

            csProject.SrcBinsRelDirPath ??= section.DfSrcBinsRelDirPath;
            csProject.IsDotNetStandard ??= false;

            csProject.DotNetVersionNumber ??= (csProject.IsDotNetStandard ?? false) switch
            {
                true => DF_NET_STD_VERSION,
                false => DF_NET_CORE_VERSION
            };

            csProject.SrcBuildRelDirPath ??= string.Concat((csProject.IsDotNetStandard ?? false) switch
            {
                true => string.Format(DOTNET_STD_DF_SRC_BUILD_DIR_NAME, csProject.DotNetVersionNumber),
                false => string.Format(DOTNET_DF_SRC_BUILD_DIR_NAME_FMT, csProject.DotNetVersionNumber),
            }, csProject.DotNetVersionSffx);

            csProject.SrcBuildDirPath ??= PathH.CombinePaths(
                [ csProject.DirPaths.SrcPath,
                csProject.SrcBinsRelDirPath,
                csProject.SrcBuildRelDirPath ]);

            if (args.IncludeAllTypes == true)
            {
                csProject.CsProjectAssembly.IncludeAllTypes = true;
            }

            NormalizeArgs(
                args,
                profile,
                section,
                csProject,
                csProject.CsProjectAssembly);
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.DotNetCsProject csProject,
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly)
        {
            dotNetAssembly.Name ??= csProject.Name;
            dotNetAssembly.TypeNamesPfx ??= $"{dotNetAssembly.Name}.";
            dotNetAssembly.Paths ??= new();

            dotNetAssembly.Paths.SrcPath = NormPathH.AssurePathIsRooted(
                dotNetAssembly.Paths.SrcPath ??= GetDefaultAssemblyFileName(dotNetAssembly),
                () => csProject.SrcBuildDirPath);

            dotNetAssembly.Paths.DestnPath = NormPathH.AssurePathIsRooted(
                dotNetAssembly.Paths.DestnPath ??= string.Empty,
                () => csProject.DirPaths.DestnPath);

            if (dotNetAssembly.TypesArr != null)
            {
                foreach (var dotNetType in dotNetAssembly.TypesArr)
                {
                    NormalizeArgs(
                        args,
                        profile,
                        section,
                        csProject,
                        dotNetAssembly,
                        dotNetType);
                }
            }
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.DotNetCsProject csProject,
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly,
            ProgramConfig.DotNetType dotNetType)
        {
            NormalizeType(dotNetAssembly, dotNetType);
            NormalizeSrcDestnDirPaths(args, dotNetAssembly.Paths);
        }

        public void NormalizeType(
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly,
            ProgramConfig.DotNetType dotNetType)
        {
            bool isNestedType = dotNetType.DeclaringType != null;

            if (isNestedType)
            {
                NormalizeType(
                    dotNetAssembly,
                    dotNetType.DeclaringType!);

                dotNetType.NestedTypesHcyArr = dotNetType.DeclaringType!.NestedTypesHcyArr?.AppendToArr(
                    dotNetType.DeclaringType.Name) ?? [dotNetType.DeclaringType.Name];
            }

            if (dotNetType.FullName != null)
            {
                string[] fullNameParts = dotNetType.FullName.Split('.');
                dotNetType.Name ??= fullNameParts.Last();

                if (dotNetType.Namespace == null)
                {
                    if (isNestedType)
                    {
                        dotNetType.Namespace = dotNetType.DeclaringType!.Namespace;
                    }
                    else
                    {
                        dotNetType.Namespace = fullNameParts.Take(
                            fullNameParts.Length - 1).ToArray().JoinStr(".");
                    }
                }
            }
            else
            {
                dotNetType.Name = dotNetType.Name ?? throw new ArgumentNullException(
                    nameof(dotNetType.Name));

                dotNetType.Namespace = dotNetType.Namespace ?? throw new ArgumentNullException(
                    nameof(dotNetType.Namespace));

                if (isNestedType)
                {
                    dotNetType.FullName = string.Join(".",
                        dotNetType.DeclaringType!.FullName,
                        dotNetType.Name);
                }
                else
                {
                    dotNetType.FullName = string.Join(".",
                        dotNetType.Namespace,
                        dotNetType.Name);
                }
            }

            if (dotNetType.RelNsPartsArr == null)
            {
                var @namespace = isNestedType switch
                {
                    true => dotNetType.DeclaringType!.FullName,
                    false => dotNetType.Namespace
                };

                if (@namespace.StartsWith(
                    dotNetAssembly.TypeNamesPfx))
                {
                    dotNetType.RelNsPartsArr = @namespace.Substring(
                        dotNetAssembly.TypeNamesPfx.Length).Split('.');
                }
                else
                {
                    throw new InvalidOperationException(
                        string.Join(" ",
                            "Fully qualified names of exported types must start with the name of the assembly where they are defined:",
                            $"Fully qualified name {dotNetType.FullName} should start with {dotNetAssembly.TypeNamesPfx}"));
                }
            }
        }

        public void NormalizeSrcDestnDirPaths(
            ProgramArgs args,
            ProgramConfig.SrcDestnPaths srcDestnPaths)
        {
            srcDestnPaths.SrcPath = NormalizePathIfReq(
                args, srcDestnPaths.SrcPath)!;

            srcDestnPaths.DestnPath = NormalizePathIfReq(
                args, srcDestnPaths.DestnPath)!;
        }

        public void NormalizeSrcDestnDirPaths(
            ProgramArgs args,
            ProgramConfig.SrcDestnPaths srcDestnPaths,
            ProgramConfig.SrcDestnPaths prSrcDestnPaths)
        {
            NormalizeSrcDestnDirPaths(args, srcDestnPaths);

            srcDestnPaths.SrcPath = NormPathH.AssurePathIsRooted(
                srcDestnPaths.SrcPath, () => prSrcDestnPaths.SrcPath);

            srcDestnPaths.DestnPath = NormPathH.AssurePathIsRooted(
                srcDestnPaths.DestnPath, () => prSrcDestnPaths.DestnPath);
        }

        public string? NormalizePathIfReq(
            ProgramArgs args,
            string? path)
        {
            if (path != null)
            {
                path = textMacrosReplacer.ReplaceMacros(
                    new TextMacrosReplacerOpts
                    {
                        InputText = path,
                        MacrosMap = args.LocalDevicePathsMap.GetPathsMap(),
                    });
            }

            return path;
        }

        public string GetDefaultAssemblyFileName(
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly)
        {
            var extn = GetDefaultAssemblyExtension(
                dotNetAssembly);

            string fileName = $"{dotNetAssembly.Name}.{extn}";
            return fileName;
        }

        public string GetDefaultAssemblyExtension(
            ProgramConfig.DotNetCsProjectAssembly dotNetAssembly) => dotNetAssembly.IsExecutable switch
            {
                true => "exe",
                _ => "dll"
            };
    }
}

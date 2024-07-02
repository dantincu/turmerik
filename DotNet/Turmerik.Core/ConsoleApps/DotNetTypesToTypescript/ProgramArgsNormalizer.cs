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

namespace Turmerik.Core.ConsoleApps.DotNetTypesToTypescript
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

        string GetDefaultTsRelFilePath(
            ProgramArgs args,
            ProgramConfig.DotNetType dotNetType);
    }

    public class ProgramArgsNormalizer : IProgramArgsNormalizer
    {
        public const string DESTN_CS_PROJECT_ASSEMBLIES_DIR_NAME = "csproj-asmb";
        public const string DESTN_EXTERNAL_ASSEMBLIES_DIR_NAME = "extern-asmb";
        public const string TYPES_DIR_NAME = "tn";
        public const string TYPES_HCY_DIR_NAME = "hn";
        public const string TYPES_INFO_DIR_NAME = "i";

        public static readonly string DfSrcBinsRelDirPath = Path.Combine(
            "bin", "Release");

        public static readonly string DfSrcBuildRelDirPath = Path.Combine(
            "net8.0");

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
            profile.DestnCsProjectAssembliesDirName ??= DESTN_CS_PROJECT_ASSEMBLIES_DIR_NAME;
            profile.DestnExternalAssemblliesDirName ??= DESTN_EXTERNAL_ASSEMBLIES_DIR_NAME;
            profile.TypesDirName ??= TYPES_DIR_NAME;
            profile.TypesHcyDirName ??= TYPES_HCY_DIR_NAME;
            profile.TypesInfoDirName ??= TYPES_INFO_DIR_NAME;
            profile.DfSrcBinsRelDirPath ??= DfSrcBinsRelDirPath;
            profile.DfSrcBuildRelDirPath ??= DfSrcBuildRelDirPath;

            NormalizeSrcDestnDirPaths(args,
                section.DirPaths ??= new());

            section.DirPaths.SrcPath = PathH.AssurePathRooted(
                section.DirPaths.SrcPath,
                () => profile.DirPaths.SrcPath);

            section.DfSrcBinsRelDirPath ??= profile.DfSrcBinsRelDirPath;
            section.DfSrcBuildRelDirPath ??= profile.DfSrcBuildRelDirPath;

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
            csProject.SrcBuildRelDirPath ??= section.DfSrcBuildRelDirPath;

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
            dotNetAssembly.Paths.SrcPath ??= GetDefaultAssemblyFileName(dotNetAssembly);

            dotNetAssembly.Paths.DestnPath ??= dotNetAssembly.Name;
            NormalizeSrcDestnDirPaths(args, dotNetAssembly.Paths, csProject.DirPaths);

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
            dotNetType.FullName = dotNetType.FullName ?? throw new ArgumentNullException(
                nameof(dotNetType.FullName));

            if (dotNetType.FullName.StartsWith(dotNetAssembly.TypeNamesPfx))
            {
                dotNetType.RelNsPartsArr = dotNetType.FullName.Substring(
                    dotNetAssembly.TypeNamesPfx.Length).Split('.').With(
                    arr => arr.Take(arr.Length - 1).ToArray());
            }
            else
            {
                throw new InvalidOperationException(string.Join(" ",
                    "Fully qualified names of exported types must start with the name of the assembly where they are defined:",
                    $"Fully qualified name {dotNetType.FullName} should start with {dotNetAssembly.TypeNamesPfx}"));
            }

            dotNetType.FilePaths ??= new();
            dotNetType.FilePaths.SrcPath ??= dotNetAssembly.Paths.SrcPath;
            dotNetType.FilePaths.DestnPath ??= GetDefaultTsRelFilePath(args, dotNetType);
            NormalizeSrcDestnDirPaths(args, dotNetAssembly.Paths);

            dotNetType.FilePaths.SrcPath = NormPathH.AssurePathIsRooted(
                dotNetType.FilePaths.SrcPath,
                () => dotNetAssembly.Paths.SrcPath);

            dotNetType.FilePaths.DestnPath = NormPathH.AssurePathIsRooted(
                dotNetType.FilePaths.DestnPath,
                () => dotNetAssembly.Paths.DestnPath);
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

        public string GetDefaultTsRelFilePath(
            ProgramArgs args,
            ProgramConfig.DotNetType dotNetType)
        {
            var relNsPartsArr = dotNetType.RelNsPartsArr;
            var relNsPartsCount = relNsPartsArr.Length;

            Func<string, int, string> tsRelFilePathPartNameFactory = (
                part, idx) => args.Profile.TypesHcyDirName;

            Func<string, int, IEnumerable<string>> tsRelFilePathPartSelector = (
                part, idx) => [part, tsRelFilePathPartNameFactory(part, idx)];

            var tsRelFilePathParts = relNsPartsArr.SelectMany(
                    tsRelFilePathPartSelector);

            tsRelFilePathParts = tsRelFilePathParts.Concat(
                [ args.Profile.TypesDirName,
                    $"{dotNetType.Name}.ts" ]);

            var tsRelFilePath = Path.Combine(
                tsRelFilePathParts.ToArray());

            return tsRelFilePath;
        }
    }
}

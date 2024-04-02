using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.TextParsing.IndexesFilter;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
{
    public class ProgramConfig : ProgramConfigCoreBase<ProgramConfig.Profile>
    {
        public class Profile : ProgramConfigProfileCoreBase
        {
            public RelDirPaths RelDirPaths { get; set; }
            public ContentSpecs DefaultContentSpecs { get; set; }
            public List<ProfileSection> Sections { get; set; }
        }

        public class ProfileSection
        {
            public RelDirPaths RelDirPaths { get; set; }
            public string SectionName { get; set; }
            public ContentSpecs DefaultContentSpecs { get; set; }

            public List<FilesGroup> FileGroups { get; set; }
        }

        public class FilesGroup
        {
            public RelDirPaths RelDirPaths { get; set; }
            public ContentSpecs DefaultContentSpecs { get; set; }

            public List<File> Files { get; set; }
        }

        public class File
        {
            public RelDirPaths RelDirPaths { get; set; }
            public string FileRelPath { get; set; }
            public Dictionary<string, string> FileRelPathsMap { get; set; }
            public string TextContent { get; set; }
            public string[] TextContentLines { get; set; }
            public ContentSpecs DefaultContentSpecs { get; set; }
            public List<ContentSpecs> ContentSpecs { get; set; }
        }

        public class RelDirPaths
        {
            public string DirPath { get; set; }
            public string[] DirPathsArr { get; set; }
            public string[] NormDirPathsArr { get; set; }
            public Dictionary<string, RawFilter> Filters { get; set; }
            public Dictionary<string, Filter> FiltersMap { get; set; }
        }

        public class ContentSpecs
        {
            public string[][] Args { get; set; }
            public Dictionary<string, RawFilter> ArgFilters { get; set; }
            public Dictionary<string, Filter> ArgFiltersMap { get; set; }

            public string ArgsSetTpl { get; set; }
            public string ArgsSetsJoinTpl { get; set; }
            public string Template { get; set; }

            public string[] ArgsSetTplLines { get; set; }
            public string[] ArgsSetsJoinTplLines { get; set; }
            public string[] TemplateLines { get; set; }
        }

        public class Filter
        {
            public RawFilter Raw { get; set; }

            public IdxesFilter[]? Idxes { get; set; }
            public Regex? Regex { get; set; }
            public Regex[]? Regexes { get; set; }
        }

        public class RawFilter
        {
            public string? Idxes { get; set; }
            public string? Regex { get; set; }
            public string[]? Regexes { get; set; }
        }
    }
}

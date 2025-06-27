using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Jint.ConsoleApps;

namespace Turmerik.ScrapeWebPages.ConsoleApp
{
    public class ProgramConfig : ProgramBehaviorCoreBase<ProgramConfig.Profile>
    {
        public class Profile : ProgramBehaviorProfileCoreBase
        {
            public string? HtmlDirRelPath { get; set; }
            public string? OutputFileRelPath { get; set; }
            public string? BaseUrl { get; set; }
            public string[]? DfSelectorsFactoryFuncPath { get; set; }
            public string[]? DfAggregateFuncPath { get; set; }
            public string[]? DfPagesAggFuncPath { get; set; }
            public string[] SectionsAggFuncPath { get; set; }
            public Section[] Sections { get; set; }
        }

        public class Section
        {
            public string HtmlDirRelPath { get; set; }
            public string SectionName { get; set; }
            public string BaseUrl { get; set; }
            public Page[] Pages { get; set; }
            public string[]? DfSelectorsFactoryFuncPath { get; set; }
            public string[]? DfAggregateFuncPath { get; set; }
            public string[]? PagesAggFuncPath { get; set; }
            public string[]? SubSectionsAggFuncPath { get; set; }

            public Section[] SubSections { get; set; }
        }

        public class Page
        {
            public string HtmlFileRelPath { get; set; }
            public string Url { get; set; }
            public string[]? SelectorsFactoryFuncPath { get; set; }
            public string[]? AggregateFuncPath { get; set; }
        }
    }
}

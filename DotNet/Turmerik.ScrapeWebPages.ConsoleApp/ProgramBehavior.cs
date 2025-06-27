using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.ScrapeWebPages.ConsoleApp
{
    public static class ProgramBehavior
    {
        public class SelectorsFactoryArgs
        {
            public string Url { set; get; }
            public int[] HcyPath { set; get; }
        }

        public class AggregateFuncArgs
        {
            public string Url { set; get; }
            public int[] HcyPath { set; get; }
            public KeyValuePair<string, string[]>[] SelectedArr { get; set; }
        }

        public class PagesAggFuncArgs
        {
            public int[] HcyPath { set; get; }
            public KeyValuePair<string, string>[] PagesArr { get; set; }
        }

        public class SectionsAggFuncArgs
        {
            public int[] HcyPath { set; get; }
            public KeyValuePair<string, string>[] SectionsArr { get; set; }
        }
    }
}

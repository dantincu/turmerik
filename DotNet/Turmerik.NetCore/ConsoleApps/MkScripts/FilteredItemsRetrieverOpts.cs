using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
{
    public class FilteredItemsRetrieverOpts<TItem>
    {
        public TItem[] ItemsArr { get; set; }
        public Dictionary<string, ProgramConfig.Filter> FiltersMap { get; set; }
        public string? FilterName { get; set; }
        public Func<TItem, string>? ToStringSerializer { get; set; }
        public Func<TItem, string[]>? ToStrArrSerializer { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Jint.Behavior
{
    public interface IAppBehaviorConfig
    {
        string ExportedMembersRetrieverJsCode { get; }
        bool? SetJsConsole { get; }

        IEnumerable<string> GetJsFilePaths();
    }

    public static class AppBehaviorConfig
    {
        public static AppBehaviorConfigImmtbl ToImmtbl(
            this IAppBehaviorConfig src) => new AppBehaviorConfigImmtbl(src);

        public static AppBehaviorConfigMtbl ToMtbl(
            this IAppBehaviorConfig src) => new AppBehaviorConfigMtbl(src);
    }

    public class AppBehaviorConfigImmtbl : IAppBehaviorConfig
    {
        public AppBehaviorConfigImmtbl(
            IAppBehaviorConfig src)
        {
            ExportedMembersRetrieverJsCode = src.ExportedMembersRetrieverJsCode;
            SetJsConsole = src.SetJsConsole;
            JsFilePaths = src.GetJsFilePaths()?.RdnlC();
        }

        public string ExportedMembersRetrieverJsCode { get; }
        public bool? SetJsConsole { get; }
        public ReadOnlyCollection<string> JsFilePaths { get; }

        public IEnumerable<string> GetJsFilePaths() => JsFilePaths;
    }

    public class AppBehaviorConfigMtbl : IAppBehaviorConfig
    {
        public AppBehaviorConfigMtbl()
        {
        }

        public AppBehaviorConfigMtbl(
            IAppBehaviorConfig src)
        {
            ExportedMembersRetrieverJsCode = src.ExportedMembersRetrieverJsCode;
            SetJsConsole = src.SetJsConsole;
            JsFilePaths = src.GetJsFilePaths()?.ToList();
        }

        public string ExportedMembersRetrieverJsCode { get; set; }
        public bool? SetJsConsole { get; set; }
        public List<string> JsFilePaths { get; set; }

        public IEnumerable<string> GetJsFilePaths() => JsFilePaths;
    }
}

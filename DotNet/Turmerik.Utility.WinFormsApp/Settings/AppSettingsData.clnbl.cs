using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility.WinFormsApp.Settings
{
    public interface IAppSettingsData
    {
        AppSettingsData.IFetchWebResource GetFetchWebResource();
    }

    public static class AppSettingsData
    {
        public interface IFetchWebResource
        {
            bool? AutoCopyResourceTitleToClipboard { get; }
            bool? AutoCopyResourceMdLinkToClipboard { get; }
        }

        public class FetchWebResourceImmtbl : IFetchWebResource
        {
            public FetchWebResourceImmtbl(
                IFetchWebResource src)
            {
                AutoCopyResourceTitleToClipboard = src.AutoCopyResourceTitleToClipboard;
                AutoCopyResourceMdLinkToClipboard = src.AutoCopyResourceMdLinkToClipboard;
            }

            public bool? AutoCopyResourceTitleToClipboard { get; }
            public bool? AutoCopyResourceMdLinkToClipboard { get; }
        }

        public class FetchWebResourceMtbl : IFetchWebResource
        {
            public FetchWebResourceMtbl()
            {
            }

            public FetchWebResourceMtbl(
                IFetchWebResource src)
            {
                AutoCopyResourceTitleToClipboard = src.AutoCopyResourceTitleToClipboard;
                AutoCopyResourceMdLinkToClipboard = src.AutoCopyResourceMdLinkToClipboard;
            }

            public bool? AutoCopyResourceTitleToClipboard { get; set; }
            public bool? AutoCopyResourceMdLinkToClipboard { get; set; }
        }

        public static AppSettingsDataImmtbl ToImmtbl(
            this IAppSettingsData src) => new AppSettingsDataImmtbl(src);

        public static AppSettingsDataMtbl ToMtbl(
            this IAppSettingsData src) => new AppSettingsDataMtbl(src);

        public static FetchWebResourceImmtbl ToImmtbl(
            this IFetchWebResource src) => new FetchWebResourceImmtbl(src);

        public static FetchWebResourceMtbl ToMtbl(
            this IFetchWebResource src) => new FetchWebResourceMtbl(src);
    }
}

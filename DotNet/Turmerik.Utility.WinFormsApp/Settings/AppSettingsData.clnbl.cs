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
            string MdLinkTemplate { get; }
            bool? ResxTitleFetchToCB { get; }
            bool? ResxMdLinkFetchToCB { get; }
        }

        public class FetchWebResourceImmtbl : IFetchWebResource
        {
            public FetchWebResourceImmtbl(
                IFetchWebResource src)
            {
                MdLinkTemplate = src.MdLinkTemplate;
                ResxTitleFetchToCB = src.ResxTitleFetchToCB;
                ResxMdLinkFetchToCB = src.ResxMdLinkFetchToCB;
            }

            public string MdLinkTemplate { get; }
            public bool? ResxTitleFetchToCB { get; }
            public bool? ResxMdLinkFetchToCB { get; }
        }

        public class FetchWebResourceMtbl : IFetchWebResource
        {
            public FetchWebResourceMtbl()
            {
            }

            public FetchWebResourceMtbl(
                IFetchWebResource src)
            {
                MdLinkTemplate = src.MdLinkTemplate;
                ResxTitleFetchToCB = src.ResxTitleFetchToCB;
                ResxMdLinkFetchToCB = src.ResxMdLinkFetchToCB;
            }

            public string MdLinkTemplate { get; set; }
            public bool? ResxTitleFetchToCB { get; set; }
            public bool? ResxMdLinkFetchToCB { get; set; }
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

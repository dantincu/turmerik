namespace Turmerik.LocalFileNotes.WinFormsApp.Settings
{
    public interface IAppSettingsData
    {
        AppSettingsData.IFetchWebResource GetFetchWebResource();
        AppSettingsData.INameToIdnfConverter GetNameToIdnfConverter();
        AppSettingsData.IPathConverter GetPathConverter();
        AppSettingsData.ITextToMd GetTextToMd();
    }

    public static class AppSettingsData
    {
        public interface IFetchWebResource
        {
            string MdLinkTemplate { get; }
            bool? ResxTitleFetchToCB { get; }
            bool? ResxMdLinkFetchToCB { get; }
        }

        public interface INameToIdnfConverter
        {
            bool? NameConvertToCB { get; }
            bool? IsShown { get; }
        }

        public interface IPathConverter
        {
            bool? WinPathToCB { get; }
            bool? EscWinPathToCB { get; }
            bool? UnixPathToCB { get; }
            bool? IsShown { get; }
        }

        public interface ITextToMd
        {
            bool? MdTblFirstLineIsHeader { get; }
            bool? MdTableSrcTextIsTabSeparated { get; }
            string MdTableSrcTextTabSeparator { get; }
            bool? MdTableSurroundRowWithCellSep { get; }
            bool? SetResultTextToCB { get; }
            bool? HtmlDecodeOnRmMdQtLvl { get; }
            bool? HtmlEncodeOnAddMdQtLvl { get; }
            bool? InsertSpacesBetweenTokens { get; }
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

        public class NameToIdnfConverterImmtbl : INameToIdnfConverter
        {
            public NameToIdnfConverterImmtbl(
                INameToIdnfConverter src)
            {
                NameConvertToCB = src.NameConvertToCB;
                IsShown = src.IsShown;
            }

            public bool? NameConvertToCB { get; }
            public bool? IsShown { get; }
        }

        public class NameToIdnfConverterMtbl : INameToIdnfConverter
        {
            public NameToIdnfConverterMtbl()
            {
            }

            public NameToIdnfConverterMtbl(
                INameToIdnfConverter src)
            {
                NameConvertToCB = src.NameConvertToCB;
                IsShown = src.IsShown;
            }

            public bool? NameConvertToCB { get; set; }
            public bool? IsShown { get; set; }
        }

        public class PathConverterImmtbl : IPathConverter
        {
            public PathConverterImmtbl(IPathConverter src)
            {
                WinPathToCB = src.WinPathToCB;
                EscWinPathToCB = src.EscWinPathToCB;
                UnixPathToCB = src.UnixPathToCB;
                IsShown = src.IsShown;
            }

            public bool? WinPathToCB { get; }
            public bool? EscWinPathToCB { get; }
            public bool? UnixPathToCB { get; }
            public bool? IsShown { get; }
        }

        public class PathConverterMtbl : IPathConverter
        {
            public PathConverterMtbl()
            {
            }

            public PathConverterMtbl(IPathConverter src)
            {
                WinPathToCB = src.WinPathToCB;
                EscWinPathToCB = src.EscWinPathToCB;
                UnixPathToCB = src.UnixPathToCB;
                IsShown = src.IsShown;
            }

            public bool? WinPathToCB { get; set; }
            public bool? EscWinPathToCB { get; set; }
            public bool? UnixPathToCB { get; set; }
            public bool? IsShown { get; set; }
        }

        public class TextToMdImmtbl : ITextToMd
        {
            public TextToMdImmtbl(
                ITextToMd src)
            {
                MdTblFirstLineIsHeader = src.MdTblFirstLineIsHeader;
                MdTableSrcTextIsTabSeparated = src.MdTableSrcTextIsTabSeparated;
                MdTableSrcTextTabSeparator = src.MdTableSrcTextTabSeparator;
                MdTableSurroundRowWithCellSep = src.MdTableSurroundRowWithCellSep;
                SetResultTextToCB = src.SetResultTextToCB;
                HtmlDecodeOnRmMdQtLvl = src.HtmlDecodeOnRmMdQtLvl;
                HtmlEncodeOnAddMdQtLvl = src.HtmlEncodeOnAddMdQtLvl;
                InsertSpacesBetweenTokens = src.InsertSpacesBetweenTokens;
            }

            public bool? MdTblFirstLineIsHeader { get; }
            public bool? MdTableSrcTextIsTabSeparated { get; }
            public string MdTableSrcTextTabSeparator { get; }
            public bool? MdTableSurroundRowWithCellSep { get; }
            public bool? SetResultTextToCB { get; }
            public bool? HtmlDecodeOnRmMdQtLvl { get; }
            public bool? HtmlEncodeOnAddMdQtLvl { get; }
            public bool? InsertSpacesBetweenTokens { get; }
        }

        public class TextToMdMtbl : ITextToMd
        {
            public TextToMdMtbl()
            {
            }

            public TextToMdMtbl(
                ITextToMd src)
            {
                MdTblFirstLineIsHeader = src.MdTblFirstLineIsHeader;
                MdTableSrcTextIsTabSeparated = src.MdTableSrcTextIsTabSeparated;
                MdTableSrcTextTabSeparator = src.MdTableSrcTextTabSeparator;
                MdTableSurroundRowWithCellSep = src.MdTableSurroundRowWithCellSep;
                SetResultTextToCB = src.SetResultTextToCB;
                HtmlDecodeOnRmMdQtLvl = src.HtmlDecodeOnRmMdQtLvl;
                HtmlEncodeOnAddMdQtLvl = src.HtmlEncodeOnAddMdQtLvl;
                InsertSpacesBetweenTokens = src.InsertSpacesBetweenTokens;
            }

            public bool? MdTblFirstLineIsHeader { get; set; }
            public bool? MdTableSrcTextIsTabSeparated { get; set; }
            public string MdTableSrcTextTabSeparator { get; set; }
            public bool? MdTableSurroundRowWithCellSep { get; set; }
            public bool? SetResultTextToCB { get; set; }
            public bool? HtmlDecodeOnRmMdQtLvl { get; set; }
            public bool? HtmlEncodeOnAddMdQtLvl { get; set; }
            public bool? InsertSpacesBetweenTokens { get; set; }
        }

        public static AppSettingsDataImmtbl ToImmtbl(
            this IAppSettingsData src) => new AppSettingsDataImmtbl(src);

        public static FetchWebResourceImmtbl ToImmtbl(
            this IFetchWebResource src) => new FetchWebResourceImmtbl(src);

        public static NameToIdnfConverterImmtbl ToImmtbl(
            this INameToIdnfConverter src) => new NameToIdnfConverterImmtbl(src);

        public static PathConverterImmtbl ToImmtbl(
            this IPathConverter src) => new PathConverterImmtbl(src);

        public static TextToMdImmtbl ToImmtbl(
            this ITextToMd src) => new TextToMdImmtbl(src);

        public static AppSettingsDataMtbl ToMtbl(
            this IAppSettingsData src) => new AppSettingsDataMtbl(src);

        public static FetchWebResourceMtbl ToMtbl(
            this IFetchWebResource src) => new FetchWebResourceMtbl(src);

        public static NameToIdnfConverterMtbl ToMtbl(
            this INameToIdnfConverter src) => new NameToIdnfConverterMtbl(src);

        public static TextToMdMtbl ToMtbl(
            this ITextToMd src) => new TextToMdMtbl(src);

        public static PathConverterMtbl ToMtbl(
            this IPathConverter src) => new PathConverterMtbl(src);
    }
}

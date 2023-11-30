﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility.WinFormsApp.Settings
{
    public interface IAppSettingsData
    {
        AppSettingsData.IFetchWebResource GetFetchWebResource();
        AppSettingsData.INameToIdnfConverter GetNameToIdnfConverter();
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
        }

        public interface ITextToMd
        {
            bool? MdTableSrcTextIsTabSeparated { get; }
            string MdTableSrcTextTabSeparator { get; }
            bool? GetSrcTextFromCB { get; }
            bool? SetResultTextToCB { get; }
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
            }

            public bool? NameConvertToCB { get; }
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
            }

            public bool? NameConvertToCB { get; set; }
        }

        public class TextToMdImmtbl : ITextToMd
        {
            public TextToMdImmtbl(
                ITextToMd src)
            {
                MdTableSrcTextIsTabSeparated = src.MdTableSrcTextIsTabSeparated;
                GetSrcTextFromCB = src.GetSrcTextFromCB;
                SetResultTextToCB = src.SetResultTextToCB;
            }

            public bool? MdTableSrcTextIsTabSeparated { get; }
            public bool? GetSrcTextFromCB { get; }
            public bool? SetResultTextToCB { get; }
        }

        public class TextToMdMtbl : ITextToMd
        {
            public TextToMdMtbl()
            {
            }

            public TextToMdMtbl(
                ITextToMd src)
            {
                MdTableSrcTextIsTabSeparated = src.MdTableSrcTextIsTabSeparated;
                GetSrcTextFromCB = src.GetSrcTextFromCB;
                SetResultTextToCB = src.SetResultTextToCB;
            }

            public bool? MdTableSrcTextIsTabSeparated { get; }
            public bool? GetSrcTextFromCB { get; }
            public bool? SetResultTextToCB { get; }
        }

        public static AppSettingsDataImmtbl ToImmtbl(
            this IAppSettingsData src) => new AppSettingsDataImmtbl(src);

        public static AppSettingsDataMtbl ToMtbl(
            this IAppSettingsData src) => new AppSettingsDataMtbl(src);

        public static FetchWebResourceImmtbl ToImmtbl(
            this IFetchWebResource src) => new FetchWebResourceImmtbl(src);

        public static FetchWebResourceMtbl ToMtbl(
            this IFetchWebResource src) => new FetchWebResourceMtbl(src);

        public static NameToIdnfConverterImmtbl ToImmtbl(
            this INameToIdnfConverter src) => new NameToIdnfConverterImmtbl(src);

        public static NameToIdnfConverterMtbl ToMtbl(
            this INameToIdnfConverter src) => new NameToIdnfConverterMtbl(src);

        public static TextToMdImmtbl ToImmtbl(
            this ITextToMd src) => new TextToMdImmtbl(src);

        public static TextToMdMtbl ToMtbl(
            this ITextToMd src) => new TextToMdMtbl(src);
    }
}
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Code.Xml
{
    public static class XmlH
    {
        public const string TAG_NAME_START_VALID_CHARS = "_";
        public const string TAG_NAME_VALID_CHARS = "-_.";

        public static readonly ReadOnlyDictionary<XmlItemType, Tuple<string, string>> RawFreeTextXmlDeclMap;

        static XmlH()
        {
            RawFreeTextXmlDeclMap = new Dictionary<XmlItemType, Tuple<string, string>>
            {
                { XmlItemType.XmlComment, Tuple.Create("<!--", "-->") },
                { XmlItemType.XmlCDataSection, Tuple.Create("<![CDATA[", "]]>") }
            }.RdnlD();
        }
    }
}

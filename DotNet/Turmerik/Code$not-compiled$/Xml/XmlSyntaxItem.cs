using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code.Xml
{
    public class XmlSyntaxItem<TXmlSyntaxItem> : CodeSyntaxItem<TXmlSyntaxItem>
        where TXmlSyntaxItem : XmlSyntaxItem<TXmlSyntaxItem>
    {
        public XmlItemType? XmlItemType { get; set; }

        public int? TagNameNodeIdx { get; set; }
        public int? TagCloseTokenNodeIdx { get; set; }
        public int? SpecialTagOpenNodeIdx { get; set; }
        public int? SpecialTagCloseNodeIdx { get; set; }
        public List<int>? AttrNodeIdxes { get; set; }
        public List<int>? AttrChildNodeIdxes { get; set; }

        public TXmlSyntaxItem GetTagNameNode(
            ) => GetChildItemIfReq(TagNameNodeIdx);

        public TXmlSyntaxItem GetTagCloseTokenNode(
            ) => GetChildItemIfReq(TagCloseTokenNodeIdx);

        public TXmlSyntaxItem GetSpecialTagOpenNode(
            ) => GetChildItemIfReq(SpecialTagOpenNodeIdx);

        public TXmlSyntaxItem GetSpecialTagCloseNode(
            ) => GetChildItemIfReq(SpecialTagCloseNodeIdx);

        public IEnumerable<KeyValuePair<int, TXmlSyntaxItem>> GetAttributes(
            Func<TXmlSyntaxItem, int, bool> attrPredicate)
        {
            var attrNodeIdxes = AttrNodeIdxes;

            if (ChildNodes != null && attrNodeIdxes != null)
            {
                foreach (int idx  in attrNodeIdxes)
                {
                    var attrNode = ChildNodes[idx];

                    if (attrPredicate(attrNode, idx))
                    {
                        yield return new KeyValuePair<int, TXmlSyntaxItem>(idx, attrNode);
                    }
                }
            }
        }

        private TXmlSyntaxItem GetChildItemIfReq(int? idxNllbl) => idxNllbl?.With(idx => ChildNodes[idx]);
    }

    public class XmlSyntaxItem : XmlSyntaxItem<XmlSyntaxItem>
    {
    }
}

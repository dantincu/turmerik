using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Code.Html;

namespace Turmerik.Code.Md
{
    public class MdSyntaxItem<TMdSyntaxItem> : HtmlSyntaxItem<TMdSyntaxItem>
        where TMdSyntaxItem : MdSyntaxItem<TMdSyntaxItem>
    {
        public MdItemLineType? MdLineType { get; set; }
    }

    public class MdSyntaxItem : MdSyntaxItem<MdSyntaxItem>
    {
    }
}

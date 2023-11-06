using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Code.Xml;

namespace Turmerik.Code.Html
{
    public class HtmlSyntaxItem<THtmlSyntaxItem> : XmlSyntaxItem<THtmlSyntaxItem>
        where THtmlSyntaxItem : HtmlSyntaxItem<THtmlSyntaxItem>
    {
    }

    public class HtmlSyntaxItem : HtmlSyntaxItem<HtmlSyntaxItem>
    {
    }
}

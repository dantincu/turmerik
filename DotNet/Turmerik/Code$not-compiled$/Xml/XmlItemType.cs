using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code.Xml
{
    public enum XmlItemType
    {
        TextNode = 0,
        /// <summary>
        /// Part of a text node that starts with <c>&amp;</c> and ends with <c>;</c> like <c>&amp;lt;</c> which is rendered as <c>&lt;</c>
        /// </summary>
        Entity,
        /// <summary>
        /// Hierarchical nodes represented by an opening or self-closing tag, optional child nodes
        /// (that themselves can be elements, text nodes or special tags or constructs) and a closing tag (that can be
        /// made optional even in the presence of child nodes and an opening tag, like in html).
        /// </summary>
        Element,
        /// <summary>
        /// Either a valid xml identifier (just the attribute name) or a pair of attribute name and value
        /// joined by the equals sign without spaces (neither before, nor after the equals sign are white spaces allowed)
        /// </summary>
        Attribute,
        /// <summary>
        /// Should be a valid xml identifier (so not quoted and not starting with a number)
        /// </summary>
        AttrName,
        /// <summary>
        /// Can be a literal, like a quoted or a number value
        /// </summary>
        AttrValue,
        /// <summary>
        /// The equals sign =
        /// </summary>
        AttrNvpJoinChar,
        /// <summary>
        /// &lt;TagName ... &gt;
        /// </summary>
        OpeningTag,
        /// <summary>
        /// &lt;/TagName ... &gt;
        /// </summary>
        ClosingTag,
        /// <summary>
        /// &lt;TagName ... /&gt;
        /// </summary>
        SelfClosingTag,
        /// <summary>
        /// Either an xml processing instruction (that starts with &lt;? and ends with &gt;?) or an xml declaration
        /// (that starts with &lt;!, optionally followed by additional symbols that then make the rest of the symbols in the tag
        /// to be interpreted differently than in regular xml tags).
        /// </summary>
        SpecialTag,
        /// <summary>
        /// Starts with <c>&lt;!</c> like <c>&lt;!DOCTYPE html&gt;</c>
        /// </summary>
        XmlDeclaration,
        /// <summary>
        /// Starts with <c>&lt;?</c> like <c>&lt;?xml version="1.0" encoding="UTF-8" standalone="no" ?&gt;</c>
        /// </summary>
        XmlProcInstr,
        /// <summary>
        /// <c>&lt;!-- ... --&gt;</c>
        /// </summary>
        XmlComment,
        /// <summary>
        /// <c>&lt;![CDATA[ ... ]]&gt;</c>
        /// </summary>
        XmlCDataSection,
    }
}

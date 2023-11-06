using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Code.Html
{
    public static class HtmlH
    {
        /// <summary>
        /// According to https://www.w3schools.com/html/html_blocks.asp
        /// </summary>
        public static ReadOnlyCollection<string> BlockHtmlTagNames = new string[]
        {
            "address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form",
            "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "noscript", "ol", "p", "pre", "section", "table", "tfoot", "ul", "video"
        }.RdnlC();

        /// <summary>
        /// According to https://www.w3schools.com/html/html_blocks.asp
        /// </summary>
        public static ReadOnlyCollection<string> InlineHtmlTagNames = new string[]
        {
            "a", "abbr", "acronym", "b", "bdo", "big", "br", "button", "cite", "code", "dfn", "em", "i", "img", "input", "kbd", "label", "map", "object",
            "output", "q", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "var"
        }.RdnlC();

        public static readonly ReadOnlyCollection<ReadOnlyCollection<string>> MainHtmlTagNames = new string[]
        {
            "html"
        }.RdnlC().Arr(new string[]
        {
            "head", "body"
        }.RdnlC(), new string[]
        {
            "style", "script"
        }.RdnlC()).RdnlC();

        public static readonly ReadOnlyCollection<ReadOnlyCollection<string>> PrimaryHtmlTagNames = new string[]
        {
            "canvas"
        }.RdnlC().Arr(new string[]
        {
            "div", "header" ,"footer", "form", "pre", "address", "article", "aside", "blockquote", "fieldset", "figcaption", "figure", 
            "p", "h1", "h2", "h3", "h4", "h5", "h6", "dd", "dl", "dt",
        }.RdnlC()).RdnlC();

        public static readonly ReadOnlyCollection<ReadOnlyCollection<string>> SecondaryHtmlTagNames = new string[]
        {
            "a", "abbr", "acronym", "b", "bdo", "big", "button", "cite", "code", "dfn", "em", "i", "img", "kbd", "label", "map", "object",
            "output", "q", "samp", "select", "small", "span", "strong", "sub", "sup", "time", "tt", "var", "input", "textarea"
        }.RdnlC().Arr().RdnlC();

        public static readonly ReadOnlyCollection<string> LeafHtmlTagNames = new string[]
        {
            "hr", "br"
        }.RdnlC();
    }
}

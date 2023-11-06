using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code
{
    public enum CodeSyntaxItemType
    {
        /// <summary>
        /// Free text, like contents of text nodes in xml and html, contents of quoted strings, or contents of comment nodes. <br />
        /// Such items should not have children.
        /// </summary>
        FreeText = 0,
        /// <summary>
        /// Largely ignored parts of text that are not all white spaces, like comments
        /// </summary>
        Trivia,
        /// <summary>
        /// Contains only white space characters.
        /// </summary>
        AllWs,
        /// <summary>
        /// The new line token (the newline char <c>'\n'</c> everywhere except on windows os's, where it would be preceded by the
        /// carriage return char <c>'\r'</c> so the windows new line token is <c>"\r\n"</c>).
        /// </summary>
        NwLn,
        /// <summary>
        /// Operators and other special symbols
        /// </summary>
        Token,
        /// <summary>
        /// Language specific keywords (like <c>var, const, let, for, in, of, function, async, await, typeof</c> etc. in javascript).
        /// </summary>
        Keyword,
        /// <summary>
        /// Numbers, quoted strings etc
        /// </summary>
        Literal,
        /// <summary>
        /// A string of symbols identifying something (like a concept or a resource)
        /// </summary>
        Identifier,
    }
}

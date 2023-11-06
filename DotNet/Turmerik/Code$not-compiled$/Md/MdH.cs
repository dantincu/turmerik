using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using Turmerik.Text;
using Turmerik.Helpers;

namespace Turmerik.Code.Md
{
    public static class MdH
    {
        public const string DBL_SPACE = "  ";

        public static bool LineEndsWithDblSpace<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item,
            ISrcCode srcCode = null) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem>
        {
            bool retVal;

            if (srcCode != null && item.SrcCodeLength > 0)
            {
                (var startIdx, var @char, var endIdx) = srcCode.ForEach(
                    item.SrcCodeStartIdx + item.SrcCodeLength,
                    (chr, idx) => !StringH.IsNewLineChar(chr),
                    (chr, idx) => idx - (chr.IsDefault() ? 0 : 1));

                retVal = @char == ' ' && srcCode[endIdx - 1] == ' ';
            }
            else
            {
                bool? nllblRetVal = item.GetLastNonNwLnToken(
                    )?.With(token => token.EndsWith(DBL_SPACE));

                nllblRetVal = nllblRetVal ?? item.ChildNodes?.LastOrDefault(
                    )?.LineEndsWithDblSpace();

                nllblRetVal = nllblRetVal ?? item.LeadingTokens?.LastOrDefault(
                        token => !token.IsNwLn())?.With(token => token.EndsWith(DBL_SPACE));

                retVal = nllblRetVal ?? false;
            }
            
            return retVal;
        }
    }
}

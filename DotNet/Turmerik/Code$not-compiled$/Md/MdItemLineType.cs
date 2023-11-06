using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code.Md
{
    public enum MdItemLineType
    {
        FreeText = 0,
        BlankLine,
        CodeBlockStart,
        CodeBlockEnd,
        TableHeader,
        TableRow,
        TableHeaderRule,
        HeaderHorizRule,
        HorizRule,
    }
}

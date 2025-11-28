using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.TextParsing.StructuredFreeText
{
    public static class TrmrkStructuredFreeTextH
    {
        public static bool IsEmpty(
            this TrmrkStructuredFreeTextItem item) => item.Metadata == null && item.Payload == null;
    }
}

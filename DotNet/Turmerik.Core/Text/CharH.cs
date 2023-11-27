using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Text
{
    public static class CharH
    {
        public static bool IsAlphaNumericOrAnyOf(
            this char chr,
            params char[] allowed) => char.IsLetterOrDigit(chr) || allowed.Contains(chr);

        public static bool IsLatinLetterOrNumberOrAnyOf(
            this char chr,
            params char[] allowed) => chr.IsLatinLetter() || allowed.Contains(chr);

        public static bool IsValidCodeIdentifier(
            this char chr) => chr == '_' || chr.IsLatinLetter();
    }
}

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

        public static bool IsLowerAsciiLetter(
            this char chr) => 'a' <= chr && chr <= 'z';

        public static bool IsUpperAsciiLetter(
            this char chr) => 'A' <= chr && chr <= 'Z';

        public static bool IsAsciiLetter(
            this char chr)
        {
            bool retVal = IsLowerAsciiLetter(chr);
            retVal = retVal || IsUpperAsciiLetter(chr);

            return retVal;
        }

        public static bool IsAsciiLetterOrDigit(
            char chr)
        {
            bool retVal = IsAsciiLetter(chr);
            retVal = retVal || char.IsDigit(chr);

            return retVal;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Text
{
    [Flags]
    public enum CharType
    {
        LowerCase = 1,
        UpperCase = 2,
        Letter = 3,
        UnicaseLetter = 4,
        Digit = 8,
        AlphaNumeric = 15,
        NonAlphaNumeric = 16
    }
}

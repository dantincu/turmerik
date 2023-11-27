using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Text
{
    public static class EncodeH
    {
        public static byte[] EncodeSha1(string input)
        {
            byte[] hash;

            using (var sha1 = SHA1.Create())
            {
                hash = sha1.ComputeHash(Encoding.UTF8.GetBytes(input));
            }

            return hash;
        }

        public static byte[] TryDecodeFromBase64(string str)
        {
            byte[] retVal = null;

            try
            {
                if (str != null)
                {
                    retVal = Convert.FromBase64String(str);
                }
            }
            catch
            {
            }

            return retVal;
        }

        public static string EncodeToBase64String(
            byte[] bytesArr,
            char[] lastTwoChars = null,
            char paddingChar = Base64Chars.PADDING)
        {
            string base64String = Convert.ToBase64String(bytesArr);

            if (paddingChar != '=' || lastTwoChars != null)
            {
                lastTwoChars = lastTwoChars ?? Base64Chars.LastChars.ToArray();

                var replDictnr = new Dictionary<char, char>
                {
                    { Base64Chars.SECOND_LAST_BIT , lastTwoChars[1] },
                    { Base64Chars.LAST_BIT, lastTwoChars[0] },
                    { Base64Chars.PADDING, paddingChar }
                };

                base64String = base64String.ReplaceAllChars(replDictnr);
            }

            return base64String;
        }

        public static class Base64Chars
        {
            public const char PADDING = '=';
            public const char LAST_BIT = '/';
            public const char SECOND_LAST_BIT = '+';

            public static readonly ReadOnlyCollection<char> LastChars;
            public static readonly ReadOnlyCollection<char> AllSpecialChars;

            static Base64Chars()
            {
                LastChars = new char[] { SECOND_LAST_BIT, LAST_BIT }.RdnlC();
                AllSpecialChars = new char[] { SECOND_LAST_BIT, LAST_BIT, PADDING }.RdnlC();
            }
        }
    }
}

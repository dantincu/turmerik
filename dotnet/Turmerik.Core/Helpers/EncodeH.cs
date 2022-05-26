using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class EncodeH
    {
        public static byte[] EncodeSha1(string input)
        {
            byte[] hash;

            using (SHA1Managed sha1 = new SHA1Managed())
            {
                hash = sha1.ComputeHash(Encoding.UTF8.GetBytes(input));
            }

            return hash;
        }

        public static byte[] TryDecodeFromBase64(this string str)
        {
            byte[] retVal = null;

            try
            {
                if (str != null)
                {
                    retVal = Convert.FromBase64String(str);
                }
            }
            catch (Exception ex)
            {
            }

            return retVal;
        }
    }
}

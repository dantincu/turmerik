using SHA3.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Text;

namespace Turmerik.AspNetCore.Text
{
    public static class AspNetCoreEncodeH
    {
        public static byte[] EncodeSha3_256(byte[] input)
        {
            byte[] hash;

            using (var sha3 = Sha3.Sha3512())
            {
                hash = sha3.ComputeHash(input);
            }

            return hash;
        }

        public static byte[] EncodeSha3_256(string input) => EncodeSha3_256(
            Encoding.UTF8.GetBytes(input));

        public static string GetUserIdnfHash(
            string userIdnfTpl,
            string username)
        {
            string userIdnf = string.Format(
                userIdnfTpl, username);

            var userIdnfHashBytes = EncodeSha3_256(userIdnf);
            var userIdnfHash = EncodeH.EncodeToBase64String(userIdnfHashBytes);

            return userIdnfHash;
        }
    }
}

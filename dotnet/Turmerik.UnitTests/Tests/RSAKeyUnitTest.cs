using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Xunit;

namespace Turmerik.UnitTests.Tests
{
    public class RSAKeyUnitTest : UnitTestBase
    {
        [Fact]
        public void MainTest()
        {
            // RSACryptoServiceProvider provider = new RSACryptoServiceProvider();

            RSA rsa = RSA.Create();
            var parameters = rsa.ExportParameters(true);

            string json = JsonConvert.SerializeObject(parameters);
            parameters = JsonConvert.DeserializeObject<RSAParameters>(json);

            RSA rsa2 = RSA.Create(parameters);

            string testStr = "some.user@some.domain.com";
            var testBytes = EncodeH.EncodeSha1(testStr);

            var encrypted = rsa.Encrypt(testBytes, RSAEncryptionPadding.OaepSHA512);
            var decrypted = rsa2.Decrypt(encrypted, RSAEncryptionPadding.OaepSHA512);

            AssertSequenceEqual(testBytes, decrypted);
        }
    }
}

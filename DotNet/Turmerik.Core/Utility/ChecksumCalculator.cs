using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Text;

namespace Turmerik.Core.Utility
{
    public interface IChecksumCalculator
    {
        string Checksum(byte[] bytesArr);
        string Checksum(string text);
    }

    public class ChecksumCalculator : IChecksumCalculator
    {
        public string Checksum(byte[] bytesArr)
        {
            var encodedBytesArr = EncodeH.EncodeSha1(bytesArr);

            string retStr = string.Concat(
                encodedBytesArr.Select(
                    @byte => @byte.ToString("x2")));

            return retStr;
        }

        public string Checksum(string text)
        {
            var bytesArr = Encoding.UTF8.GetBytes(text);
            string retStr = Checksum(bytesArr);

            return retStr;
        }
    }
}

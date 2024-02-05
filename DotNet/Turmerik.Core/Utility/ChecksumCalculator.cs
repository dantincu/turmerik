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
            string retStr = string.Concat(bytesArr.Select(
                @byte => @byte.ToString("x")));

            return retStr;
        }

        public string Checksum(string text)
        {
            var bytesArr = EncodeH.EncodeSha1(text);
            string retStr = Checksum(bytesArr);

            return retStr;
        }
    }
}

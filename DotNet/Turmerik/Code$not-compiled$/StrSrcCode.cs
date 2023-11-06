using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Code
{
    public class StrSrcCode : SrcCodeBase<string>
    {
        public StrSrcCode(string code) : base(code)
        {
        }

        public override char this[int index]
        {
            get
            {
                char chr = default;

                if (index >= 0 && index < Length)
                {
                    chr = Code[index];
                }

                return chr;
            }
        }

        protected override string Concat(
            string code,
            string nextChunk) => code + nextChunk;

        protected override int GetLength(
            string code) => code.Length;

        protected override string GetSliceCore(
            string code,
            int startIndex,
            int length) => code.Substring(
                startIndex,
                length);

        protected override string NmrblToSlice(
            IEnumerable<char> nmrbl) => new string(nmrbl.ToArray());

        protected override string SliceToString(
            string slice) => slice;

        protected override string StringToSlice(
            string slice) => slice;
    }
}

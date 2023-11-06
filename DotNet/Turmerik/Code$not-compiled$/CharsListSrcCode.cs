using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Code
{
    public class CharsListSrcCode : SrcCodeBase<List<char>>
    {
        public CharsListSrcCode(List<char> code) : base(code)
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

        protected override List<char> Concat(
            List<char> code,
            List<char> nextChunk)
        {
            var newArr = new char[code.Count + nextChunk.Count];

            code.CopyTo(newArr, 0);
            nextChunk.CopyTo(newArr, code.Count);

            return newArr.ToList();
        }

        protected override int GetLength(
            List<char> code) => code.Count;

        protected override List<char> GetSliceCore(
            List<char> code,
            int startIndex,
            int length) => code.Skip(
                startIndex).Take(
                length).ToList();

        protected override List<char> NmrblToSlice(
            IEnumerable<char> nmrbl) => nmrbl.ToList();

        protected override string SliceToString(
            List<char> slice) => new string(slice.ToArray());

        protected override List<char> StringToSlice(
            string slice) => slice.ToList();
    }
}

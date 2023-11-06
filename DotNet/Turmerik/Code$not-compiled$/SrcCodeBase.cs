using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;

namespace Turmerik.Code
{
    public abstract class SrcCodeBase<TString> : ISrcCode
        where TString : class, IEnumerable<char>
    {
        private int index;

        protected SrcCodeBase(
            TString code)
        {
            SetCode(code ?? throw new ArgumentNullException(nameof(code)));
        }

        public int Length { get; private set; }

        public char Char { get; private set; }

        public int Index
        {
            get => index;

            set
            {
                if (value >= 0)
                {
                    if (value < Length)
                    {
                        index = value;
                        Char = this[value];
                    }
                    else
                    {
                        index = Length;
                        Char = default;
                    }
                }
                else
                {
                    index = -1;
                    Char = default;
                }
            }
        }

        public int StartIndex { get; set; }

        public abstract char this[int index] { get; }

        protected TString Code { get; private set; }

        public int DragStartIndex()
        {
            StartIndex = index;
            return index;
        }

        public char Append(string nextStr)
        {
            var nextChunk = StringToSlice(nextStr);
            var nextChar = Append(nextChunk);

            return nextChar;
        }

        public char Append(IEnumerable<char> nextNmrbl)
        {
            var nextChunk = (nextNmrbl as TString) ?? NmrblToSlice(nextNmrbl);
            var nextChar = Append(nextChunk);

            return nextChar;
        }

        public char Append(TString nextChunk)
        {
            char nextChar = default;
            int nextChunkLength = GetLength(nextChunk);

            if (nextChunkLength > 0)
            {
                bool refreshChar = index == Length;
                Code = Concat(Code, nextChunk);

                Index = Length;
                nextChar = Char;

                Length += nextChunkLength;

                if (refreshChar)
                {
                    Char = this[index];
                }
            }

            return nextChar;
        }

        public TString GetSlice(
            int startIndex,
            int length)
        {
            var slice = GetSlice(
                startIndex,
                length,
                out bool indexOutOfRange);

            if (indexOutOfRange)
            {
                string errMsg = slice == null ? nameof(startIndex) : nameof(length);
                throw new IndexOutOfRangeException(errMsg);
            }

            return slice;
        }

        public TString GetSlice(
            int startIndex,
            int length,
            out bool indexOutOfRange)
        {
            indexOutOfRange = false;
            TString slice = null;

            if (startIndex < 0)
            {
                indexOutOfRange = true;
                length += startIndex;
                startIndex = 0;
            }

            int maxLength = Length - startIndex;

            if (maxLength >= 0)
            {
                if (length > maxLength)
                {
                    length = maxLength;
                    indexOutOfRange = true;
                }

                slice = GetSliceCore(
                    Code,
                    startIndex,
                    length);
            }
            else
            {
                indexOutOfRange = true;
            }

            return slice;
        }

        public string GetSubstring(
            int startIndex,
            int length) => GetSubstring(
                startIndex, length, out _);

        public string GetSubstring(
            int startIndex,
            int length,
            out bool indexOutOfRange)
        {
            var slice = GetSlice(
                startIndex,
                length,
                out indexOutOfRange);

            var substr = SliceToString(slice);
            return substr;
        }

        public string GetStrSlice(
            int startIndex,
            int endIndex) => GetStrSlice(
                startIndex, endIndex, out _);

        public string GetStrSlice(
            int startIndex,
            int endIndex,
            out bool indexOutOfRange)
        {
            var slice = GetSlice(
                startIndex,
                endIndex - startIndex,
                out indexOutOfRange);

            var substr = SliceToString(slice);
            return substr;
        }

        public Tuple<int, char, int> ForEach(
            int startIndex,
            Func<char, int, bool> stopPredicate,
            Func<char, int, int> nextIdxPredicate)
        {
            int index = startIndex;
            char chr = this[index];
            bool stop = false;

            while (!stop)
            {
                stop = stopPredicate(
                    chr, index);

                index = nextIdxPredicate(
                    chr, index);

                chr = this[index];
            }

            if (index < startIndex)
            {
                int aux = index;
                index = startIndex;
                startIndex = aux;
            }

            return Tuple.Create(
                startIndex, chr, index);
        }

        protected abstract TString GetSliceCore(
            TString code, int startIndex, int length);

        protected abstract string SliceToString(TString slice);
        protected abstract TString StringToSlice(string slice);
        protected abstract TString NmrblToSlice(IEnumerable<char> nmrbl);

        protected abstract int GetLength(TString code);

        protected abstract TString Concat(
            TString code,
            TString nextChunk);

        protected void SetCode(TString code)
        {
            Code = code;
            Length = GetLength(code);
        }
    }
}

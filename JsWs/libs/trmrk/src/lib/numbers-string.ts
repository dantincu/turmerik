export interface NumbersExtractorChunk {
  str: string;
  digit?: number | null;
}

export const extractNumbers = (inputStr: string) => {
  let idx = 0,
    chr = inputStr[idx],
    prevIsDigit = false,
    chunksArr: NumbersExtractorChunk[] = [],
    chunkStartIdx = 0;

  while (chr.length) {
    const isDigit = /\d/.test(chr);

    if (isDigit !== prevIsDigit) {
      const chunk: NumbersExtractorChunk = {
        str: inputStr.substring(chunkStartIdx, idx - chunkStartIdx),
      };

      if (prevIsDigit) {
        chunk.digit = parseInt(chunk.str);
      }

      chunksArr.push(chunk);
      chunkStartIdx = idx;
      prevIsDigit = isDigit;
    }

    idx++;
    chr = inputStr[idx];
  }

  const chunk: NumbersExtractorChunk = {
    str: inputStr.substring(chunkStartIdx, idx - chunkStartIdx),
  };

  chunksArr.push(chunk);

  if (prevIsDigit) {
    chunk.digit = parseInt(chunk.str);
  }

  return chunksArr;
};

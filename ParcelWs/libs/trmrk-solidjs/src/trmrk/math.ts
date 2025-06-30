export const getNextIdx = (dimSizes: number[], dimIdxes: number[]) => {
  dimSizes = [...dimSizes].reverse();
  let magn = 1;

  const dimMagnitudes = dimSizes
    .map((_, i) => {
      const retVal = i === 0 ? 1 : magn * dimSizes[i - 1];
      magn *= retVal;
      return retVal;
    })
    .reverse();

  dimSizes.reverse();

  const retVal = dimIdxes
    .map((idx, i) => idx * dimMagnitudes[i])
    .reduce((acc, val) => acc + val);

  return retVal;
};

/* for (let data of [
  [0, 0, 2],
  [0, 2, 1],
  [1, 3, 2],
].map((arr) => ({
  dimSizes: [2, 4, 3],
  dimIdxes: arr,
}))) {
  console.log('getNextIdx', getNextIdx(data.dimSizes, data.dimIdxes));
} */

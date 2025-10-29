export const uuidToBase36 = (uuid: string) => {
  const hex = uuid.replace(/-/g, ''); // Remove dashes
  const decimal = BigInt(`0x${hex}`); // Convert to BigInt
  return decimal.toString(36); // Convert to Base36
};

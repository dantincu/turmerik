export const encodeHtml = (str: string, useNonBreakingSpaces = false) => {
  str = str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

  if (useNonBreakingSpaces) {
    str = str.replaceAll(' ', '&nbsp;');
  }

  return str;
};

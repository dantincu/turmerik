import {
  FontStyle,
  RichTextBoxPseudoMarkup,
  CSharpSyntaxTree,
  TextTransformBehaviorData,
  TextTransformItem,
  TextTransformNode,
} from "./core";

export const printableWhitespaces = Object.freeze([" ", "\n", "\t"]);

export const regexes = Object.freeze({
  whitespace: /\s/,
  startWithDigits: /^[\s\d]+/,
  whitespaceOnly: /^[\s]*$/,
  digitsOrWhitespaceOnly: /^[\s\d]*$/,
});

export const isPrintableChar = (chr: string) => {
  let isPrintable =
    !regexes.whitespace.test(chr) || printableWhitespaces.indexOf(chr) >= 0;

  return isPrintable;
};

export const removeUnprintableChars = (str: string) =>
  [...str].map((chr) => (isPrintableChar(chr) ? chr : "")).join("");

export const transformEachLine = (
  inputText: string,
  transformer: (line: string, idx?: number) => string,
  remUnprintableChars: boolean | null | undefined = null
) => {
  const inputLines = inputText.split("\n");
  const outputLines = inputLines.map(transformer);

  let outputText = outputLines.join("\n");

  if (remUnprintableChars ?? true) {
    outputText = removeUnprintableChars(outputText);
  }

  return outputText;
};

export const remStartingMatchIfReq = (
  line: string,
  match: RegExpExecArray | null
) => {
  if (match && match.length > 0) {
    line = line.substring(match[0].length);
  }

  return line;
};

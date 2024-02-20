import {
  TextTransformBehaviorData,
  TextTransformItem,
  TextTransformNode,
} from "./core";

export const printableWhitespaces = Object.freeze([" ", "\n", "\t"]);

export const regexes = Object.freeze({
  whitespace: /\s/,
  startWithDigits: /^[\s\d]+/,
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

export const getAllTransformers = () => {
  const rootNodes: TextTransformNode[] = [
    {
      Name: "Misc",
      Description: "Miscelaneous transformers",
      Items: [
        {
          Name: "Rem Line Start Digits",
          Description: "Removes starting digits from each line",
          JsMethod: (inputText) =>
            transformEachLine(inputText, (line) =>
              remStartingMatchIfReq(line, regexes.startWithDigits.exec(line))
            ),
        },
      ],
    },
    {
      Name: "Code",
      Description: "Code transformers",
      ChildNodes: [
        {
          Name: "C#",
          Description: "C# code transformers",
          ChildNodes: [
            {
              Name: "C# Prop Mappings",
              Description: "C# Prop Mappings",
              Items: [
                {
                  Name: "Generate C# Cloneable Types",
                  Description: "Generate C# Cloneable Types",
                  JsMethod: (inputText) =>
                    inputText + " will generate C# cloneable types",
                },
                {
                  Name: "Generate C# Prop Mappings",
                  Description: "Generate C# Prop Mappings",
                  JsMethod: (inputText) =>
                    inputText + " will generate C# prop mappings",
                },
              ],
            },
          ],
        },
        {
          Name: "Javascript",
          Description: "Javascript code transformers",
          Items: [
            {
              Name: "Generate JS Cloneable Types",
              Description: "Generate JS Cloneable Types",
              JsMethod: (inputText) =>
                inputText + " will generate JS cloneable types",
            },
            {
              Name: "Generate JS Prop Mappings",
              Description: "Generate JS Prop Mappings",
              JsMethod: (inputText) =>
                inputText + " will generate JS prop mappings",
            },
          ],
        },
      ],
    },
  ];

  return rootNodes;
};

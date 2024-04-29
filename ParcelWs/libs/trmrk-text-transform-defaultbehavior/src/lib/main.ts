import {
  FontStyle,
  RichTextBoxPseudoMarkup,
  CSharpSyntaxTree,
  TextTransformBehaviorData,
  TextTransformItem,
  TextTransformNode,
} from "../synced-libs/trmrk-text-transform-behavior/core";

import {
  printableWhitespaces,
  regexes,
  isPrintableChar,
  removeUnprintableChars,
  remStartingMatchIfReq,
  transformEachLine,
} from "../synced-libs/trmrk-text-transform-behavior/main";

export const getAllTextTransformers = () => {
  const rootNodes: TextTransformNode[] = [
    {
      Name: "Misc",
      Description: "Miscelaneous transformers",
      TextTransformItems: [
        {
          Name: "Rem Line Start Digits",
          Description: "Removes starting digits from each line",
          JsMethod: (inputText) =>
            transformEachLine(inputText, (line) =>
              remStartingMatchIfReq(line, regexes.startWithDigits.exec(line))
            ),
        },
      ],
      RichTextTransformItems: [],
    },
    {
      Name: "Code",
      Description: "Code transformers",
      ChildNodes: [
        {
          Name: "C#",
          Description: "C# code transformers",
          ChildNodes: [],
        },
        {
          Name: "Javascript",
          Description: "Javascript code transformers",
          TextTransformItems: [],
        },
      ],
    },
  ];

  return rootNodes;
};

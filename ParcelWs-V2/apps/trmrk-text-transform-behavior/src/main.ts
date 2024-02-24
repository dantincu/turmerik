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

var y = "asdf";
var x = FontStyle[y as keyof typeof FontStyle];

export const ngBook2CodeSectionRemStartingDigits = (
  inputText: string,
  pseudoMarkup: RichTextBoxPseudoMarkup,
  csharpSyntaxTree?: CSharpSyntaxTree
) => {
  let i = 0;

  while (i < pseudoMarkup.Lines.length) {
    let line = pseudoMarkup.Lines[i];
    let j = 0;
    let isStartOfLine = true;

    while (j < line.Segments.length) {
      let segment = line.Segments[j];
      const font = segment.Font;

      if (!regexes.whitespaceOnly.test(segment.Text)) {
        if (regexes.digitsOrWhitespaceOnly.test(segment.Text)) {
          if (
            font.FontSize === 7 &&
            [FontStyle.Regular, FontStyle[FontStyle.Regular]].indexOf(
              font.FontStyle
            ) >= 0
          ) {
            line.Segments.splice(j, 1);

            if (!isStartOfLine) {
              const delSegments = line.Segments.splice(
                j,
                line.Segments.length - j
              );

              pseudoMarkup.Lines.splice(i + 1, 0, {
                Segments: delSegments,
              });

              break;
            } else {
              isStartOfLine = false;
              j++;
            }
          } else {
            isStartOfLine = false;
            j++;
          }
        } else {
          isStartOfLine = false;
          j++;
        }
      } else {
        j++;
      }
    }

    i++;
  }

  return pseudoMarkup;
};

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
      RichTextTransformItems: [
        {
          Name: "Ng-Book 2 code sections",
          Description:
            "Removes starting digits from each line from code blocks from Ng-Book 2",
          JsMethod: ngBook2CodeSectionRemStartingDigits,
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
              TextTransformItems: [
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
          TextTransformItems: [
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

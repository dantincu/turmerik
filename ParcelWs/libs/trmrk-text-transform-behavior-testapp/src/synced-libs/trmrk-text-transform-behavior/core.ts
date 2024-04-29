export interface CSharpSyntaxTree {}

export interface Color {
  A: number;
  R: number;
  G: number;
  B: number;
}

export enum FontStyle {
  Regular = 0,
  Bold = 1,
  Italic = 2,
  Underline = 4,
  Strikeout = 8,
}

export interface FontInfo {
  FontFamilyName: string;
  FontSize: number;
  FontStyle: FontStyle | string;
}

export interface RichTextBoxPseudoMarkupSegment {
  StartIdx: number;
  Length?: number | null | undefined;
  Text: string;
  ForegroundColor?: Color | string | null | undefined;
  BackgroundColor?: Color | string | null | undefined;
  Font: FontInfo;
}

export interface RichTextBoxPseudoMarkupLine {
  Segments: RichTextBoxPseudoMarkupSegment[];
}

export interface RichTextBoxPseudoMarkup {
  Lines: RichTextBoxPseudoMarkupLine[];
}

export interface TextTransformBehaviorDataCore {
  TextTransformers: TextTransformNodeCore[];
}

export interface TextTransformNodeCore {
  Name: string;
  Description: string;
  TextTransformItems: TextTransformItemCore[];
  RichTextTransformItems: TextTransformItemCore[];
  ChildNodes: TextTransformNodeCore[];
}

export interface TextTransformItemCore {
  Name: string;
  Description: string;
  JsMethod: string;
  IsValidCSharpCode?: boolean | null | undefined;
}

export interface TextTransformBehaviorData {
  TextTransformers: TextTransformNode[];
}

export interface TextTransformNode {
  Name: string;
  Description: string;
  TextTransformItems?: TextTransformItem[] | null | undefined;
  RichTextTransformItems?: RichTextTransformItem[] | null | undefined;
  ChildNodes?: TextTransformNode[] | null | undefined;
}

export interface TextTransformItem {
  Name: string;
  Description: string;
  JsMethod: (inputText: string, csharpSyntaxTree?: CSharpSyntaxTree) => string;
  IsValidCSharpCode?: boolean | null | undefined;
}

export interface RichTextTransformItem {
  Name: string;
  Description: string;
  JsMethod: (
    inputText: string,
    pseudoMarkup: RichTextBoxPseudoMarkup,
    csharpSyntaxTree?: CSharpSyntaxTree
  ) => RichTextBoxPseudoMarkup;
  IsValidCSharpCode?: boolean | null | undefined;
}

export interface TextTransformBehaviorLib {
  libs: any;
  behavior: TextTransformBehaviorData;
  exportedMembers: TextTransformBehaviorDataCore;
  getExportedMembers: () => TextTransformBehaviorDataCore;
}

export const exportTransformerNode = (
  parentPath: string,
  src: TextTransformNode
): TextTransformNodeCore => {
  const textTransformItemsParentPath = `${parentPath}.TextTransformItems`;
  const richTextTransformItemsParentPath = `${parentPath}.RichTextTransformItems`;
  const childNodesParentPath = `${parentPath}.ChildNodes`;

  return {
    Name: src.Name,
    Description: src.Description,
    TextTransformItems: src.TextTransformItems
      ? src.TextTransformItems.map((item, idx) =>
          exportTransformerItem(
            `${textTransformItemsParentPath}[${idx}].JsMethod`,
            item
          )
        )
      : [],
    RichTextTransformItems: src.RichTextTransformItems
      ? src.RichTextTransformItems.map((item, idx) =>
          exportTransformerItem(
            `${richTextTransformItemsParentPath}[${idx}].JsMethod`,
            item
          )
        )
      : [],
    ChildNodes: src.ChildNodes
      ? src.ChildNodes.map((node, idx) =>
          exportTransformerNode(`${childNodesParentPath}[${idx}]`, node)
        )
      : [],
  };
};

export const exportTransformerItem = (
  jsMethodName: string,
  src: TextTransformItem | RichTextTransformItem
): TextTransformItemCore => ({
  Name: src.Name,
  Description: src.Description,
  JsMethod: jsMethodName,
  IsValidCSharpCode: src.IsValidCSharpCode,
});

export const getExportedMembers = (
  parentPath: string,
  behavior: TextTransformBehaviorData
): TextTransformBehaviorDataCore => {
  const transformersParentPath = `${parentPath}.TextTransformers`;

  return {
    TextTransformers: behavior.TextTransformers.map((node, idx) =>
      exportTransformerNode(`${transformersParentPath}[${idx}]`, node)
    ),
  };
};

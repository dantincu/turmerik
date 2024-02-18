export interface TextTransformBehaviorDataCore {
  Transformers: TextTransformNodeCore[];
}

export interface TextTransformNodeCore {
  Name: string;
  Description: string;
  Items: TextTransformItemCore[];
  ChildNodes: TextTransformNodeCore[];
}

export interface TextTransformItemCore {
  Name: string;
  Description: string;
  JsMethod: string;
  IsValidCSharpCode: boolean;
}

export interface TextTransformBehaviorData {
  Transformers: TextTransformNode[];
}

export interface TextTransformNode {
  Name: string;
  Description: string;
  Items: TextTransformItem[];
  ChildNodes: TextTransformNode[];
}

export interface TextTransformItem {
  Name: string;
  Description: string;
  JsMethod: (inputText: string) => string;
  IsValidCSharpCode: boolean;
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
  const itemsParentPath = `${parentPath}.Items`;
  const childNodesParentPath = `${parentPath}.ChildNodes`;

  return {
    Name: src.Name,
    Description: src.Description,
    Items: src.Items
      ? src.Items.map((item, idx) =>
          exportTransformerItem(`${itemsParentPath}[${idx}]`, item)
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
  src: TextTransformItem
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
  const transformersParentPath = `${parentPath}.Transformers`;

  return {
    Transformers: behavior.Transformers.map((node, idx) =>
      exportTransformerNode(`${transformersParentPath}[${idx}]`, node)
    ),
  };
};

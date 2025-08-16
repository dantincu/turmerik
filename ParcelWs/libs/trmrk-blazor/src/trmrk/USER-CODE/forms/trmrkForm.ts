import { NullOrUndef, VoidOrAny } from '../../core';
import { isNonEmptyStr } from '../../str';

import {
  TrmrkButtonCategory,
  TrmrkFormNode,
  TrmrkNodeCore,
  TrmrkNodeCoreBase,
  TrmrkFormRow,
  TrmrkFormNodeCategory,
  TrmrkTextLevel,
  TrmrkTextStyle,
  TrmrkValueFactory,
  TrmrkDOMNodeAttrs,
  TrmrkTextNode,
  HtmlInputCategory,
  TrmrkComboBoxItem,
  TrmrkOnChangeEventHandler,
  TrmrkOnClickEventHandler,
  TrmrkFormRowCategory,
  NodeHtml,
  TrmrkFormNodeType,
} from './types';

type TrmrkFormTextArgBase1 = [string];

type TrmrkFormTextArgBase2 = [
  ...TrmrkFormTextArgBase1,
  TrmrkTextLevel | NullOrUndef
];

type TrmrkFormTextArgBase3 = [
  ...TrmrkFormTextArgBase2,
  TrmrkTextStyle | NullOrUndef
];

type TrmrkFormTextArgBase4 = [...TrmrkFormTextArgBase3, string | NullOrUndef];
type TrmrkFormTextArgBase5 = [...TrmrkFormTextArgBase4, string | NullOrUndef];

type TrmrkFormTextArgBase6 = [
  ...TrmrkFormTextArgBase5,
  TrmrkDOMNodeAttrs | NullOrUndef
];

type TrmrkFormTextArgBase7<TData = any> = [
  ...TrmrkFormTextArgBase6,
  TData | NullOrUndef
];

type TrmrkFormTextArgBase8<TData = any, THtml = NodeHtml> = [
  ...TrmrkFormTextArgBase7<TData>,
  THtml | NullOrUndef
];

export type TrmrkFormTextArg<TData = any, THtml = NodeHtml> =
  | TrmrkFormTextArgBase1
  | TrmrkFormTextArgBase2
  | TrmrkFormTextArgBase3
  | TrmrkFormTextArgBase4
  | TrmrkFormTextArgBase5
  | TrmrkFormTextArgBase6
  | TrmrkFormTextArgBase7<TData>
  | TrmrkFormTextArgBase8<TData, THtml>;

export interface TrmrkFormHelperExtraArgs<TData = any, THtml = NodeHtml>
  extends TrmrkNodeCoreBase<TData, THtml> {
  onNodeCreated?:
    | ((node: TrmrkNodeCore<TData, THtml>) => VoidOrAny)
    | NullOrUndef;
}

export class TrmrkFormHelper<TData = any, THtml = NodeHtml> {
  static createAssignIdToAttrCallback =
    <TData = any, THtml = NodeHtml>(attrName: string) =>
    (node: TrmrkNodeCore<TData, THtml>) => {
      node.attrs ??= {};
      node.attrs[attrName] = node._id.toString();
    };

  onNodeCreated?:
    | ((node: TrmrkNodeCore<TData, THtml>) => VoidOrAny)
    | NullOrUndef;

  _id = 1;

  constructor(
    onNodeCreated?:
      | ((node: TrmrkNodeCore<TData, THtml>) => VoidOrAny)
      | string
      | NullOrUndef
  ) {
    if ((onNodeCreated ?? null) !== null) {
      const onNodeCreatedType = typeof onNodeCreated;

      if ('function' === onNodeCreatedType) {
        this.onNodeCreated = onNodeCreated as (
          node: TrmrkNodeCore<TData, THtml>
        ) => VoidOrAny;
      } else if ('string' === onNodeCreatedType) {
        const idAttrName = onNodeCreated as string;

        this.onNodeCreated = TrmrkFormHelper.createAssignIdToAttrCallback(
          isNonEmptyStr(idAttrName, true, false) ? idAttrName : 'data-id'
        );
      }
    }
  }

  nodeCoreBase<TNode extends TrmrkNodeCore<TData, THtml>>(
    type: TrmrkFormNodeType,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef,
    callback?: ((node: TNode) => VoidOrAny) | NullOrUndef
  ): TNode {
    let retNode: TNode;

    let onNodeCreated:
      | ((node: TrmrkNodeCore<TData, THtml>) => VoidOrAny)
      | NullOrUndef = null;

    if (xArgs) {
      const { cssClass, data, html, attrs } = xArgs;
      onNodeCreated = xArgs.onNodeCreated;

      retNode = {
        _id: this._id++,
        type,
        cssClass,
        data,
        html,
        attrs,
      } as TNode;
    } else {
      retNode = {} as TNode;
    }

    if (callback) {
      callback(retNode);
    }

    if (this.onNodeCreated) {
      this.onNodeCreated(retNode);
    }

    if (onNodeCreated) {
      onNodeCreated(retNode);
    }

    return retNode;
  }

  rowCore(
    rowType: TrmrkFormRowCategory,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef,
    callback?: ((node: TrmrkFormRow<TData, THtml>) => VoidOrAny) | NullOrUndef
  ) {
    return this.nodeCoreBase<TrmrkFormRow<TData, THtml>>(
      TrmrkFormNodeType.Row,
      xArgs,
      (node) => {
        node.category = rowType;

        if (callback) {
          callback(node);
        }
      }
    );
  }

  nodeCore(
    nodeType: TrmrkFormNodeCategory,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef,
    callback?: ((node: TrmrkFormNode<TData, THtml>) => VoidOrAny) | NullOrUndef
  ) {
    return this.nodeCoreBase<TrmrkFormNode<TData, THtml>>(
      TrmrkFormNodeType.Default,
      xArgs,
      (node) => {
        node.category = nodeType;

        if (callback) {
          callback(node);
        }
      }
    );
  }

  textNodeCore(
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef,
    callback?: ((node: TrmrkTextNode<TData, THtml>) => VoidOrAny) | NullOrUndef
  ) {
    return this.nodeCoreBase<TrmrkTextNode<TData, THtml>>(
      TrmrkFormNodeType.Text,
      xArgs,
      callback
    );
  }

  section(
    rows: TrmrkFormRow<TData, THtml>[],
    heading?: string | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormRow<TData, THtml> {
    return this.rowCore(TrmrkFormRowCategory.Section, xArgs, (node) => {
      node.rows = rows;
      node.label = heading;
    });
  }

  row(
    nodes?: TrmrkFormNode<TData, THtml>[] | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormRow<TData, THtml> {
    return this.rowCore(TrmrkFormRowCategory.Content, xArgs, (node) => {
      node.nodes = nodes;
    });
  }

  blank(
    heightFactor?: number | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormRow<TData, THtml> {
    return this.rowCore(TrmrkFormRowCategory.Blank, xArgs, (node) => {
      node.heightFactor = heightFactor;
    });
  }

  heading(
    text: TrmrkFormTextArg<TData, THtml>[],
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormNode<TData, THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Heading, xArgs, (node) => {
      node.text = text.map((textNode) => this.textNode(textNode));
    });
  }

  textNode(
    nodeArg: TrmrkFormTextArg<TData, THtml> | TrmrkTextNode<TData, THtml>,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkTextNode<TData, THtml> {
    return this.textNodeCore(xArgs, (textNode) => {
      if (
        ((nodeArg as TrmrkFormTextArg<TData, THtml>).length ?? null) !== null
      ) {
        const node = nodeArg as TrmrkFormTextArg<TData, THtml>;
        textNode.text = node[0];
        textNode.level = node[1] ?? TrmrkTextLevel.Default;
        textNode.style = node[2] ?? TrmrkTextStyle.Regular;
        textNode.matIcon = node[3];
        textNode.cssClass = node[4];
        textNode.attrs = node[5];
        textNode.data = node[6];
        textNode.html = node[7];
      } else {
        const node = nodeArg as TrmrkTextNode<TData, THtml>;
        textNode.text = node.text;
        textNode.level = node.level ?? TrmrkTextLevel.Default;
        textNode.style = node.style ?? TrmrkTextStyle.Regular;
        textNode.matIcon = node.matIcon;
        textNode.cssClass = node.cssClass;
        textNode.attrs = node.attrs;
        textNode.data = node.data;
        textNode.html = node.html;
      }
    });
  }

  text(
    nodes: TrmrkFormTextArg<TData, THtml>[],
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormNode<TData, THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Text, xArgs, (node) => {
      node.text = nodes.map((textNode) => this.textNode(textNode));
    });
  }

  input(
    value?: string | NullOrUndef,
    inputType?: HtmlInputCategory | NullOrUndef,
    linesCount?: number | NullOrUndef,
    onChange?: TrmrkOnChangeEventHandler | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormNode<TData, THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Input, xArgs, (node) => {
      node.linesCount = linesCount;
      node.value = value;
      node.inputType = inputType;
      node.onChange = onChange;
    });
  }

  comboBox(
    items: TrmrkValueFactory<string, TrmrkComboBoxItem[]>,
    value?: string | NullOrUndef,
    onChange?: TrmrkOnChangeEventHandler | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormNode<TData, THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Combobox, xArgs, (node) => {
      node.items = items;
      node.value = value;
      node.linesCount = 0;
      node.onChange = onChange;
    });
  }

  button(
    text: TrmrkFormTextArg<TData, THtml>[],
    buttonType?: TrmrkButtonCategory | NullOrUndef,
    onClick?: TrmrkOnClickEventHandler | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormNode<TData, THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Button, xArgs, (node) => {
      node.buttonType = buttonType;
      node.text = text.map((textNode) => this.textNode(textNode));
      node.onClick = onClick;
    });
  }

  loading(
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormNode<TData, THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Loading, xArgs);
  }

  horizRule(
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormNode<TData, THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.HorizRule, xArgs);
  }

  group(
    childNodes: TrmrkFormNode<TData, THtml>[],
    xArgs?: TrmrkFormHelperExtraArgs<TData, THtml> | NullOrUndef
  ): TrmrkFormNode<TData, THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Group, xArgs, (node) => {
      node.childNodes = childNodes;
    });
  }
}

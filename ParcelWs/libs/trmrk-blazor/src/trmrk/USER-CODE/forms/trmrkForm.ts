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

export interface TrmrkFormHelperExtraArgs<THtml = NodeHtml>
  extends TrmrkNodeCoreBase<THtml> {
  onNodeCreated?: ((node: TrmrkNodeCore<THtml>) => VoidOrAny) | NullOrUndef;
}

export class TrmrkFormHelper<THtml = NodeHtml> {
  static createAssignIdToAttrCallback =
    <THtml = NodeHtml>(attrName: string) =>
    (node: TrmrkNodeCore<THtml>) => {
      node.attrs ??= {};
      node.attrs[attrName] = node._id.toString();
    };

  onNodeCreated?: ((node: TrmrkNodeCore<THtml>) => VoidOrAny) | NullOrUndef;

  _id = 1;

  constructor(
    onNodeCreated?:
      | ((node: TrmrkNodeCore<THtml>) => VoidOrAny)
      | string
      | NullOrUndef
  ) {
    if ((onNodeCreated ?? null) !== null) {
      const onNodeCreatedType = typeof onNodeCreated;

      if ('function' === onNodeCreatedType) {
        this.onNodeCreated = onNodeCreated as (
          node: TrmrkNodeCore<THtml>
        ) => VoidOrAny;
      } else if ('string' === onNodeCreatedType) {
        const idAttrName = onNodeCreated as string;

        this.onNodeCreated = TrmrkFormHelper.createAssignIdToAttrCallback(
          isNonEmptyStr(idAttrName, true, false) ? idAttrName : 'data-id'
        );
      }
    }
  }

  nodeCoreBase<TNode extends TrmrkNodeCore<THtml>>(
    type: TrmrkFormNodeType,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef,
    callback?: ((node: TNode) => TNode | VoidOrAny) | NullOrUndef
  ): TNode {
    let retNode: TNode;

    let onNodeCreated:
      | ((node: TrmrkNodeCore<THtml>) => VoidOrAny)
      | NullOrUndef = null;

    if (xArgs) {
      retNode = xArgs as TNode;
      retNode._id = this._id++;
      retNode.type = type;

      onNodeCreated = xArgs.onNodeCreated;
    } else {
      retNode = {} as TNode;
    }

    if (callback) {
      retNode = callback(retNode) ?? retNode;
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
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef,
    callback?: ((node: TrmrkFormRow<THtml>) => VoidOrAny) | NullOrUndef
  ) {
    return this.nodeCoreBase<TrmrkFormRow<THtml>>(
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
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef,
    callback?: ((node: TrmrkFormNode<THtml>) => VoidOrAny) | NullOrUndef
  ) {
    return this.nodeCoreBase<TrmrkFormNode<THtml>>(
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
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef,
    callback?: ((node: TrmrkTextNode<THtml>) => VoidOrAny) | NullOrUndef
  ) {
    return this.nodeCoreBase<TrmrkTextNode<THtml>>(
      TrmrkFormNodeType.Text,
      xArgs,
      callback
    );
  }

  section(
    rows: TrmrkFormRow<THtml>[],
    heading?: string | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormRow<THtml> {
    return this.rowCore(TrmrkFormRowCategory.Section, xArgs, (node) => {
      node.rows = rows;
      node.label = heading;
    });
  }

  row(
    nodes?: TrmrkFormNode<THtml>[] | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormRow<THtml> {
    return this.rowCore(TrmrkFormRowCategory.Content, xArgs, (node) => {
      node.nodes = nodes;
    });
  }

  blank(
    heightFactor?: number | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormRow<THtml> {
    return this.rowCore(TrmrkFormRowCategory.Blank, xArgs, (node) => {
      node.heightFactor = heightFactor;
    });
  }

  heading(
    text: TrmrkTextNode<THtml>[],
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Heading, xArgs, (node) => {
      node.text = text.map((textNode) => this.textNode(textNode));
    });
  }

  textNode(
    node: TrmrkTextNode<THtml>,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkTextNode<THtml> {
    return this.textNodeCore(xArgs, (textNode) => {
      textNode.text = node.text ?? textNode.text;
      textNode.level = node.level ?? textNode.level ?? TrmrkTextLevel.Default;
      textNode.style = node.style ?? textNode.style ?? TrmrkTextStyle.Regular;
      textNode.iconName = node.iconName ?? textNode.text;
      textNode.cssClass = node.cssClass ?? textNode.text;
      textNode.controlClass = node.controlClass ?? textNode.text;
      textNode.attrs = node.attrs ?? textNode.attrs;
      textNode.html = node.html ?? textNode.html;

      textNode.useEnhancedControl =
        node.useEnhancedControl ?? textNode.useEnhancedControl;
    });
  }

  text(
    nodes: TrmrkTextNode<THtml>[],
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Text, xArgs, (node) => {
      node.text = nodes.map((textNode) => this.textNode(textNode));
    });
  }

  input(
    value?: string | NullOrUndef,
    inputType?: HtmlInputCategory | NullOrUndef,
    linesCount?: number | NullOrUndef,
    onChange?: TrmrkOnChangeEventHandler | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
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
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Combobox, xArgs, (node) => {
      node.items = items;
      node.value = value;
      node.linesCount = 0;
      node.onChange = onChange;
    });
  }

  button(
    text: TrmrkTextNode<THtml>[],
    buttonType?: TrmrkButtonCategory | NullOrUndef,
    onClick?: TrmrkOnClickEventHandler | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Button, xArgs, (node) => {
      node.buttonType = buttonType;
      node.text = text.map((textNode) => this.textNode(textNode));
      node.onClick = onClick;
    });
  }

  loading(
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Loading, xArgs);
  }

  horizRule(
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.HorizRule, xArgs);
  }

  group(
    childNodes: TrmrkFormNode<THtml>[],
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Group, xArgs, (node) => {
      node.childNodes = childNodes;
    });
  }
}

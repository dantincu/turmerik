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
  TrmrkTextNode,
  HtmlInputCategory,
  TrmrkComboBoxItem,
  TrmrkComboboxChangeEventHandler,
  TrmrkChangeEventHandler,
  TrmrkClickEventHandler,
  TrmrkFormRowCategory,
  NodeHtml,
  TrmrkFormNodeType,
  TrmrkItemsValueFactoryArg,
} from './types';

export interface TrmrkFormHelperExtraArgs<THtml = NodeHtml>
  extends TrmrkNodeCoreBase<THtml> {
  onNodeCreated?: ((node: TrmrkNodeCore<THtml>) => VoidOrAny) | NullOrUndef;
}

export const retrieveValuesFromFactory = async <TInput, TOutput>(
  factory: TrmrkValueFactory<TInput, TOutput>,
  input: TInput,
  asyncFlagSetter?: ((showSpinner: boolean) => VoidOrAny) | NullOrUndef
) => {
  let retVal: TOutput;

  if (factory.func) {
    if (factory.isAsync) {
      if (asyncFlagSetter) {
        asyncFlagSetter(true);
      }

      retVal = await factory.func(input);

      if (asyncFlagSetter) {
        asyncFlagSetter(false);
      }
    } else {
      retVal = factory.func(input) as TOutput;
    }
  } else {
    retVal = factory.value!;
  }

  return retVal;
};

export const refreshFactoryValues = async <TInput, TOutput>(
  factory: TrmrkValueFactory<TInput, TOutput>,
  input: TInput,
  asyncFlagSetter?: ((showSpinner: boolean) => VoidOrAny) | NullOrUndef
) => {
  const output = await retrieveValuesFromFactory(
    factory,
    input,
    asyncFlagSetter
  );

  factory.value = output;
};

export interface TrmrkFormHelperOpts<THtml = NodeHtml> {
  idSeed?: number | NullOrUndef;
  idAttrName?: string | NullOrUndef;
  nextIdFactory?:
    | ((node: TrmrkNodeCore<THtml>, nextId: number) => string)
    | NullOrUndef;
  onNodeCreated?: ((node: TrmrkNodeCore<THtml>) => VoidOrAny) | NullOrUndef;
}

export class TrmrkFormHelper<THtml = NodeHtml> {
  defaultOnNodeCreated = (node: TrmrkNodeCore<THtml>) => {
    node.attrs ??= {};

    if (this.idAttrName) {
      node.attrs[this.idAttrName] = node.id;
    }
  };

  id: number;
  idAttrName: string;

  nextIdFactory: (node: TrmrkNodeCore<THtml>, nextId: number) => string;
  onNodeCreated: (node: TrmrkNodeCore<THtml>) => VoidOrAny;

  constructor(opts?: TrmrkFormHelperOpts<THtml> | NullOrUndef) {
    opts ??= {};
    this.id = opts.idSeed ?? 1;
    this.idAttrName = opts.idAttrName ?? 'data-trmrk-id';

    if (opts.onNodeCreated) {
      this.onNodeCreated = (node) => {
        this.defaultOnNodeCreated(node);
        (opts.onNodeCreated as (node: TrmrkNodeCore<THtml>) => VoidOrAny)(node);
      };
    } else {
      this.onNodeCreated = this.defaultOnNodeCreated;
    }

    this.nextIdFactory =
      opts.nextIdFactory ?? ((_, nextId) => nextId.toString());
  }

  getNextId(node: TrmrkNodeCore<THtml>): string {
    const nextId = this.nextIdFactory(node, this.id++);
    return nextId;
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
      retNode.type = type;
      retNode.id = this.getNextId(retNode).toString();
      onNodeCreated = xArgs.onNodeCreated;
    } else {
      retNode = {} as TNode;
    }

    if (callback) {
      retNode = callback(retNode) ?? retNode;
    }

    this.onNodeCreated(retNode);

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
    onChange?: TrmrkChangeEventHandler | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Input, xArgs, (node) => {
      node.linesCount = linesCount;
      node.value = value;
      node.inputType = inputType;
      node.change = onChange;
    });
  }

  comboBox(
    items: TrmrkValueFactory<TrmrkItemsValueFactoryArg, TrmrkComboBoxItem[]>,
    value?: string | NullOrUndef,
    onComboboxChange?: TrmrkComboboxChangeEventHandler | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Combobox, xArgs, (node) => {
      node.items = items;
      node.value = value;
      node.linesCount = 0;
      node.comboboxChange = onComboboxChange;
    });
  }

  button(
    text: TrmrkTextNode<THtml>[],
    buttonType?: TrmrkButtonCategory | NullOrUndef,
    onClick?: TrmrkClickEventHandler | NullOrUndef,
    xArgs?: TrmrkFormHelperExtraArgs<THtml> | NullOrUndef
  ): TrmrkFormNode<THtml> {
    return this.nodeCore(TrmrkFormNodeCategory.Button, xArgs, (node) => {
      node.buttonType = buttonType;
      node.text = text.map((textNode) => this.textNode(textNode));
      node.click = onClick;
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

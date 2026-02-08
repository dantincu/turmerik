import { NullOrUndef, actWithValIf, RefLazyValue } from "@/src/trmrk/core";
import { mapRecordProps, forEachRecordProp } from "@/src/trmrk/obj";
import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";

export interface HtmlNodeWrapperArgsCore<
  TNode extends Node,
  TArgs extends HtmlNodeWrapperArgsCore<TNode, TArgs>,
> {
  nodeFactory?: ((args: TArgs) => TNode) | NullOrUndef;
}

export interface HtmlNodeWrapperArgs<
  TNode extends Node = Node,
> extends HtmlNodeWrapperArgsCore<TNode, HtmlNodeWrapperArgs<TNode>> {}

export class HtmlNodeWrapper<
  TNode extends Node = Node,
  TArgs extends HtmlNodeWrapperArgsCore<TNode, TArgs> =
    HtmlNodeWrapperArgs<TNode>,
> extends TrmrkDisposableBase {
  args: TArgs;
  node: TNode;
  nodeName: string;

  constructor(args: TArgs) {
    super();
    this.args = this.normalizeArgs(args);
    this.node = this.args.nodeFactory!(this.args);
    this.nodeName = this.node.nodeName;
  }

  disposeCore() {
    this.node = null!;
    this.args = null!;
  }

  mount() {}
  unMount() {}

  normalizeArgs(args: TArgs): TArgs {
    if (!args.nodeFactory) {
      throw new Error("nodeFactory is required");
    }

    return args;
  }
}

export interface HtmlTextNodeWrapperArgs extends HtmlNodeWrapperArgsCore<
  Text,
  HtmlTextNodeWrapperArgs
> {
  text: string;
}

export class HtmlTextNodeWrapper extends HtmlNodeWrapper<
  Text,
  HtmlTextNodeWrapperArgs
> {
  constructor(args: HtmlTextNodeWrapperArgs) {
    super(args);
  }

  override normalizeArgs(
    args: HtmlTextNodeWrapperArgs,
  ): HtmlTextNodeWrapperArgs {
    args = { ...args };
    args.nodeFactory ??= () => document.createTextNode(args.text);
    return super.normalizeArgs(args);
  }
}

export type HtmlElementWrapperEventHandler<TElement extends HTMLElement> = (
  this: TElement,
  ev: Event,
) => any;

export interface HtmlElementWrapperEventListenerOpts<
  TElement extends HTMLElement = HTMLElement,
> {
  addOpts?: boolean | AddEventListenerOptions | NullOrUndef;
  handler: HtmlElementWrapperEventHandler<TElement>;
}

export interface BasicHtmlElementWrapperArgsCore<
  TElement extends HTMLElement,
  TArgs extends BasicHtmlElementWrapperArgsCore<TElement, TArgs>,
> extends HtmlNodeWrapperArgsCore<TElement, TArgs> {
  nodeName: string;
  attrs?: Record<string, string | NullOrUndef> | NullOrUndef;
  classList?: string | string[] | NullOrUndef;
  children?: (() => HtmlNodeWrapper[] | NullOrUndef) | NullOrUndef;
}

export interface BasicHtmlElementWrapperArgs<
  TElement extends HTMLElement = HTMLElement,
> extends BasicHtmlElementWrapperArgsCore<
  TElement,
  BasicHtmlElementWrapperArgs<TElement>
> {}

export class BasicHtmlElementWrapper<
  TElement extends HTMLElement = HTMLElement,
  TArgs extends BasicHtmlElementWrapperArgsCore<TElement, TArgs> =
    BasicHtmlElementWrapperArgs<TElement>,
> extends HtmlNodeWrapper<TElement, TArgs> {
  children: HtmlNodeWrapper[] = [];

  constructor(args: TArgs) {
    super(args);
  }

  override normalizeArgs(args: TArgs): TArgs {
    args = { ...args };
    args.nodeFactory ??= this.createElement.bind(this);
    args.classList ??= [];
    args.attrs ??= {};
    args.children ??= () => null;
    return super.normalizeArgs(args);
  }

  override disposeCore() {
    for (let childWrapper of this.children) {
      childWrapper.dispose();
    }

    this.children = [];
    super.disposeCore();
  }

  createElement(args: TArgs) {
    this.children = args.children!() ?? [];
    const node = document.createElement(args.nodeName) as TElement;

    for (let attrName in args.attrs) {
      const attrValue = args.attrs![attrName];

      if ((attrValue ?? null) !== null) {
        node.setAttribute(attrName, attrValue!);
      }
    }

    for (let className of args.classList!) {
      node.classList.add(className);
    }

    for (let childWrapper of this.children) {
      childWrapper.mount();
      node.appendChild(childWrapper.node);
    }

    return node;
  }
}

export interface HtmlElementWrapperArgsCore<
  TElement extends HTMLElement,
  TArgs extends BasicHtmlElementWrapperArgsCore<TElement, TArgs>,
  TExtra = any,
> extends BasicHtmlElementWrapperArgsCore<TElement, TArgs> {
  evts?:
    | Record<
        keyof HTMLElementEventMap,
        | HtmlElementWrapperEventHandler<TElement>
        | HtmlElementWrapperEventListenerOpts<TElement>
      >
    | NullOrUndef;
  beforeCreate?: ((args: TArgs) => void) | NullOrUndef;
  afterCreate?: ((args: TArgs) => void) | NullOrUndef;
  beforeDispose?:
    | ((wrapper: HtmlElementWrapper<TElement, TArgs, TExtra>) => void)
    | NullOrUndef;
  beforeMount?:
    | ((wrapper: HtmlElementWrapper<TElement, TArgs, TExtra>) => void)
    | NullOrUndef;
  afterMount?:
    | ((wrapper: HtmlElementWrapper<TElement, TArgs, TExtra>) => void)
    | NullOrUndef;
  beforeUnmount?:
    | ((wrapper: HtmlElementWrapper<TElement, TArgs, TExtra>) => void)
    | NullOrUndef;
  afterUnmount?:
    | ((wrapper: HtmlElementWrapper<TElement, TArgs, TExtra>) => void)
    | NullOrUndef;
  x?: TExtra;
}

export interface HtmlElementWrapperArgs<
  TElement extends HTMLElement = HTMLElement,
> extends HtmlElementWrapperArgsCore<
  TElement,
  HtmlElementWrapperArgs<TElement>
> {}

export class HtmlElementWrapper<
  TElement extends HTMLElement,
  TArgs extends HtmlElementWrapperArgsCore<TElement, TArgs, TExtra>,
  TExtra = any,
> extends BasicHtmlElementWrapper<TElement, TArgs> {
  x!: TExtra;

  constructor(args: TArgs) {
    super(args);
  }

  override normalizeArgs(args: TArgs): TArgs {
    args = super.normalizeArgs(args);
    this.x = args.x!;

    args.evts = mapRecordProps<
      keyof HTMLElementEventMap,
      | HtmlElementWrapperEventHandler<TElement>
      | HtmlElementWrapperEventListenerOpts<TElement>
    >(
      args.evts ??
        ({} as Record<
          keyof HTMLElementEventMap,
          | HtmlElementWrapperEventHandler<TElement>
          | HtmlElementWrapperEventListenerOpts<TElement>
        >),
      (evtHandlerOrOpts) => {
        if (typeof evtHandlerOrOpts === "function") {
          return {
            handler: evtHandlerOrOpts,
          };
        } else {
          return evtHandlerOrOpts;
        }
      },
    );

    return args;
  }

  override createElement(args: TArgs) {
    actWithValIf(args.beforeCreate, () => args.beforeCreate!(args));
    const node = super.createElement(args);
    actWithValIf(args.afterCreate, () => args.afterCreate!(args));
    return node;
  }

  override disposeCore() {
    const args = this.args;
    actWithValIf(args.beforeDispose, () => args.beforeDispose!(this));
    this.removeEventListeners(this.args, this.node);
    super.disposeCore();
    this.x = null as any;
  }

  override mount() {
    actWithValIf(this.args.beforeMount, () => this.args.beforeMount!(this));

    for (let childWrapper of this.children) {
      childWrapper.mount();
    }

    this.addEventListeners(this.args, this.node);
    actWithValIf(this.args.afterMount, () => this.args.afterMount!(this));
  }

  override unMount() {
    actWithValIf(this.args.beforeUnmount, () => this.args.beforeUnmount!(this));
    this.removeEventListeners(this.args, this.node);

    for (let childWrapper of this.children) {
      childWrapper.unMount();
    }

    actWithValIf(this.args.afterMount, () => this.args.afterUnmount!(this));
  }

  spliceChildren(
    startFactory: (length: number) => number,
    deleteCountFactory?:
      | ((start: number, length: number) => number)
      | NullOrUndef,
    items?: HtmlNodeWrapper[] | NullOrUndef,
  ) {
    let start = startFactory(this.children.length);

    if (start < 0) {
      start = this.children.length + start;
    }

    deleteCountFactory ??= () => 0;
    items ??= [];
    const deleteCount = deleteCountFactory(start, this.children.length);
    const removedItems = this.children.splice(start, deleteCount, ...items);

    for (let wrapper of removedItems) {
      this.node.removeChild(wrapper.node);
      wrapper.unMount();
    }

    for (let wrapper of items) {
      wrapper.mount();
    }

    if (start === 0) {
      this.node.prepend(...items.map((item) => item.node));
    } else if (start >= this.children.length) {
      this.node.append(...items.map((item) => item.node));
    } else {
      const beforeNode = this.children[start].node;

      for (let item of items) {
        this.node.insertBefore(item.node, beforeNode);
      }
    }

    return removedItems;
  }

  appendChildren(children: HtmlNodeWrapper[]) {
    this.children.push(...children);

    for (let childWrapper of children) {
      childWrapper.mount();
      this.node.appendChild(childWrapper.node);
    }
  }

  addEventListeners(args: TArgs, node: TElement) {
    forEachRecordProp<
      keyof HTMLElementEventMap,
      HtmlElementWrapperEventListenerOpts<TElement>,
      Record<
        keyof HTMLElementEventMap,
        HtmlElementWrapperEventListenerOpts<TElement>
      >
    >(
      args.evts as Record<
        keyof HTMLElementEventMap,
        HtmlElementWrapperEventListenerOpts<TElement>
      >,
      (evtHandlerOpts, evtName) => {
        node.addEventListener(
          evtName,
          evtHandlerOpts.handler,
          evtHandlerOpts.addOpts ?? undefined,
        );
      },
    );
  }

  removeEventListeners(args: TArgs, node: TElement) {
    forEachRecordProp<
      keyof HTMLElementEventMap,
      HtmlElementWrapperEventListenerOpts<TElement>,
      Record<
        keyof HTMLElementEventMap,
        HtmlElementWrapperEventListenerOpts<TElement>
      >
    >(
      args.evts as Record<
        keyof HTMLElementEventMap,
        HtmlElementWrapperEventListenerOpts<TElement>
      >,
      (evtHandlerOpts, evtName) => {
        node.removeEventListener(
          evtName,
          evtHandlerOpts.handler,
          evtHandlerOpts.addOpts ?? undefined,
        );
      },
    );
  }
}

export class HtmlNodeFactory {
  node<TNode extends Node, TArgs extends HtmlNodeWrapperArgsCore<TNode, TArgs>>(
    args: TArgs,
  ) {
    return new HtmlNodeWrapper<TNode, TArgs>(args);
  }

  text(text: string) {
    return new HtmlTextNodeWrapper({
      text,
    });
  }

  basic<
    TElement extends HTMLElement = HTMLElement,
    TArgs extends BasicHtmlElementWrapperArgsCore<TElement, TArgs> =
      BasicHtmlElementWrapperArgs<TElement>,
  >(args: TArgs) {
    return new BasicHtmlElementWrapper<TElement, TArgs>(args);
  }
}

export const defaultHtmlNodeFactory = new RefLazyValue(
  () => new HtmlNodeFactory(),
);

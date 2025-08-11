import { NullOrUndef } from '../../core';

import {
  ButtonType,
  FormNode,
  FormRow,
  NodeType,
  TextLevel,
  TextStyle,
  ValueFactory,
  DOMNodeAttrs,
  TextNode,
  HtmlInputType,
  ComboBoxItem,
  OnChangeEventHandler,
  OnClickEventHandler,
  RowType,
} from './types';

type TrmrkFormTextArgBase1 = [string];
type TrmrkFormTextArgBase2 = [
  ...TrmrkFormTextArgBase1,
  TextLevel | NullOrUndef
];
type TrmrkFormTextArgBase3 = [
  ...TrmrkFormTextArgBase2,
  TextStyle | NullOrUndef
];
type TrmrkFormTextArgBase4 = [
  ...TrmrkFormTextArgBase3,
  TrmrkFormTextArgType | NullOrUndef
];
type TrmrkFormTextArgBase5 = [...TrmrkFormTextArgBase4, string | NullOrUndef];

export type TrmrkFormTextArg =
  | TrmrkFormTextArgBase1
  | TrmrkFormTextArgBase2
  | TrmrkFormTextArgBase3
  | TrmrkFormTextArgBase4
  | TrmrkFormTextArgBase5;

export enum TrmrkFormTextArgType {
  Text = 0,
  MatIcon,
  IconSvg,
}

export class TrmrkFormHelper {
  section(
    rows: FormRow[],
    heading?: TrmrkFormTextArg[] | NullOrUndef,
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormRow {
    return {
      type: RowType.Section,
      rows,
      heading: heading?.map(this.textNode),
      cssClass,
      data,
    };
  }

  row(
    nodes?: FormNode[] | NullOrUndef,
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormRow {
    return {
      type: RowType.Content,
      nodes,
      cssClass,
      data,
    };
  }

  blank(
    heightFactor?: number | NullOrUndef,
    data?: any | NullOrUndef
  ): FormRow {
    return {
      type: RowType.Blank,
      heightFactor,
      data,
    };
  }

  heading(
    text: TrmrkFormTextArg[],
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode {
    return {
      type: NodeType.Heading,
      text: text.map(this.textNode),
      cssClass,
      data,
    };
  }

  textNode(node: TrmrkFormTextArg, data?: any | NullOrUndef): TextNode {
    return {
      text: node[0],
      level: node[1] ?? TextLevel.Default,
      style: node[2] ?? TextStyle.Regular,
      matIcon: node[3] === TrmrkFormTextArgType.MatIcon ? node[0] : null,
      iconSvg: node[3] === TrmrkFormTextArgType.IconSvg ? node[0] : null,
      cssClass: node[4],
      data,
    };
  }

  text(
    nodes: TrmrkFormTextArg[],
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode {
    return {
      type: NodeType.Text,
      text: nodes.map(this.textNode),
      cssClass,
      data,
    };
  }

  input(
    value?: string | NullOrUndef,
    inputType?: HtmlInputType | NullOrUndef,
    linesCount?: number | NullOrUndef,
    onChange?: OnChangeEventHandler | NullOrUndef,
    cssClass?: string | NullOrUndef,
    attrs?: DOMNodeAttrs | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode {
    return {
      type: NodeType.Input,
      linesCount,
      value,
      inputType,
      onChange,
      cssClass,
      attrs,
      data,
    };
  }

  comboBox(
    items: ValueFactory<string, ComboBoxItem[]>,
    value?: string | NullOrUndef,
    onChange?: OnChangeEventHandler | NullOrUndef,
    cssClass?: string | NullOrUndef,
    attrs?: DOMNodeAttrs | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode {
    return {
      type: NodeType.Combobox,
      items,
      value,
      linesCount: 0,
      onChange,
      cssClass,
      attrs,
      data,
    };
  }

  button(
    text: TrmrkFormTextArg[],
    buttonType?: ButtonType | NullOrUndef,
    onClick?: OnClickEventHandler | NullOrUndef,
    cssClass?: string | NullOrUndef,
    attrs?: DOMNodeAttrs | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode {
    return {
      type: NodeType.Button,
      buttonType,
      text: text.map(this.textNode),
      onClick,
      cssClass: cssClass,
      attrs,
      data,
    };
  }

  loading(cssClass?: string | NullOrUndef, data?: any | NullOrUndef): FormNode {
    return {
      type: NodeType.Loading,
      cssClass,
      data,
    };
  }

  horizRule(
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode {
    return {
      type: NodeType.HorizRule,
      cssClass,
      data,
    };
  }
}

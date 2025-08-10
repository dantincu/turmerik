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

type TextArgBase1 = [string];
type TextArgBase2 = [...TextArgBase1, TextLevel | NullOrUndef];
type TextArgBase3 = [...TextArgBase2, TextStyle | NullOrUndef];
type TextArgBase4 = [...TextArgBase3, TextArgType | NullOrUndef];
type TextArgBase5 = [...TextArgBase4, string | NullOrUndef];

export type TextArg =
  | TextArgBase1
  | TextArgBase2
  | TextArgBase3
  | TextArgBase4
  | TextArgBase5;

export enum TextArgType {
  Text = 0,
  MatIcon,
  IconSvg,
}

export const form = {
  section: (
    rows: FormRow[],
    heading?: TextArg[] | NullOrUndef,
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormRow => ({
    type: RowType.Section,
    rows,
    heading: heading?.map(form.textNode),
    cssClass,
    data,
  }),
  row: (
    nodes?: FormNode[] | NullOrUndef,
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormRow => ({
    type: RowType.Content,
    nodes,
    cssClass,
    data,
  }),
  blank: (
    heightFactor?: number | NullOrUndef,
    data?: any | NullOrUndef
  ): FormRow => ({
    type: RowType.Blank,
    heightFactor,
    data,
  }),
  heading: (
    text: TextArg[],
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode => ({
    type: NodeType.Heading,
    text: text.map(form.textNode),
    cssClass,
    data,
  }),
  textNode: (node: TextArg, data?: any | NullOrUndef): TextNode => ({
    text: node[0],
    level: node[1] ?? TextLevel.Default,
    style: node[2] ?? TextStyle.Regular,
    matIcon: node[3] === TextArgType.MatIcon ? node[0] : null,
    iconSvg: node[3] === TextArgType.IconSvg ? node[0] : null,
    cssClass: node[4],
    data,
  }),
  text: (
    nodes: TextArg[],
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode => ({
    type: NodeType.Text,
    text: nodes.map(form.textNode),
    cssClass,
    data,
  }),
  input: (
    value?: string | NullOrUndef,
    inputType?: HtmlInputType | NullOrUndef,
    linesCount?: number | NullOrUndef,
    onChange?: OnChangeEventHandler | NullOrUndef,
    cssClass?: string | NullOrUndef,
    attrs?: DOMNodeAttrs | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode => ({
    type: NodeType.Input,
    linesCount,
    value,
    inputType,
    onChange,
    cssClass,
    attrs,
    data,
  }),
  comboBox: (
    items: ValueFactory<string, ComboBoxItem[]>,
    value?: string | NullOrUndef,
    onChange?: OnChangeEventHandler | NullOrUndef,
    cssClass?: string | NullOrUndef,
    attrs?: DOMNodeAttrs | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode => ({
    type: NodeType.Combobox,
    items,
    value,
    linesCount: 0,
    onChange,
    cssClass,
    attrs,
    data,
  }),
  button: (
    text: TextArg[],
    buttonType?: ButtonType | NullOrUndef,
    onClick?: OnClickEventHandler | NullOrUndef,
    cssClass?: string | NullOrUndef,
    attrs?: DOMNodeAttrs | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode => ({
    type: NodeType.Button,
    buttonType,
    text: text.map(form.textNode),
    onClick,
    cssClass: cssClass,
    attrs,
    data,
  }),
  loading: (
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode => ({
    type: NodeType.Loading,
    cssClass,
    data,
  }),
  horizRule: (
    cssClass?: string | NullOrUndef,
    data?: any | NullOrUndef
  ): FormNode => ({
    type: NodeType.HorizRule,
    cssClass,
    data,
  }),
};

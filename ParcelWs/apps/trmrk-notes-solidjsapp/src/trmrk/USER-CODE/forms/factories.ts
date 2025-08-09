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
type TextArgBase2 = [...TextArgBase1, TextLevel | null | undefined];
type TextArgBase3 = [...TextArgBase2, TextStyle | null | undefined];
type TextArgBase4 = [...TextArgBase3, TextArgType | null | undefined];
type TextArgBase5 = [...TextArgBase4, string | null | undefined];

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
    heading?: TextArg[] | null | undefined,
    cssClass?: string | null | undefined,
    data?: any | null | undefined
  ): FormRow => ({
    type: RowType.Section,
    rows,
    heading: heading?.map(form.textNode),
    cssClass,
    data,
  }),
  row: (
    nodes?: FormNode[] | null | undefined,
    cssClass?: string | null | undefined,
    data?: any | null | undefined
  ): FormRow => ({
    type: RowType.Content,
    nodes,
    cssClass,
    data,
  }),
  blank: (
    heightFactor?: number | null | undefined,
    data?: any | null | undefined
  ): FormRow => ({
    type: RowType.Blank,
    heightFactor,
    data,
  }),
  heading: (
    text: TextArg[],
    cssClass?: string | null | undefined,
    data?: any | null | undefined
  ): FormNode => ({
    type: NodeType.Heading,
    text: text.map(form.textNode),
    cssClass,
    data,
  }),
  textNode: (node: TextArg, data?: any | null | undefined): TextNode => ({
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
    cssClass?: string | null | undefined,
    data?: any | null | undefined
  ): FormNode => ({
    type: NodeType.Text,
    text: nodes.map(form.textNode),
    cssClass,
    data,
  }),
  input: (
    value?: string | null | undefined,
    inputType?: HtmlInputType | null | undefined,
    linesCount?: number | null | undefined,
    onChange?: OnChangeEventHandler | null | undefined,
    cssClass?: string | null | undefined,
    attrs?: DOMNodeAttrs | null | undefined,
    data?: any | null | undefined
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
    value?: string | null | undefined,
    onChange?: OnChangeEventHandler | null | undefined,
    cssClass?: string | null | undefined,
    attrs?: DOMNodeAttrs | null | undefined,
    data?: any | null | undefined
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
    buttonType?: ButtonType | null | undefined,
    onClick?: OnClickEventHandler | null | undefined,
    cssClass?: string | null | undefined,
    attrs?: DOMNodeAttrs | null | undefined,
    data?: any | null | undefined
  ): FormNode => ({
    type: NodeType.Button,
    buttonType,
    text: text.map(form.textNode),
    onClick,
    cssClass: cssClass,
    attrs,
    data,
  }),
  horizRule: (
    cssClass?: string | null | undefined,
    data?: any | null | undefined
  ): FormNode => ({
    type: NodeType.HorizRule,
    cssClass,
    data,
  }),
};

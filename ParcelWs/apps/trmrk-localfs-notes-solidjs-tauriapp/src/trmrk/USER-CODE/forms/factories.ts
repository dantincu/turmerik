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

export type TextArg = [
  string,
  TextLevel | null | undefined,
  TextStyle | null | undefined,
  TextArgType | null | undefined,
  string | null | undefined
];

export enum TextArgType {
  Text = 0,
  MatIcon,
  IconSvg,
}

export const createTextNode = (node: TextArg): TextNode => ({
  text: node[0],
  level: node[1] ?? TextLevel.Default,
  style: node[2] ?? TextStyle.Regular,
  matIcon: node[3] === TextArgType.MatIcon ? node[0] : null,
  iconSvg: node[3] === TextArgType.IconSvg ? node[0] : null,
  cssClass: node[4],
});

export const form = {
  section: (
    rows: FormRow[],
    cssClass?: string | null | undefined
  ): FormRow => ({
    type: RowType.Section,
    rows,
    cssClass,
  }),
  row: (
    nodes?: FormNode[] | null | undefined,
    cssClass?: string | null | undefined
  ): FormRow => ({
    type: RowType.Content,
    nodes,
    cssClass,
  }),
  blank: (heightFactor?: number | null | undefined): FormRow => ({
    type: RowType.Blank,
    heightFactor,
  }),
  heading: (
    text: TextArg[],
    cssClass?: string | null | undefined
  ): FormNode => ({
    type: NodeType.Heading,
    text: text.map(createTextNode),
    cssClass,
  }),
  text: (nodes: TextArg[], cssClass?: string | null | undefined): FormNode => ({
    type: NodeType.Text,
    text: nodes.map(createTextNode),
    cssClass,
  }),
  input: (
    value?: string | null | undefined,
    inputType?: HtmlInputType | null | undefined,
    linesCount?: number | null | undefined,
    onChange?: OnChangeEventHandler | null | undefined,
    cssClass?: string | null | undefined,
    attrs?: DOMNodeAttrs | null | undefined
  ): FormNode => ({
    type: NodeType.Input,
    linesCount,
    value,
    inputType,
    onChange,
    cssClass,
    attrs,
  }),
  comboBox: (
    items: ValueFactory<string, ComboBoxItem>,
    value?: string | null | undefined,
    onChange?: OnChangeEventHandler | null | undefined,
    cssClass?: string | null | undefined,
    attrs?: DOMNodeAttrs | null | undefined
  ): FormNode => ({
    type: NodeType.Combobox,
    items,
    value,
    linesCount: 0,
    onChange,
    cssClass,
    attrs,
  }),
  button: (
    text: TextArg[],
    buttonType?: ButtonType | null | undefined,
    onClick?: OnClickEventHandler | null | undefined,
    cssClass?: string | null | undefined,
    attrs?: DOMNodeAttrs | null | undefined
  ): FormNode => ({
    type: NodeType.Button,
    buttonType,
    text: text.map(createTextNode),
    onClick,
    cssClass: cssClass,
    attrs,
  }),
  horizRule: (cssClass?: string | null | undefined): FormNode => ({
    type: NodeType.HorizRule,
    cssClass,
  }),
};

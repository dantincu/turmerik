import { NullOrUndef, VoidOrAny } from '../../core';

export enum NodeType {
  Text = 0,
  Heading,
  Input,
  Combobox,
  Button,
  HorizRule,
  Group,
  Field,
}

export enum ButtonType {
  None = 0,
  Primary,
  Secondary,
  Accept,
  Reject,
}

export enum TextLevel {
  Default = 0,
  Info,
  Warning,
  Error,
}

export enum TextStyle {
  Regular = 0,
  Italic = 1,
  Bold = 2,
  Underline = 4,
  Strike = 8,
  Code = 16,
}

export enum RowType {
  Content = 0,
  Section,
  Blank,
}

export type HtmlInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'search'
  | 'tel'
  | 'url'
  | 'number'
  | 'range'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'hidden'
  | 'submit'
  | 'reset'
  | 'button';

export interface ValueFactory<TInput, TOutput> {
  value?: TOutput | NullOrUndef;
  factory?: ((input: TInput) => TOutput | Promise<TOutput>) | NullOrUndef;
  isAsync?: boolean | NullOrUndef;
}

export interface NodeCore {
  cssClass?: string | NullOrUndef;
  data?: any | NullOrUndef;
}

export interface TextNode extends NodeCore {
  text?: string;
  level?: TextLevel | NullOrUndef;
  style?: TextStyle | NullOrUndef;
  matIcon?: string | NullOrUndef;
  iconSvg?: string | NullOrUndef;
}

export type DOMNodeAttrs = { [key: string]: string };

export interface ComboBoxItem {
  key: string;
  text: string;
}

export type InputValueType = string;

export type FormNodeChangedEventArg =
  | InputValueType
  | string[]
  | ComboBoxItem
  | ComboBoxItem[];

export type OnChangeEventHandler = (
  newValue: FormNodeChangedEventArg,
  searchString?: string | NullOrUndef
) => VoidOrAny;

export type OnClickEventHandler = () => VoidOrAny;

export interface FormNodeEvents {
  onChange?: OnChangeEventHandler | NullOrUndef;
  onClick?: OnClickEventHandler | NullOrUndef;
}

export interface FormNode extends FormNodeEvents, NodeCore {
  type: NodeType;
  text?: TextNode[] | NullOrUndef;
  label?: string | NullOrUndef;
  value?: InputValueType | NullOrUndef;
  inputType?: HtmlInputType | NullOrUndef;
  linesCount?: number | NullOrUndef;
  attrs?: DOMNodeAttrs | NullOrUndef;
  buttonType?: ButtonType | NullOrUndef;
  items?: ValueFactory<string, ComboBoxItem[]> | NullOrUndef;
  childNodes?: FormNode[] | NullOrUndef;
}

export interface FormRow extends NodeCore {
  type: RowType;
  heading?: TextNode[] | NullOrUndef;
  nodes?: FormNode[] | NullOrUndef;
  rows?: FormRow[] | NullOrUndef;
  heightFactor?: number | NullOrUndef;
}

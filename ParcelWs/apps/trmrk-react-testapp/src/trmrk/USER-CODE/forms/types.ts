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
  value?: TOutput | null | undefined;
  factory?: ((input: TInput) => TOutput | Promise<TOutput>) | null | undefined;
  isAsync?: boolean | null | undefined;
}

export interface TextNode {
  text?: string;
  cssClass?: string | null | undefined;
  level?: TextLevel | null | undefined;
  style?: TextStyle | null | undefined;
  matIcon?: string | null | undefined;
  iconSvg?: string | null | undefined;
}

export interface DOMNodeAttrs {
  disabled: boolean | null | undefined;
  readonly: boolean | null | undefined;
  checked: boolean | null | undefined;
}

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
  searchString?: string | null | undefined
) => void | any | unknown;

export type OnClickEventHandler = () => void | any | unknown;

export interface FormNodeEvents {
  onChange?: OnChangeEventHandler | null | undefined;
  onClick?: OnClickEventHandler | null | undefined;
}

export interface FormNode extends FormNodeEvents {
  type: NodeType;
  cssClass?: string | null | undefined;
  text?: TextNode[] | null | undefined;
  label?: string | null | undefined;
  value?: InputValueType | null | undefined;
  inputType?: HtmlInputType | null | undefined;
  linesCount?: number | null | undefined;
  attrs?: DOMNodeAttrs | null | undefined;
  buttonType?: ButtonType | null | undefined;
  items?: ValueFactory<string, ComboBoxItem> | null | undefined;
  childNodes?: FormNode[] | null | undefined;
}

export interface FormRow {
  type: RowType;
  cssClass?: string | null | undefined;
  nodes?: FormNode[] | null | undefined;
  rows?: FormRow[] | null | undefined;
  heightFactor?: number | null | undefined;
}

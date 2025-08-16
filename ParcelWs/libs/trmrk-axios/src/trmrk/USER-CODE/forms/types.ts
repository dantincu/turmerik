import { NullOrUndef, VoidOrAny } from '../../core';

export enum TrmrkFormNodeType {
  Default = 0,
  Text,
  Row,
}

export enum TrmrkFormNodeCategory {
  Text = 0,
  Heading,
  Input,
  Combobox,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  IconButton,
  Group,
  Loading,
  HorizRule,
}

export enum TrmrkButtonCategory {
  None = 0,
  Default,
  Primary,
  Secondary,
  Accept,
  Reject,
}

export enum TrmrkTextLevel {
  Default = 0,
  Info,
  Warning,
  Error,
}

export enum TrmrkTextStyle {
  Regular = 0,
  Italic = 1,
  Bold = 2,
  Underline = 4,
  Strike = 8,
  Code = 16,
}

export enum TrmrkFormRowCategory {
  Content = 0,
  Section,
  Blank,
}

export type HtmlInputCategory =
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

export interface TrmrkValueFactory<TInput, TOutput> {
  value?: TOutput | NullOrUndef;
  func?: ((input: TInput) => TOutput | Promise<TOutput>) | NullOrUndef;
  isAsync?: boolean | NullOrUndef;
}

export interface NodeHtmlInfo {
  idnf?: string | NullOrUndef;
  raw?: string | NullOrUndef;
}

export type NodeHtml = string | NodeHtmlInfo;

export interface TrmrkNodeCoreBase<THtml = NodeHtml> {
  cssClass?: string | NullOrUndef;
  controlClass?: string | NullOrUndef;
  attrs?: TrmrkDOMNodeAttrs | NullOrUndef;
  html?: THtml | NullOrUndef;
  useEnhancedControl?: boolean | NullOrUndef;
}

export interface TrmrkNodeCore<THtml = NodeHtml>
  extends TrmrkNodeCoreBase<THtml> {
  _id: number;
  type: TrmrkFormNodeType;
}

export interface TrmrkTextNode<THtml = NodeHtml> extends TrmrkNodeCore<THtml> {
  text?: string;
  level?: TrmrkTextLevel | NullOrUndef;
  style?: TrmrkTextStyle | NullOrUndef;
  iconName?: string | NullOrUndef;
}

export type TrmrkDOMNodeAttrs = { [key: string]: string };

export interface TrmrkComboBoxItem {
  key: string | NullOrUndef;
  text: string;
  isSelected?: boolean | NullOrUndef;
}

export type TrmrkInputValueType = string;

export type TrmrkFormNodeChangedEventArg =
  | TrmrkInputValueType
  | TrmrkComboBoxItem
  | TrmrkComboBoxItem[];

export type TrmrkOnChangeEventHandler = (
  newValue: TrmrkFormNodeChangedEventArg,
  searchString?: string | NullOrUndef
) => VoidOrAny;

export type TrmrkOnClickEventHandler = () => VoidOrAny;

export interface TrmrkFormNodeEvents {
  onChange?: TrmrkOnChangeEventHandler | NullOrUndef;
  onClick?: TrmrkOnClickEventHandler | NullOrUndef;
}

export interface TrmrkFormNode<THtml = NodeHtml>
  extends TrmrkFormNodeEvents,
    TrmrkNodeCore<THtml> {
  category: TrmrkFormNodeCategory;
  text?: TrmrkTextNode<THtml>[] | NullOrUndef;
  label?: string | NullOrUndef;
  value?: TrmrkInputValueType | NullOrUndef;
  inputType?: HtmlInputCategory | NullOrUndef;
  controlAttrs?: TrmrkDOMNodeAttrs | NullOrUndef;
  linesCount?: number | NullOrUndef;
  buttonType?: TrmrkButtonCategory | NullOrUndef;
  items?: TrmrkValueFactory<string, TrmrkComboBoxItem[]> | NullOrUndef;
  childNodes?: TrmrkFormNode<THtml>[] | NullOrUndef;
  fullWidth?: boolean | NullOrUndef;
  hasSpinner?: boolean | NullOrUndef;
  hasClearAllBtn?: boolean | NullOrUndef;
}

export interface TrmrkFormRow<THtml = NodeHtml> extends TrmrkNodeCore<THtml> {
  category: TrmrkFormRowCategory;
  label?: string | NullOrUndef;
  nodes?: TrmrkFormNode<THtml>[] | NullOrUndef;
  rows?: TrmrkFormRow<THtml>[] | NullOrUndef;
  heightFactor?: number | NullOrUndef;
  isExpanded?: boolean | NullOrUndef;
}

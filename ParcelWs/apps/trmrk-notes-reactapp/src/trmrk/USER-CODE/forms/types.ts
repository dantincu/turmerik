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
  Button,
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

export interface TrmrkNodeCoreBase<TData = any, THtml = NodeHtml> {
  cssClass?: string | NullOrUndef;
  attrs?: TrmrkDOMNodeAttrs | NullOrUndef;
  data?: TData | NullOrUndef;
  html?: THtml | NullOrUndef;
}

export interface TrmrkNodeCore<TData = any, THtml = NodeHtml>
  extends TrmrkNodeCoreBase<TData, THtml> {
  _id: number;
  type: TrmrkFormNodeType;
}

export interface TrmrkTextNode<TData = any, THtml = NodeHtml>
  extends TrmrkNodeCore<TData, THtml> {
  text?: string;
  level?: TrmrkTextLevel | NullOrUndef;
  style?: TrmrkTextStyle | NullOrUndef;
  matIcon?: string | NullOrUndef;
}

export type TrmrkDOMNodeAttrs = { [key: string]: string };

export interface TrmrkComboBoxItem {
  key: string | NullOrUndef;
  text: string;
}

export type TrmrkInputValueType = string;

export type TrmrkFormNodeChangedEventArg =
  | TrmrkInputValueType
  | string[]
  | TrmrkComboBoxItem
  | TrmrkComboBoxItem[];

export type TrmrkOnChangeEventHandler = (
  rows: TrmrkFormRow[],
  newValue: TrmrkFormNodeChangedEventArg,
  searchString?: string | NullOrUndef
) => VoidOrAny;

export type TrmrkOnClickEventHandler = (rows: TrmrkFormRow[]) => VoidOrAny;

export interface TrmrkFormNodeEvents {
  onChange?: TrmrkOnChangeEventHandler | NullOrUndef;
  onClick?: TrmrkOnClickEventHandler | NullOrUndef;
}

export interface TrmrkFormNode<TData = any, THtml = NodeHtml>
  extends TrmrkFormNodeEvents,
    TrmrkNodeCore<TData, THtml> {
  category: TrmrkFormNodeCategory;
  text?: TrmrkTextNode<TData, THtml>[] | NullOrUndef;
  label?: string | NullOrUndef;
  value?: TrmrkInputValueType | NullOrUndef;
  inputType?: HtmlInputCategory | NullOrUndef;
  controlAttrs?: TrmrkDOMNodeAttrs | NullOrUndef;
  linesCount?: number | NullOrUndef;
  buttonType?: TrmrkButtonCategory | NullOrUndef;
  items?: TrmrkValueFactory<string, TrmrkComboBoxItem[]> | NullOrUndef;
  childNodes?: TrmrkFormNode<TData, THtml>[] | NullOrUndef;
  useMatControl?: boolean | NullOrUndef;
  fullWidth?: boolean | NullOrUndef;
  hasSpinner?: boolean | NullOrUndef;
  hasClearAllBtn?: boolean | NullOrUndef;
}

export interface TrmrkFormRow<TData = any, THtml = NodeHtml>
  extends TrmrkNodeCore<TData, THtml> {
  category: TrmrkFormRowCategory;
  label?: string | NullOrUndef;
  nodes?: TrmrkFormNode<TData, THtml>[] | NullOrUndef;
  rows?: TrmrkFormRow<TData, THtml>[] | NullOrUndef;
  heightFactor?: number | NullOrUndef;
  isExpanded?: boolean | NullOrUndef;
}

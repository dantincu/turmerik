import { NullOrUndef, VoidOrAny, AnyOrUnknown } from '../../core';

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
  DatePicker,
  DateTimePicker,
  // Radio,
  RadioGroup,
  Button,
  IconButton,
  HorizStrip,
  ThinHorizStrip,
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
  cssClass?: string | string[] | NullOrUndef;
  controlClass?: string | string[] | NullOrUndef;
  attrs?: TrmrkDOMNodeAttrs | NullOrUndef;
  controlAttrs?: TrmrkDOMNodeAttrs | NullOrUndef;
  html?: THtml | NullOrUndef;
  appearance?: AnyOrUnknown;
  errorMsg?: string | NullOrUndef;
}

export interface TrmrkNodeCore<THtml = NodeHtml>
  extends TrmrkNodeCoreBase<THtml> {
  id: string;
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

export type TrmrkInputValueType = string | any | NullOrUndef;

export type TrmrkComboboxChangedEventArg =
  | TrmrkComboBoxItem
  | TrmrkComboBoxItem[];

export type TrmrkEventHandler<TEvent = Event> = (event: TEvent) => VoidOrAny;

export type TrmrkChangeEventHandler = (
  event: Event | any,
  newValue: TrmrkInputValueType
) => VoidOrAny;

export type TrmrkComboboxChangeEventHandler = (
  event: Event,
  newValue: TrmrkComboboxChangedEventArg,
  searchString?: string | NullOrUndef
) => VoidOrAny;

export type TrmrkClickEventHandler = TrmrkEventHandler<MouseEvent>;
export type TrmrkKeyUpEventHandler = TrmrkEventHandler<KeyboardEvent>;

export interface TrmrkItemsValueFactoryArg {
  searchString?: string | NullOrUndef;
  isInit?: boolean | NullOrUndef;
}

export interface TrmrkFormNodeEvents {
  change?: TrmrkChangeEventHandler | NullOrUndef;
  click?: TrmrkClickEventHandler | NullOrUndef;
  keyUp?: TrmrkKeyUpEventHandler | NullOrUndef;
  focus?: TrmrkEventHandler | NullOrUndef;
  focusIn?: TrmrkEventHandler | NullOrUndef;
  blur?: TrmrkEventHandler | NullOrUndef;
  focusOut?: TrmrkEventHandler | NullOrUndef;
  anyChange?: TrmrkChangeEventHandler | NullOrUndef;
  comboboxChange?: TrmrkComboboxChangeEventHandler | NullOrUndef;
}

export interface TrmrkFormNode<THtml = NodeHtml>
  extends TrmrkFormNodeEvents,
    TrmrkNodeCore<THtml> {
  category: TrmrkFormNodeCategory;
  text?: TrmrkTextNode<THtml>[] | NullOrUndef;
  label?: string | NullOrUndef;
  labelHtml?: THtml | NullOrUndef;
  value?: TrmrkInputValueType | NullOrUndef;
  isRequired?: boolean | NullOrUndef;
  inputType?: HtmlInputCategory | NullOrUndef;
  linesCount?: number | NullOrUndef;
  buttonType?: TrmrkButtonCategory | NullOrUndef;
  items?:
    | TrmrkValueFactory<TrmrkItemsValueFactoryArg, TrmrkComboBoxItem[]>
    | NullOrUndef;
  newItemFactory?: ((text: string) => TrmrkComboBoxItem) | NullOrUndef;
  allowUserToAddItems?: boolean | NullOrUndef;
  lazyLoadItems?: boolean | NullOrUndef;
  refreshOnKeyPress?: boolean | NullOrUndef;
  childNodes?: TrmrkFormNode<THtml>[] | NullOrUndef;
  fullWidth?: boolean | NullOrUndef;
  hasSpinner?: boolean | NullOrUndef;
  hasClearAllBtn?: boolean | NullOrUndef;
  heightFactor?: number | NullOrUndef;
}

export interface TrmrkFormRow<THtml = NodeHtml> extends TrmrkNodeCore<THtml> {
  category: TrmrkFormRowCategory;
  label?: string | NullOrUndef;
  nodes?: TrmrkFormNode<THtml>[] | NullOrUndef;
  rows?: TrmrkFormRow<THtml>[] | NullOrUndef;
  heightFactor?: number | NullOrUndef;
  isExpanded?: boolean | NullOrUndef;
}

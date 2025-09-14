import { Component, Input, TemplateRef } from '@angular/core';

import { NullOrUndef } from '../../../../../../trmrk/core';

import {
  HtmlInputCategory,
  TrmrkButtonCategory,
  TrmrkComboBoxItem,
  TrmrkDOMNodeAttrs,
  TrmrkFormNode,
  TrmrkComboboxChangedEventArg,
  TrmrkFormNodeEvents,
  TrmrkFormNodeCategory,
  TrmrkFormRow,
  TrmrkFormRowCategory,
  TrmrkInputValueType,
  TrmrkNodeCore,
  TrmrkComboboxChangeEventHandler,
  TrmrkClickEventHandler,
  TrmrkTextLevel,
  TrmrkTextNode,
  TrmrkTextStyle,
  TrmrkValueFactory,
  NodeHtml,
  NodeHtmlInfo,
} from '../../../../../../trmrk/USER-CODE/forms/types';

import {
  TrmrkFormHelper,
  TrmrkFormHelperExtraArgs,
} from '../../../../../../trmrk/USER-CODE/forms/trmrkForm';

@Component({
  selector: 'trmrk-form',
  imports: [],
  templateUrl: './trmrk-form.html',
  styleUrl: './trmrk-form.scss',
})
export class TrmrkForm {
  @Input() trmrkRows!: TrmrkFormRow[];
  @Input() trmrkTemplatesMap?: { [templateName: string]: TemplateRef<any> };
}

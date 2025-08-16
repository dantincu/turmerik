import { Component, Input, TemplateRef } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';

import {
  HtmlInputCategory,
  TrmrkButtonCategory,
  TrmrkComboBoxItem,
  TrmrkDOMNodeAttrs,
  TrmrkFormNode,
  TrmrkFormNodeChangedEventArg,
  TrmrkFormNodeEvents,
  TrmrkFormNodeCategory,
  TrmrkFormRow,
  TrmrkFormRowCategory,
  TrmrkInputValueType,
  TrmrkNodeCore,
  TrmrkOnChangeEventHandler,
  TrmrkOnClickEventHandler,
  TrmrkTextLevel,
  TrmrkTextNode,
  TrmrkTextStyle,
  TrmrkValueFactory,
  NodeHtml,
  NodeHtmlInfo,
} from '../../../../trmrk/USER-CODE/forms/types';

import {
  TrmrkFormHelper,
  TrmrkFormTextArg,
  TrmrkFormHelperExtraArgs,
} from '../../../../trmrk/USER-CODE/forms/trmrkForm';

@Component({
  selector: 'trmrk-form',
  imports: [],
  templateUrl: './trmrk-form.html',
  styleUrl: './trmrk-form.scss',
})
export class TrmrkForm<TData = any, THtml = NodeHtml> {
  @Input() trmrkRows!: TrmrkFormRow<TData, THtml>[];
  @Input() trmrkTemplatesMap?: { [templateName: string]: TemplateRef<any> };
}

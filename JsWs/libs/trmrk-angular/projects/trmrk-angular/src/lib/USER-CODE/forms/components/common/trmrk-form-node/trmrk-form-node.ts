import { Component, Input, TemplateRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { MatOptionSelectionChange } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { v4 as uuidv4 } from 'uuid';

import {
  TrmrkHorizStrip,
  TrmrkHorizStripDetailsTextPart,
  TrmrkHorizStripDetailsTextPartHtmlInfo,
} from '../../../../../components/common/trmrk-horiz-strip/trmrk-horiz-strip';

import { TrmrkThinHorizStrip } from '../../../../../components/common/trmrk-thin-horiz-strip/trmrk-thin-horiz-strip';

import { TrmrkDynamicAttributesDirective } from '../../../../../directives/trmrk-dynamic-attributes';

import { whenChanged } from '../../../../../services/common/simpleChanges';

import { NullOrUndef } from '../../../../../../trmrk/core';

import {
  HtmlInputCategory,
  TrmrkButtonCategory,
  TrmrkComboBoxItem,
  TrmrkDOMNodeAttrs,
  TrmrkFormNode as TrmrkFormNodeObj,
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
  TrmrkFormNodeType,
} from '../../../../../../trmrk/USER-CODE/forms/types';

import {
  TrmrkFormHelper,
  TrmrkFormHelperExtraArgs,
  refreshFactoryValues,
} from '../../../../../../trmrk/USER-CODE/forms/trmrkForm';

import {
  hasHtmlTemplate,
  hasRawHtml,
  getHtmlTemplateName,
  getRawHtml,
  getSafeHtml,
  getCssClassFromMap,
  formNodeCategoriesMap,
  formRowCategoriesMap,
  textLevelsMap,
  textStylesMap,
  normalizeAttrs,
  normalizeCssClass,
} from '../../../helpers/form';

import { TrmrkSpinner } from '../trmrk-spinner/trmrk-spinner';
import { TrmrkErrorStateMatcher } from '../../../../../services/common/trmrk-error-state-matcher';

import { TrmrkFormTextNode } from '../trmrk-form-text-node/trmrk-form-text-node';
import { DEFAULT_ROW_HEIGHT_FACTOR } from '../../../helpers/form';

import {
  AppearanceCore,
  ButtonFormFieldAppearance,
  ComboboxFormFieldAppearance,
  FormFieldAppearance,
} from '../../../helpers/types';

import { ALT_CONTROL_ATTR_PFX, SKIP_DEFAULT_CSS_CLASS_PFX } from '../../../helpers/form';

export type FormInputChangeEvent = Event | MatCheckboxChange | MatRadioChange<any>;

const enums = {
  TrmrkFormNodeType,
  TrmrkFormNodeCategory,
  TrmrkFormRowCategory,
};

@Component({
  selector: 'trmrk-form-node',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconButton,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatCheckbox,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TrmrkDynamicAttributesDirective,
    TrmrkSpinner,
    TrmrkFormTextNode,
    TrmrkHorizStrip,
    TrmrkThinHorizStrip,
  ],
  templateUrl: './trmrk-form-node.html',
  styleUrl: './trmrk-form-node.scss',
})
export class TrmrkFormNode implements OnChanges {
  @Input() trmrkNode!: TrmrkFormNodeObj;
  @Input() trmrkPath!: number[];
  @Input() trmrkTemplatesMap!: { [templateName: string]: TemplateRef<any> };

  @ViewChild('autocompleteInput', { read: MatAutocompleteTrigger })
  comboboxAutocompleteTrigger!: MatAutocompleteTrigger;

  enums = enums;
  comboboxOptionsSeparatorKeysCodes: number[] = [ENTER, COMMA];

  attrs!: TrmrkDOMNodeAttrs;
  controlAttrs!: TrmrkDOMNodeAttrs;
  altControlAttrs!: TrmrkDOMNodeAttrs;

  cssClass!: string[];
  controlCssClass!: string[];
  altControlCssClass!: string[];
  skipDefaultCssClass: boolean | NullOrUndef;
  skipDefaultControlCssClass: boolean | NullOrUndef;
  skipDefaultAltControlCssClass: boolean | NullOrUndef;

  formControl: FormControl | null = null;
  formControlErrorMatcher: TrmrkErrorStateMatcher | null = null;
  controlInitialized: boolean | null = null;
  comboBoxSearchText: string | null = null;
  comboboxSelectedOptions: TrmrkComboBoxItem[] | null = null;
  dateTimeControlTimeValue: string | null = null;

  private _hasRawHtml: boolean | null = null;
  private _hasHtmlTemplate: boolean | null = null;
  private _safeHtml: SafeHtml | null = null;
  private _htmlTemplateName: string | null = null;
  private _hasLabelRawHtml: boolean | null = null;
  private _hasLabelHtmlTemplate: boolean | null = null;
  private _labelSafeHtml: SafeHtml | null = null;
  private _labelHtmlTemplateName: string | null = null;
  private _formControlHasError: boolean | null = null;
  private _isInputControl: boolean | null = null;
  private _isMultiple: boolean | null = null;
  private _heightFactor: number | null = null;
  private _horizStripDetailsTextParts: TrmrkHorizStripDetailsTextPart[] | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  get hasRawHtml() {
    this._hasRawHtml ??= hasRawHtml(this.trmrkNode.html);
    return this._hasRawHtml!;
  }

  get hasHtmlTemplate() {
    this._hasHtmlTemplate ??= hasHtmlTemplate(this.trmrkNode.html);
    return this._hasHtmlTemplate!;
  }

  get safeHtml() {
    this._safeHtml ??= getSafeHtml(this.trmrkNode.html, this.sanitizer);
    return this._safeHtml;
  }

  get htmlTemplateName() {
    this._htmlTemplateName ??= getHtmlTemplateName(this.trmrkNode.html)!;
    return this._htmlTemplateName;
  }

  get hasLabelRawHtml() {
    this._hasLabelRawHtml ??= hasRawHtml(this.trmrkNode.labelHtml);
    return this._hasLabelRawHtml!;
  }

  get hasLabelHtmlTemplate() {
    this._hasLabelHtmlTemplate ??= hasHtmlTemplate(this.trmrkNode.labelHtml);
    return this._hasLabelHtmlTemplate!;
  }

  get labelSafeHtml() {
    this._labelSafeHtml ??= getSafeHtml(this.trmrkNode.labelHtml, this.sanitizer);
    return this._labelSafeHtml;
  }

  get labelHtmlTemplateName() {
    this._labelHtmlTemplateName ??= getHtmlTemplateName(this.trmrkNode.labelHtml)!;
    return this._labelHtmlTemplateName;
  }

  get formControlHasError() {
    this._formControlHasError ??= (this.trmrkNode.errorMsg ?? null) !== null;
    return this._formControlHasError!;
  }

  get isInputControl() {
    this._isInputControl ??=
      this.trmrkNode.category >= enums.TrmrkFormNodeCategory.Input &&
      this.trmrkNode.category <= enums.TrmrkFormNodeCategory.DateTimePicker;

    return this._isInputControl!;
  }

  get isMultiple() {
    this._isMultiple ??= (this.trmrkNode.linesCount ?? null) !== null;
    return this._isMultiple!;
  }

  get appearance() {
    return this.trmrkNode.appearance as AppearanceCore | NullOrUndef;
  }

  get formFieldAppearance() {
    return this.trmrkNode.appearance as FormFieldAppearance | NullOrUndef;
  }

  get buttonFormFieldAppearance() {
    return this.trmrkNode.appearance as ButtonFormFieldAppearance | NullOrUndef;
  }

  get comboboxFormFieldAppearance() {
    return this.trmrkNode.appearance as ComboboxFormFieldAppearance | NullOrUndef;
  }

  get heightFactor() {
    if ((this._heightFactor ?? null) === null) {
      let heightFactor = this.trmrkNode.heightFactor;

      if ((heightFactor ?? null) === null) {
        if (
          [TrmrkFormNodeCategory.HorizRule, TrmrkFormNodeCategory.ThinHorizStrip].includes(
            this.trmrkNode.category
          )
        ) {
          heightFactor = DEFAULT_ROW_HEIGHT_FACTOR;
        }
      }

      this._heightFactor = heightFactor ?? null;
    }

    return this._heightFactor;
  }

  get horizStripDetailsTextParts() {
    if (!this._horizStripDetailsTextParts) {
      this._horizStripDetailsTextParts =
        this.trmrkNode.text?.map((part) => ({
          text: part.text ?? '',
          html: part.html ? this.horizStripDetailsTextPartHtmlToFormNodeHtml(part.html) : null,
        })) ?? null;
    }

    return this._horizStripDetailsTextParts;
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkNode,
      (_, change) => {
        this.updateNode(change.firstChange);
      }
    );
  }

  inputChange(event: FormInputChangeEvent) {
    const { newValue } = this.onInputChange(event);

    if (this.trmrkNode.change) {
      this.trmrkNode.change(event, newValue!);
    }
  }

  click(event: MouseEvent) {
    if (this.trmrkNode.click) {
      this.trmrkNode.click(event);
    }
  }

  inputKeyUp(event: KeyboardEvent) {
    this.onInputChange(event);

    if (this.trmrkNode.keyUp) {
      this.trmrkNode.keyUp(event);
    }
  }

  inputFocus(event: Event) {
    if (!this.controlInitialized && this.trmrkNode.category === TrmrkFormNodeCategory.Combobox) {
      this.initComboboxItems();
    }

    if (this.trmrkNode.focus) {
      this.trmrkNode.focus(event);
    }
  }

  inputBlur(event: Event) {
    this.onInputChange(event);

    if (this.trmrkNode.blur) {
      this.trmrkNode.blur(event);
    }
  }

  inputFocusIn(event: Event) {
    if (this.trmrkNode.focusIn) {
      this.trmrkNode.focusIn(event);
    }
  }

  inputFocusOut(event: Event) {
    if (this.trmrkNode.focusOut) {
      this.trmrkNode.focusOut(event);
    }
  }

  comboboxSelectAutocompleteDoneClick() {
    if (this.comboboxAutocompleteTrigger.panelOpen) {
      setTimeout(() => {
        this.comboboxAutocompleteTrigger.closePanel();
      });
    }
  }

  comboboxSelectOption(event: MatOptionSelectionChange<any>, option: TrmrkComboBoxItem) {
    const isMultiple = this.isMultiple;
    option.isSelected = true;

    let optionIdx = this.comboboxSelectedOptions!.findIndex((option) => option.key === option.key);

    let isRealChange = optionIdx < 0;

    if (isRealChange) {
      this.comboboxSelectedOptions!.splice(
        0,
        isMultiple ? 1 : this.comboboxSelectedOptions!.length
      );

      this.comboboxSelectedOptions!.push(option);
    }

    if (isMultiple && event.isUserInput) {
      let scrollTop: number | null = null;

      const getPanel = () => document.querySelector(`trmrk-autocomplete-${this.trmrkNode.id}`);

      let panel = getPanel();

      if (panel) {
        scrollTop = panel.scrollTop;
      }

      setTimeout(() => {
        this.comboboxAutocompleteTrigger.openPanel();
        let panel = getPanel();

        if (panel) {
          panel.scrollTo({
            top: scrollTop!,
          });
        }
      });
    }

    if (isRealChange) {
      this.fireComboboxChangeEvent(option);
    }
  }

  comboboxRemoveOption(option: TrmrkComboBoxItem) {
    if (this.isMultiple) {
      option.isSelected = false;

      const idx = this.comboboxSelectedOptions!.findIndex((o) => o.key === option.key);

      if (idx >= 0) {
        this.comboboxSelectedOptions!.splice(idx, 1);
        this.fireComboboxChangeEvent(option);
      }
    }
  }

  comboboxAddOptionFromInput(event: MatChipInputEvent) {
    if (this.trmrkNode.allowUserToAddItems) {
      const item = this.trmrkNode.newItemFactory!(event.value);
      this.comboboxSelectedOptions!.push(item);
      this.fireComboboxChangeEvent(item);
    }
  }

  comboboxDisplayFn(option: any): string {
    return option?.viewValue || '';
  }

  childPath(idx: number) {
    const path = [...this.trmrkPath, idx];
    return path;
  }

  clearNode() {
    if (this.trmrkNode) {
      this.trmrkNode.value = null;
    }
  }

  private updateInputValue(event: FormInputChangeEvent) {
    const newValue: any =
      (event as MatCheckboxChange).checked ??
      (event as MatRadioChange).value ??
      ((event as Event).target as HTMLInputElement | null)?.value ??
      null;

    const isRealChange = this.trmrkNode.value !== newValue;
    this.trmrkNode.value = newValue;
    return { newValue, isRealChange };
  }

  private fireComboboxChangeEvent(option: TrmrkComboBoxItem) {
    if (this.trmrkNode.comboboxChange) {
      this.trmrkNode.comboboxChange(
        {} as Event,
        this.isMultiple ? this.comboboxSelectedOptions! : option,
        this.comboBoxSearchText ?? undefined
      );
    }

    if (this.trmrkNode.change) {
      this.trmrkNode.change(
        {} as Event,
        this.isMultiple ? this.comboBoxSearchText ?? '' : (option.key as string)
      );
    }
  }

  private onInputChange(event: FormInputChangeEvent) {
    const { newValue, isRealChange } = this.updateInputValue(event);

    if (isRealChange) {
      if (
        this.trmrkNode.category === TrmrkFormNodeCategory.Combobox &&
        !this.trmrkNode.appearance.useNativeControl
      ) {
        this.comboboxSearchTextChanged(newValue as string);
      }

      if (this.trmrkNode.anyChange) {
        this.trmrkNode.anyChange(event, newValue!);
      }
    }

    return { newValue, isRealChange };
  }

  private updateNode(isFirstChange: boolean) {
    this.resetProps();
    this.refreshAttrs();
    this.refreshCssClass();

    if (this.isInputControl) {
      if (isFirstChange) {
        this.formControl = new FormControl();

        this.formControlErrorMatcher = new TrmrkErrorStateMatcher(() => this.formControlHasError);
      }
    } else if (this.trmrkNode.category === TrmrkFormNodeCategory.RadioGroup) {
      this.controlInitialized = false;
      this.initRadioGroupItems();
    } else if (this.trmrkNode.category === TrmrkFormNodeCategory.Combobox) {
      this.controlInitialized = false;
      this.formControl = new FormControl('');

      if (this.trmrkNode.allowUserToAddItems) {
        this.trmrkNode.newItemFactory ??= (text: string) => ({
          key: uuidv4(),
          text: text,
          isSelected: true,
        });
      }

      if (!this.trmrkNode.lazyLoadItems) {
        this.initComboboxItems();
      }
    }
  }

  private async initRadioGroupItems() {
    await refreshFactoryValues(
      this.trmrkNode.items!,
      {
        isInit: !this.controlInitialized,
      },
      (hasSpinner) => {
        this.trmrkNode.hasSpinner = hasSpinner;
      }
    );

    this.controlInitialized = true;

    this.trmrkNode.value = this.trmrkNode.items!.value?.find((item) => item.isSelected)?.key;
  }

  private async initComboboxItems() {
    this.comboBoxSearchText ??= this.trmrkNode.value ?? null;

    if (!this.trmrkNode.hasSpinner) {
      await this.refreshComboboxItems(this.trmrkNode.value ?? null);
    }
  }

  private async comboboxSearchTextChanged(searchText: string) {
    this.comboBoxSearchText = searchText;

    if (!this.trmrkNode.hasSpinner) {
      await this.refreshComboboxItems(searchText);
    }
  }

  private async refreshComboboxItems(searchText: string | null) {
    await refreshFactoryValues(
      this.trmrkNode.items!,
      {
        searchString: searchText,
        isInit: !this.controlInitialized,
      },
      (hasSpinner) => {
        this.trmrkNode.hasSpinner = hasSpinner;
      }
    );

    this.controlInitialized = true;
    const itemsValue = this.trmrkNode.items!.value ?? null;

    if (!this.comboboxSelectedOptions) {
      if (itemsValue) {
        this.comboboxSelectedOptions = itemsValue.filter((item) => item.isSelected);
      }
    } else {
      if (itemsValue) {
        for (let option of itemsValue) {
          const selectedOption = this.comboboxSelectedOptions.find((o) => o.key === option.key);

          option.isSelected = (selectedOption ?? null) !== null;
        }
      }
    }

    if (this.comboBoxSearchText !== searchText) {
      await this.refreshComboboxItems(this.comboBoxSearchText);
    }
  }

  private horizStripDetailsTextPartHtmlToFormNodeHtml(
    nodeHtml: NodeHtml
  ): TrmrkHorizStripDetailsTextPartHtmlInfo {
    let retVal: TrmrkHorizStripDetailsTextPartHtmlInfo;

    if (typeof nodeHtml === 'string') {
      retVal = { raw: nodeHtml };
    } else {
      retVal = {
        raw: nodeHtml.raw,
        template: (nodeHtml.idnf ?? null) !== null ? this.trmrkTemplatesMap[nodeHtml.idnf!] : null,
      };
    }

    return retVal;
  }

  private refreshAttrs() {
    const normAttrs = normalizeAttrs(this.trmrkNode.attrs);
    const normControlAttrs = normalizeAttrs(this.trmrkNode.controlAttrs);

    this.attrs = normAttrs.main;
    this.controlAttrs = normControlAttrs.main;
    this.altControlAttrs = normControlAttrs.alt;

    /*
     * controlAttrs
     */

    if (this.trmrkNode.isRequired) {
      this.controlAttrs['required'] = '';
    }

    if (this.trmrkNode.category === TrmrkFormNodeCategory.Combobox) {
      if (this.isMultiple) {
        this.controlAttrs['multiple'] = '';
      }
    } else if (this.trmrkNode.category === TrmrkFormNodeCategory.Button) {
      if (this.appearance) {
        if (!this.appearance.useNativeControl) {
          if ((this.buttonFormFieldAppearance?.matButtonAppearance ?? null) !== null) {
            this.controlAttrs['matButton'] = this.buttonFormFieldAppearance!.matButtonAppearance!;
          } else {
            this.controlAttrs['mat-button'] = '';
          }
        }
      }
    } else if (this.trmrkNode.category === TrmrkFormNodeCategory.IconButton) {
      if (this.trmrkNode.appearance?.useNativeControl ?? false) {
        this.controlAttrs['mat-icon-button'] = '';
      }
    }
  }

  private refreshCssClass() {
    const normCssClass = normalizeCssClass(this.trmrkNode.cssClass);
    const normControlClass = normalizeCssClass(this.trmrkNode.controlClass);

    this.cssClass = normCssClass.main.classes;
    this.controlCssClass = normControlClass.main.classes;
    this.altControlCssClass = normControlClass.alt.classes;
    this.skipDefaultCssClass = normCssClass.main.skipDefaultCssClass;
    this.skipDefaultControlCssClass = normControlClass.main.skipDefaultCssClass;
    this.skipDefaultAltControlCssClass = normControlClass.alt.skipDefaultCssClass;

    /*
     * cssClass
     */

    this.cssClass.push(...getCssClassFromMap(formNodeCategoriesMap, this.trmrkNode.category));

    const heightFactor = this.heightFactor;

    if ((heightFactor ?? null) !== null) {
      this.cssClass.push(`trmrk-height-x${heightFactor}`);
    }

    if (!this.skipDefaultCssClass) {
      this.cssClass.push('trmrk-form-node');

      switch (this.trmrkNode.category) {
        case TrmrkFormNodeCategory.HorizRule:
          this.cssClass.push('trmrk-form-horiz-rule-node');
          break;
      }
    }

    /*
     * controlCssClass
     */

    if (this.trmrkNode.category === TrmrkFormNodeCategory.Checkbox) {
      if (!this.appearance?.useNativeControl && !this.skipDefaultControlCssClass) {
        this.controlCssClass.push('trmrk-checkbox');
      }
    } else if (this.trmrkNode.category === TrmrkFormNodeCategory.Button) {
      if (!this.appearance?.useNativeControl && !this.skipDefaultControlCssClass) {
        this.controlCssClass.push('trmrk-btn');
      }
    } else if (this.trmrkNode.category === TrmrkFormNodeCategory.IconButton) {
      if (!this.appearance?.useNativeControl && !this.skipDefaultControlCssClass) {
        this.controlCssClass.push('trmrk-icon-btn');
      }
    }
  }

  private resetProps() {
    this.attrs = null!;
    this.controlAttrs = null!;
    this.altControlAttrs = null!;
    this.cssClass = null!;
    this.controlCssClass = null!;
    this.altControlCssClass = null!;
    this.skipDefaultCssClass = null;
    this.skipDefaultControlCssClass = null;
    this.skipDefaultAltControlCssClass = null;

    this.formControl = null;
    this.formControlErrorMatcher = null;
    this.controlInitialized = null;
    this.comboBoxSearchText = null;
    this.comboboxSelectedOptions = null;
    this.dateTimeControlTimeValue = null;

    this._hasRawHtml = null;
    this._hasHtmlTemplate = null;
    this._safeHtml = null;
    this._htmlTemplateName = null;
    this._hasLabelRawHtml = null;
    this._hasLabelHtmlTemplate = null;
    this._labelSafeHtml = null;
    this._labelHtmlTemplateName = null;
    this._formControlHasError = null;
    this._isInputControl = null;
    this._isMultiple = null;
    this._heightFactor = null;
    this._horizStripDetailsTextParts = null;
  }
}

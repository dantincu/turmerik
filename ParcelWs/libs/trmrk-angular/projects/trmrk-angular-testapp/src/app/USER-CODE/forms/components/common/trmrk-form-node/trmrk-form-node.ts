import {
  Component,
  Input,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';

import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { v4 as uuidv4 } from 'uuid';

import {
  TrmrkDynamicAttributesDirective,
  whenChanged,
  TrmrkHorizStrip,
} from 'trmrk-angular';

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
  getCssClass,
  formNodeCategoriesMap,
  formRowCategoriesMap,
  textLevelsMap,
  textStylesMap,
} from '../../../form';

import { TrmrkSpinner } from '../trmrk-spinner/trmrk-spinner';
import { TrmrkErrorStateMatcher } from '../../../../../services/trmrk-error-state-matcher';

const enums = {
  TrmrkFormNodeType,
  TrmrkFormNodeCategory,
  TrmrkFormRowCategory,
};

@Component({
  selector: 'trmrk-form-node',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconButton,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    TrmrkDynamicAttributesDirective,
    TrmrkSpinner,
  ],
  templateUrl: './trmrk-form-node.html',
  styleUrl: './trmrk-form-node.scss',
})
export class TrmrkFormNode implements OnChanges {
  @Input() trmrkNode!: TrmrkNodeCore;
  @Input() trmrkPath!: number[];
  @Input() trmrkTemplatesMap?: { [templateName: string]: TemplateRef<any> };

  @ViewChild('autocompleteInput', { read: MatAutocompleteTrigger })
  comboboxAutocompleteTrigger!: MatAutocompleteTrigger;

  enums = enums;
  nodeAttrs: TrmrkDOMNodeAttrs = {};
  formNode: TrmrkFormNodeObj | null = null;
  formRow: TrmrkFormRow | null = null;
  textNode: TrmrkTextNode | null = null;
  formControl: FormControl | null = null;
  formControlErrorMatcher: TrmrkErrorStateMatcher | null = null;
  controlInitialized = false;

  comboBoxSearchText: string | null = null;
  comboboxOptionsSeparatorKeysCodes: number[] = [ENTER, COMMA];
  comboboxSelectedOptions: TrmrkComboBoxItem[] | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  get hasRawHtml() {
    return hasRawHtml(this.trmrkNode.html);
  }

  get hasHtmlTemplate() {
    return hasHtmlTemplate(this.trmrkNode.html);
  }

  get safeHtml() {
    return getSafeHtml(this.trmrkNode.html, this.sanitizer);
  }

  get htmlTemplateName() {
    return getHtmlTemplateName(this.trmrkNode.html)!;
  }

  get hasLabelRawHtml() {
    return hasRawHtml(this.formNode!.labelHtml);
  }

  get hasLabelHtmlTemplate() {
    return hasHtmlTemplate(this.formNode!.labelHtml);
  }

  get labelSafeHtml() {
    return getSafeHtml(this.formNode!.labelHtml, this.sanitizer);
  }

  get labelHtmlTemplateName() {
    return getHtmlTemplateName(this.formNode!.labelHtml)!;
  }

  get formControlHasError() {
    const formControlHasError = (this.trmrkNode.errorMsg ?? null) !== null;
    return formControlHasError;
  }

  get isInputControl() {
    const isInputControl =
      this.formNode!.category >= enums.TrmrkFormNodeCategory.Input &&
      this.formNode!.category <= enums.TrmrkFormNodeCategory.DateTimePicker;

    return isInputControl;
  }

  get isMultiple() {
    const isMultiple = (this.formNode!.linesCount ?? null) !== null;
    return isMultiple;
  }

  get controlAttrs() {
    let controlAttrs: TrmrkDOMNodeAttrs;

    if (this.formNode) {
      controlAttrs = this.formNode.controlAttrs ?? {};

      if (this.formNode.isRequired) {
        controlAttrs['required'] = '';
      }

      if (this.formNode.category === TrmrkFormNodeCategory.Combobox) {
        if (this.isMultiple) {
          controlAttrs['multiple'] = '';
        }
      } else if (this.formNode.category === TrmrkFormNodeCategory.Button) {
        const appearance = this.trmrkNode.appearance;

        if (appearance) {
          if (appearance.useNativeControl ?? false) {
            if ((appearance.matButtonAppearance ?? null) !== null) {
              controlAttrs['matButton'] = appearance.matButtonAppearance;
            } else {
              controlAttrs['mat-button'] = '';
            }
          }
        }
      } else if (this.formNode.category === TrmrkFormNodeCategory.IconButton) {
        if (this.trmrkNode.appearance?.useNativeControl ?? false) {
          controlAttrs['mat-icon-button'] = '';
        }
      }
    } else {
      controlAttrs = {};
    }

    return controlAttrs;
  }

  get controlCssClass(): string[] {
    let cssClass: string[] = [];

    if (this.formNode) {
      if (this.formNode.controlClass) {
        cssClass.push(this.formNode.controlClass);
      }

      if (this.formNode.category === TrmrkFormNodeCategory.Button) {
        if (!this.trmrkNode.appearance?.useNativeControl) {
          cssClass.push('trmrk-btn');
        }
      } else if (this.formNode.category === TrmrkFormNodeCategory.IconButton) {
        if (!this.trmrkNode.appearance?.useNativeControl) {
          cssClass.push('trmrk-icon-btn');
        }
      }
    }

    return cssClass;
  }

  get cssClass(): string[] {
    const cssClass = this.getCssClass(
      formNodeCategoriesMap,
      this.formNode?.category
    );

    cssClass.push('trmrk-form-node');

    if (this.formNode?.fullWidth) {
      cssClass.push('trmrk-full-width');
    }

    return cssClass;
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

  inputChange(event: Event) {
    const { newValue } = this.fireInputAnyChangeEventIfReq(event);

    if (this.formNode!.change) {
      this.formNode!.change(event, newValue);
    }
  }

  click(event: MouseEvent) {
    if (this.formNode!.click) {
      this.formNode!.click(event);
    }
  }

  inputKeyUp(event: KeyboardEvent) {
    this.fireInputAnyChangeEventIfReq(event);

    if (this.formNode!.keyUp) {
      this.formNode!.keyUp(event);
    }
  }

  inputFocus(event: Event) {
    if (
      !this.controlInitialized &&
      this.formNode!.category === TrmrkFormNodeCategory.Combobox
    ) {
      this.initComboboxItems();
    }

    if (this.formNode!.focus) {
      this.formNode!.focus(event);
    }
  }

  inputBlur(event: Event) {
    this.fireInputAnyChangeEventIfReq(event);

    if (this.formNode!.blur) {
      this.formNode!.blur(event);
    }
  }

  inputFocusIn(event: Event) {
    if (this.formNode!.focusIn) {
      this.formNode!.focusIn(event);
    }
  }

  inputFocusOut(event: Event) {
    if (this.formNode!.focusOut) {
      this.formNode!.focusOut(event);
    }
  }

  comboboxSelectAutocompleteDoneClick() {
    if (this.comboboxAutocompleteTrigger.panelOpen) {
      setTimeout(() => {
        this.comboboxAutocompleteTrigger.closePanel();
      });
    }
  }

  comboboxSelectOption(
    event: MatOptionSelectionChange<any>,
    option: TrmrkComboBoxItem
  ) {
    const isMultiple = this.isMultiple;
    option.isSelected = true;

    let optionIdx = this.comboboxSelectedOptions!.findIndex(
      (option) => option.key === option.key
    );

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

      const getPanel = () =>
        document.querySelector(`trmrk-autocomplete-${this.trmrkNode.id}`);

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

      const idx = this.comboboxSelectedOptions!.findIndex(
        (o) => o.key === option.key
      );

      if (idx >= 0) {
        this.comboboxSelectedOptions!.splice(idx, 1);
        this.fireComboboxChangeEvent(option);
      }
    }
  }

  comboboxAddOptionFromInput(event: MatChipInputEvent) {
    if (this.formNode!.allowUserToAddItems) {
      const item = this.formNode!.newItemFactory!(event.value);
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
    if (this.formNode) {
      this.formNode.value = null;
    }
  }

  private updateInputValue(event: Event) {
    const newValue = (event.target as HTMLInputElement | null)?.value!;
    const isRealChange = this.formNode!.value !== newValue;
    this.formNode!.value = newValue;
    return { newValue, isRealChange };
  }

  private fireComboboxChangeEvent(option: TrmrkComboBoxItem) {
    if (this.formNode!.comboboxChange) {
      this.formNode!.comboboxChange(
        {} as Event,
        this.isMultiple ? this.comboboxSelectedOptions! : option,
        this.comboBoxSearchText ?? undefined
      );
    }

    if (this.formNode!.change) {
      this.formNode!.change(
        {} as Event,
        this.isMultiple ? this.comboBoxSearchText ?? '' : (option.key as string)
      );
    }
  }

  private fireInputAnyChangeEventIfReq(event: Event) {
    const { newValue, isRealChange } = this.updateInputValue(event);

    if (isRealChange) {
      if (
        this.formNode!.category === TrmrkFormNodeCategory.Combobox &&
        !this.trmrkNode.appearance.useNativeControl
      ) {
        this.comboboxSearchTextChanged(newValue);
      }

      if (this.formNode!.anyChange) {
        this.formNode!.anyChange(event, newValue);
      }
    }

    return { newValue, isRealChange };
  }

  private updateNode(isFirstChange: boolean) {
    this.nodeAttrs = this.trmrkNode.attrs ?? {};
    this.nodeAttrs['data-trmrk-id'] = this.trmrkNode.id;
    this.controlInitialized = true;

    this.formNode = null;
    this.formRow = null;
    this.textNode = null;

    switch (this.trmrkNode.type) {
      case TrmrkFormNodeType.Text:
        this.textNode = this.trmrkNode;
        break;
      case TrmrkFormNodeType.Row:
        this.formRow = this.trmrkNode as TrmrkFormRow;
        break;
      default:
        this.formNode = this.trmrkNode as TrmrkFormNodeObj;

        if (this.isInputControl) {
          if (isFirstChange) {
            this.formControl = new FormControl();

            this.formControlErrorMatcher = new TrmrkErrorStateMatcher(
              () => this.formControlHasError
            );
          }
        } else if (this.formNode.category === TrmrkFormNodeCategory.Combobox) {
          this.controlInitialized = false;
          this.formControl = new FormControl('');

          if (this.formNode!.allowUserToAddItems) {
            this.formNode!.newItemFactory ??= (text: string) => ({
              key: uuidv4(),
              text: text,
              isSelected: true,
            });
          }

          if (!this.formNode!.lazyLoadItems) {
            this.initComboboxItems();
          }
        }

        break;
    }
  }

  private async initComboboxItems() {
    this.comboBoxSearchText ??= this.formNode!.value ?? null;

    if (!this.formNode!.hasSpinner) {
      await this.refreshComboboxItems(this.formNode!.value ?? null);
    }
  }

  private async comboboxSearchTextChanged(searchText: string) {
    this.comboBoxSearchText = searchText;

    if (!this.formNode!.hasSpinner) {
      await this.refreshComboboxItems(searchText);
    }
  }

  private async refreshComboboxItems(searchText: string | null) {
    await refreshFactoryValues(
      this.formNode!.items!,
      {
        searchString: searchText,
        isInit: !this.controlInitialized,
      },
      (hasSpinner) => {
        this.formNode!.hasSpinner = hasSpinner;
      }
    );

    this.controlInitialized = true;
    const itemsValue = this.formNode!.items!.value ?? null;

    if (!this.comboboxSelectedOptions) {
      if (itemsValue) {
        this.comboboxSelectedOptions = itemsValue.filter(
          (item) => item.isSelected
        );
      }
    } else {
      if (itemsValue) {
        for (let option of itemsValue) {
          const selectedOption = this.comboboxSelectedOptions.find(
            (o) => o.key === option.key
          );

          option.isSelected = (selectedOption ?? null) !== null;
        }
      }
    }

    if (this.comboBoxSearchText !== searchText) {
      await this.refreshComboboxItems(this.comboBoxSearchText);
    }
  }

  private getCssClass<TEnum>(
    map: [TEnum, string[]][],
    value: TEnum | NullOrUndef
  ) {
    const cssClass = getCssClass(this.trmrkNode, map, value);
    return cssClass;
  }
}

import {
  Component,
  Input,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import {
  TrmrkDynamicAttributesDirective,
  whenChanged,
  TrmrkHorizStrip,
} from 'trmrk-angular';

import { NullOrUndef } from '../../../../trmrk/core';

import {
  HtmlInputCategory,
  TrmrkButtonCategory,
  TrmrkComboBoxItem,
  TrmrkDOMNodeAttrs,
  TrmrkFormNode as TrmrkFormNodeObj,
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
  TrmrkFormNodeType,
} from '../../../../trmrk/USER-CODE/forms/types';

import {
  TrmrkFormHelper,
  TrmrkFormHelperExtraArgs,
  refreshFactoryValues,
} from '../../../../trmrk/USER-CODE/forms/trmrkForm';

import {
  hasHtmlTemplate,
  hasRawHtml,
  getHtmlTemplateName,
  getRawHtml,
  getSafeHtml,
} from '../form';

import { TrmrkSpinner } from '../trmrk-spinner/trmrk-spinner';
import { TrmrkErrorStateMatcher } from '../../../services/trmrk-error-state-matcher';

const enums = {
  TrmrkFormNodeType,
  TrmrkFormNodeCategory,
  TrmrkFormRowCategory,
};

export const formNodeCategoriesMap: [TrmrkFormNodeCategory, string[]][] = [
  [TrmrkFormNodeCategory.Text, ['trmrk-form-node-text']],
  [TrmrkFormNodeCategory.Heading, ['trmrk-form-node-heading']],
  [TrmrkFormNodeCategory.Input, ['trmrk-form-node-input']],
  [TrmrkFormNodeCategory.Combobox, ['trmrk-form-node-combobox']],
  [TrmrkFormNodeCategory.Button, ['trmrk-form-node-button']],
  [TrmrkFormNodeCategory.HorizStrip, ['trmrk-form-node-horiz-strip']],
  [TrmrkFormNodeCategory.ThinHorizStrip, ['trmrk-form-node-thin-horiz-strip']],
  [TrmrkFormNodeCategory.Group, ['trmrk-form-node-group']],
  [TrmrkFormNodeCategory.Loading, ['trmrk-form-node-loading']],
  [TrmrkFormNodeCategory.HorizRule, ['trmrk-form-node-horiz-rule']],
];

export const formRowCategoriesMap: [TrmrkFormRowCategory, string[]][] = [
  [TrmrkFormRowCategory.Content, ['trmrk-form-row']],
  [TrmrkFormRowCategory.Section, ['trmrk-form-section']],
  [TrmrkFormRowCategory.Blank, ['trmrk-form-row', 'trmrk-form-row-blank']],
];

export const textLevelsMap: [TrmrkTextLevel, string[]][] = [
  [TrmrkTextLevel.Default, ['trmrk-text-level-default']],
  [TrmrkTextLevel.Info, ['trmrk-text-level-info']],
  [TrmrkTextLevel.Warning, ['trmrk-text-level-warning']],
  [TrmrkTextLevel.Error, ['trmrk-text-level-error']],
];

export const textStylesMap: [TrmrkTextStyle, string][] = [
  [TrmrkTextStyle.Code, 'trmrk-text-style-code'],
  [TrmrkTextStyle.Strike, 'trmrk-text-style-strike'],
  [TrmrkTextStyle.Underline, 'trmrk-text-style-underline'],
  [TrmrkTextStyle.Bold, 'trmrk-text-style-bold'],
  [TrmrkTextStyle.Italic, 'trmrk-text-style-italic'],
];

@Component({
  selector: 'trmrk-form-node',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconButton,
    MatIconModule,
    MatSelectModule,
    TrmrkDynamicAttributesDirective,
    TrmrkHorizStrip,
    MatInputModule,
    TrmrkSpinner,
  ],
  templateUrl: './trmrk-form-node.html',
  styleUrl: './trmrk-form-node.scss',
})
export class TrmrkFormNode implements OnChanges {
  @Input() trmrkNode!: TrmrkNodeCore;
  @Input() trmrkPath!: number[];
  @Input() trmrkTemplatesMap?: { [templateName: string]: TemplateRef<any> };

  enums = enums;

  formNode: TrmrkFormNodeObj | null = null;
  formRow: TrmrkFormRow | null = null;
  textNode: TrmrkTextNode | null = null;

  formControl: FormControl | null = null;
  formControlErrorMatcher: TrmrkErrorStateMatcher | null = null;

  searchTextLastCallbackFiredStr: string | null = null;

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
      this.formNode!.category <= enums.TrmrkFormNodeCategory.IconButton;

    return isInputControl;
  }

  get controlAttrs() {
    let controlAttrs: TrmrkDOMNodeAttrs;

    if (this.formNode) {
      controlAttrs = this.formNode.controlAttrs ?? {};

      if (this.formNode.isRequired) {
        controlAttrs['required'] = '';
      }

      if (
        this.formNode.category === TrmrkFormNodeCategory.Combobox &&
        (this.formNode.label ?? null) === null &&
        (this.formNode.linesCount ?? null) !== null
      ) {
        controlAttrs['multiple'] = '';
      }
    } else {
      controlAttrs = {};
    }

    return controlAttrs;
  }

  get cssClass(): string[] {
    switch (this.trmrkNode.type) {
      case TrmrkFormNodeType.Text:
        return this.textNodeCssClass;
      case TrmrkFormNodeType.Row:
        return this.rowCssClass;
      default:
        return this.nodeCssClass;
    }
  }

  get nodeCssClass(): string[] {
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

  get rowCssClass(): string[] {
    let cssClass = this.getCssClass(
      formRowCategoriesMap,
      this.formRow?.category
    );

    if (this.formRow) {
      if ((this.formRow.heightFactor ?? null) !== null) {
        cssClass.push(`trmrk-height-x${this.formRow.heightFactor}`);
      }
    }

    return cssClass;
  }

  get textNodeCssClass(): string[] {
    let cssClass = this.getCssClass(textLevelsMap, this.textNode?.level);

    if (this.textNode) {
      cssClass.push('trmrk-text-node');

      if ((this.textNode.style ?? null) !== null && this.textNode.style! > 0) {
        let style = this.textNode.style as number;

        for (let kvp of textStylesMap) {
          const kvpStyle = kvp[0];
          let rem = style % kvpStyle;
          style = (style - rem) / kvpStyle;

          if (rem === 0) {
            const kvpClass = kvp[1];
            cssClass.push(kvpClass);
          }
        }
      }
    }

    return cssClass;
  }

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkNode,
      (_, change) => {
        this.updateNode(change.firstChange);
      }
    );
  }

  updateNode(isFirstChange: boolean) {
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
          this.formNode!.items!.value = [];
          this.initComboboxItems();
        }

        break;
    }
  }

  async initComboboxItems() {
    this.searchTextLastCallbackFiredStr = this.formNode!.value ?? null;
    await this.refreshComboboxItems(this.formNode!.value ?? null);
  }

  async comboboxSearchTextChanged(searchText: string) {
    this.searchTextLastCallbackFiredStr = searchText;

    if (!this.formNode!.hasSpinner) {
      await this.refreshComboboxItems(searchText);
    }
  }

  async refreshComboboxItems(searchText: string | null) {
    await refreshFactoryValues(
      this.formNode!.items!,
      searchText,
      (hasSpinner) => {
        this.formNode!.hasSpinner = hasSpinner;
      }
    );

    if (this.searchTextLastCallbackFiredStr !== searchText) {
      await this.refreshComboboxItems(this.searchTextLastCallbackFiredStr);
    }
  }

  childPath(idx: number) {
    const path = [...this.trmrkPath, idx];
    return path;
  }

  getCssClass<TEnum>(map: [TEnum, string[]][], value: TEnum | NullOrUndef) {
    let cssClass: string[];

    if ((value ?? null) !== null) {
      const kvp = map.find((kvp) => kvp[0] === value);

      if (kvp) {
        cssClass = kvp[1];
      } else {
        cssClass = [];
      }
    } else {
      cssClass = [];
    }

    if ((this.trmrkNode.cssClass ?? null) !== null) {
      cssClass.push(this.trmrkNode.cssClass!);
    }

    return cssClass;
  }

  toggleSection() {
    this.formRow!.isExpanded = !(this.formRow!.isExpanded ?? true);
  }

  clearNode() {
    if (this.formNode) {
      this.formNode.value = null;
    }
  }
}

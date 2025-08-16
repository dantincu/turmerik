import {
  Component,
  Input,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
  TrmrkFormTextArg,
  TrmrkFormHelperExtraArgs,
} from '../../../../trmrk/USER-CODE/forms/trmrkForm';

import {
  hasHtmlTemplate,
  hasRawHtml,
  getHtmlTemplateName,
  getRawHtml,
  getSafeHtml,
} from '../form';

import { TrmrkSpinner } from '../trmrk-spinner/trmrk-spinner';

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
    TrmrkDynamicAttributesDirective,
    MatButtonModule,
    MatIconButton,
    MatIconModule,
    TrmrkHorizStrip,
    MatInputModule,
    TrmrkSpinner,
  ],
  templateUrl: './trmrk-form-node.html',
  styleUrl: './trmrk-form-node.scss',
})
export class TrmrkFormNode<TData = any> implements OnChanges {
  @Input() trmrkNode!: TrmrkNodeCore<TData, NodeHtml>;
  @Input() path!: number[];
  @Input() trmrkTemplatesMap?: { [templateName: string]: TemplateRef<any> };

  enums = enums;

  formNode: TrmrkFormNodeObj<TData, NodeHtml> | null = null;
  formRow: TrmrkFormRow<TData, NodeHtml> | null = null;
  textNode: TrmrkTextNode<TData, NodeHtml> | null = null;

  get hasRawHtml() {
    return hasRawHtml(this.trmrkNode.html);
  }

  get hasHtmlTemplate() {
    return hasHtmlTemplate(this.trmrkNode.html);
  }

  get safeHtml(): SafeHtml | null {
    return getSafeHtml(this.trmrkNode.html, this.sanitizer);
  }

  get htmlTemplateName(): string {
    return getHtmlTemplateName(this.trmrkNode.html)!;
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
    } else {
      cssClass = [];
    }

    return cssClass;
  }

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkNode,
      () => {
        this.updateInputNode();
      }
    );
  }

  updateInputNode() {
    this.formNode = null;
    this.formRow = null;
    this.textNode = null;

    switch (this.trmrkNode.type) {
      case TrmrkFormNodeType.Text:
        this.textNode = this.trmrkNode;
        break;
      case TrmrkFormNodeType.Row:
        this.formRow = this.trmrkNode as TrmrkFormRow<TData, NodeHtml>;
        break;
      default:
        this.formNode = this.trmrkNode as TrmrkFormNodeObj<TData, NodeHtml>;
        break;
    }
  }

  childPath(idx: number) {
    const path = [...this.path, idx];
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

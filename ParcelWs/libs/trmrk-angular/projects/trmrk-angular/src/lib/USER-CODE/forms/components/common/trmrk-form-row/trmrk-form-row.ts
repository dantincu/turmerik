import { Component, Input, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';

import { whenChanged } from '../../../../../services/common/simpleChanges';
import { TrmrkDynamicAttributesDirective } from '../../../../../directives/trmrk-dynamic-attributes';
import { TrmrkHorizStrip } from '../../../../../components/common/trmrk-horiz-strip/trmrk-horiz-strip';

import {
  TrmrkFormNodeType,
  TrmrkFormNodeCategory,
  TrmrkFormRowCategory,
  TrmrkDOMNodeAttrs,
  TrmrkFormRow as TrmrkFormRowObj,
} from '../../../../../../trmrk/USER-CODE/forms/types';

import {
  hasHtmlTemplate,
  hasRawHtml,
  getHtmlTemplateName,
  getSafeHtml,
  getCssClassFromMap,
  formRowCategoriesMap,
} from '../../../helpers/form';

import { TrmrkFormNode } from '../trmrk-form-node/trmrk-form-node';

import { normalizeAttrs, normalizeCssClass } from '../../../helpers/form';

import { NullOrUndef } from '../../../../../../trmrk/core';

const enums = {
  TrmrkFormNodeType,
  TrmrkFormNodeCategory,
  TrmrkFormRowCategory,
};

@Component({
  selector: 'trmrk-form-row',
  imports: [
    CommonModule,
    MatIconModule,
    TrmrkDynamicAttributesDirective,
    TrmrkHorizStrip,
    TrmrkFormNode,
  ],
  templateUrl: './trmrk-form-row.html',
  styleUrl: './trmrk-form-row.scss',
})
export class TrmrkFormRow implements OnChanges {
  @Input() trmrkRow!: TrmrkFormRowObj;
  @Input() trmrkPath!: number[];
  @Input() trmrkTemplatesMap!: { [templateName: string]: TemplateRef<any> };

  enums = enums;

  attrs!: TrmrkDOMNodeAttrs;
  controlAttrs!: TrmrkDOMNodeAttrs;

  cssClass!: string[];
  controlCssClass!: string[];
  skipDefaultCssClass: boolean | NullOrUndef;
  skipDefaultControlCssClass: boolean | NullOrUndef;

  private _hasRawHtml: boolean | null = null;
  private _hasHtmlTemplate: boolean | null = null;
  private _safeHtml: SafeHtml | null = null;
  private _htmlTemplateName: string | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  get hasRawHtml() {
    this._hasRawHtml ??= hasRawHtml(this.trmrkRow.html);
    return this._hasRawHtml!;
  }

  get hasHtmlTemplate() {
    this._hasHtmlTemplate ??= hasHtmlTemplate(this.trmrkRow.html);
    return this._hasHtmlTemplate!;
  }

  get safeHtml() {
    this._safeHtml ??= getSafeHtml(this.trmrkRow.html, this.sanitizer);
    return this._safeHtml;
  }

  get htmlTemplateName() {
    this._htmlTemplateName ??= getHtmlTemplateName(this.trmrkRow.html)!;
    return this._htmlTemplateName;
  }

  get heightFactor() {
    return this.trmrkRow.heightFactor ?? null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkRow,
      (_, change) => {
        this.updateNode(change.firstChange);
      }
    );
  }

  childPath(idx: number) {
    const path = [...this.trmrkPath, idx];
    return path;
  }

  toggleSection() {
    this.trmrkRow!.isExpanded = !(this.trmrkRow!.isExpanded ?? true);
  }

  private refreshAttrs() {
    const normAttrs = normalizeAttrs(this.trmrkRow.attrs);
    const normControlAttrs = normalizeAttrs(this.trmrkRow.controlAttrs);
    this.attrs = normAttrs.main;
    this.controlAttrs = normControlAttrs.main;
  }

  private refreshCssClass() {
    const normCssClass = normalizeCssClass(this.trmrkRow.cssClass);
    const normControlCssClass = normalizeCssClass(this.trmrkRow.cssClass);

    this.cssClass = normCssClass.main.classes;
    this.controlCssClass = normControlCssClass.main.classes;
    this.skipDefaultCssClass = normCssClass.main.skipDefaultCssClass;
    this.skipDefaultControlCssClass = normControlCssClass.main.skipDefaultCssClass;

    this.cssClass.push(...getCssClassFromMap(formRowCategoriesMap, this.trmrkRow.category));

    const heightFactor = this.heightFactor;

    if ((heightFactor ?? null) !== null) {
      this.cssClass.push(`trmrk-height-x${heightFactor}`);
    }

    if (!this.skipDefaultControlCssClass) {
      this.controlCssClass.push('trmrk-form-row-heading');
    }
  }

  private updateNode(_: boolean) {
    this.resetProps();
    this.refreshAttrs();
    this.refreshCssClass();
  }

  private resetProps() {
    this.attrs = null!;
    this.controlAttrs = null!;
    this.cssClass = null!;
    this.controlCssClass = null!;
    this.skipDefaultCssClass = null;
    this.skipDefaultControlCssClass = null;

    this._hasRawHtml = null;
    this._hasHtmlTemplate = null;
    this._safeHtml = null;
    this._htmlTemplateName = null;
  }
}

import {
  Component,
  Input,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';

import {
  TrmrkDynamicAttributesDirective,
  whenChanged,
  TrmrkHorizStrip,
} from 'trmrk-angular';

import {
  TrmrkDOMNodeAttrs,
  TrmrkFormRow as TrmrkFormRowObj,
} from '../../../../../../trmrk/USER-CODE/forms/types';

import {
  hasHtmlTemplate,
  hasRawHtml,
  getHtmlTemplateName,
  getSafeHtml,
  getCssClass,
  formRowCategoriesMap,
} from '../../../form';

import { TrmrkFormNode } from '../trmrk-form-node/trmrk-form-node';

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
  @Input() trmrkTemplatesMap?: { [templateName: string]: TemplateRef<any> };

  nodeAttrs: TrmrkDOMNodeAttrs = {};

  constructor(private sanitizer: DomSanitizer) {}

  get hasRawHtml() {
    return hasRawHtml(this.trmrkRow.html);
  }

  get hasHtmlTemplate() {
    return hasHtmlTemplate(this.trmrkRow.html);
  }

  get safeHtml() {
    return getSafeHtml(this.trmrkRow.html, this.sanitizer);
  }

  get htmlTemplateName() {
    return getHtmlTemplateName(this.trmrkRow.html)!;
  }

  get formControlHasError() {
    const formControlHasError = (this.trmrkRow.errorMsg ?? null) !== null;
    return formControlHasError;
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

  get controlAttrs() {
    let controlAttrs = this.trmrkRow.controlAttrs ?? {};
    return controlAttrs;
  }

  get cssClass(): string[] {
    let cssClass = getCssClass(
      this.trmrkRow,
      formRowCategoriesMap,
      this.trmrkRow?.category
    );

    if (this.trmrkRow) {
      if ((this.trmrkRow.heightFactor ?? null) !== null) {
        cssClass.push(`trmrk-height-x${this.trmrkRow.heightFactor}`);
      }
    }

    return cssClass;
  }

  get controlCssClass(): string[] {
    let cssClass: string[] = [];

    if (this.trmrkRow.controlClass) {
      cssClass.push(this.trmrkRow.controlClass);
    }

    return cssClass;
  }

  childPath(idx: number) {
    const path = [...this.trmrkPath, idx];
    return path;
  }

  toggleSection() {
    this.trmrkRow!.isExpanded = !(this.trmrkRow!.isExpanded ?? true);
  }

  private updateNode(_: boolean) {
    this.nodeAttrs = this.trmrkRow.attrs ?? {};
    this.nodeAttrs['data-trmrk-id'] = this.trmrkRow.id;
  }
}

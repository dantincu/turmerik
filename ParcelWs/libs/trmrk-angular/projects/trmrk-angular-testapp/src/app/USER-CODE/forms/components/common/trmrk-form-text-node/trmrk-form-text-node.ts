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

import { TrmrkDynamicAttributesDirective, whenChanged } from 'trmrk-angular';

import {
  TrmrkDOMNodeAttrs,
  TrmrkTextNode,
} from '../../../../../../trmrk/USER-CODE/forms/types';

import {
  hasHtmlTemplate,
  hasRawHtml,
  getHtmlTemplateName,
  getSafeHtml,
  getCssClass,
  textLevelsMap,
  textStylesMap,
} from '../../../form';

@Component({
  selector: 'trmrk-form-text-node',
  imports: [CommonModule, MatIconModule, TrmrkDynamicAttributesDirective],
  templateUrl: './trmrk-form-text-node.html',
  styleUrl: './trmrk-form-text-node.scss',
})
export class TrmrkFormTextNode implements OnChanges {
  @Input() trmrkNode!: TrmrkTextNode;
  @Input() trmrkPath!: number[];
  @Input() trmrkTemplatesMap?: { [templateName: string]: TemplateRef<any> };

  nodeAttrs: TrmrkDOMNodeAttrs = {};

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

  get formControlHasError() {
    const formControlHasError = (this.trmrkNode.errorMsg ?? null) !== null;
    return formControlHasError;
  }

  get cssClass(): string[] {
    let cssClass = getCssClass(
      this.trmrkNode,
      textLevelsMap,
      this.trmrkNode.level
    );

    cssClass.push('trmrk-text-node');

    if ((this.trmrkNode.style ?? null) !== null && this.trmrkNode.style! > 0) {
      let style = this.trmrkNode.style as number;

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

    return cssClass;
  }

  get controlCssClass(): string[] {
    let cssClass: string[] = ['trmrk-icon'];

    if (this.trmrkNode.controlClass) {
      cssClass.push(this.trmrkNode.controlClass);
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

  private updateNode(_: boolean) {
    this.nodeAttrs = this.trmrkNode.attrs ?? {};
    this.nodeAttrs['data-trmrk-id'] = this.trmrkNode.id;
  }
}

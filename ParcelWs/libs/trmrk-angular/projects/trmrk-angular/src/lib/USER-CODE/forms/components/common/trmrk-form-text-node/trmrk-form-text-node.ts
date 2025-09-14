import {
  Component,
  Input,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';

import { whenChanged } from '../../../../../services/simpleChanges';
import { TrmrkDynamicAttributesDirective } from '../../../../../directives/trmrk-dynamic-attributes';

import {
  TrmrkDOMNodeAttrs,
  TrmrkTextNode,
} from '../../../../../../trmrk/USER-CODE/forms/types';

import {
  hasHtmlTemplate,
  hasRawHtml,
  getHtmlTemplateName,
  getSafeHtml,
  getCssClassFromMap,
  textLevelsMap,
  textStylesMap,
} from '../../../form';

import { normalizeAttrs, normalizeCssClass } from '../../../form';
import { NullOrUndef } from '../../../../../../trmrk/core';
import { AppearanceCore } from '../../../types';

@Component({
  selector: 'trmrk-form-text-node',
  imports: [CommonModule, MatIconModule, TrmrkDynamicAttributesDirective],
  templateUrl: './trmrk-form-text-node.html',
  styleUrl: './trmrk-form-text-node.scss',
})
export class TrmrkFormTextNode implements OnChanges {
  @Input() trmrkNode!: TrmrkTextNode;
  @Input() trmrkPath!: number[];
  @Input() trmrkTemplatesMap!: { [templateName: string]: TemplateRef<any> };

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

  get appearance() {
    return this.trmrkNode.appearance as AppearanceCore | NullOrUndef;
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

  private refreshAttrs() {
    const normAttrs = normalizeAttrs(this.trmrkNode.attrs);
    const normControlAttrs = normalizeAttrs(this.trmrkNode.controlAttrs);
    this.attrs = normAttrs.main;
    this.controlAttrs = normControlAttrs.main;
  }

  private refreshCssClass() {
    const normCssClass = normalizeCssClass(this.trmrkNode.cssClass);
    const normControlCssClass = normalizeCssClass(this.trmrkNode.cssClass);

    this.cssClass = normCssClass.main.classes;
    this.controlCssClass = normControlCssClass.main.classes;
    this.skipDefaultCssClass = normCssClass.main.skipDefaultCssClass;
    this.skipDefaultControlCssClass =
      normControlCssClass.main.skipDefaultCssClass;

    /*
     * cssClass
     */

    this.cssClass.push(
      ...getCssClassFromMap(textLevelsMap, this.trmrkNode.level)
    );

    if ((this.trmrkNode.style ?? null) !== null && this.trmrkNode.style! > 0) {
      let style = this.trmrkNode.style as number;

      for (let kvp of textStylesMap) {
        const kvpStyle = kvp[0];
        let rem = style % kvpStyle;
        style = (style - rem) / kvpStyle;

        if (rem === 0) {
          const kvpClass = kvp[1];
          this.cssClass.push(kvpClass);
        }
      }
    }

    if (!this.skipDefaultCssClass) {
      this.cssClass.push('trmrk-text-node');
    }

    /*
     * controlCssClass
     */

    if (
      (this.trmrkNode.iconName ?? null) !== null &&
      !this.skipDefaultControlCssClass
    ) {
      this.controlCssClass.push('trmrk-icon');
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

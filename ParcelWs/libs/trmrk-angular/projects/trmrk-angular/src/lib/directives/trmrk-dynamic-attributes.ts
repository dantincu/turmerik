import { Directive, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[trmrkDynamicAttributes]',
})
export class TrmrkDynamicAttributesDirective implements OnInit {
  @Input('trmrkDynamicAttributes') attributes!: { [key: string]: string };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    for (const key in this.attributes) {
      this.renderer.setAttribute(
        this.el.nativeElement,
        key,
        this.attributes[key]
      );
    }
  }
}

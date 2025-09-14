import { Directive, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[trmrkCancelContextMenu]',
})
export class TrmrkCancelContextMenu implements AfterViewInit, OnDestroy {
  constructor(private host: ElementRef<HTMLElement>) {
    this.contextMenu = this.contextMenu.bind(this);
  }

  ngAfterViewInit(): void {
    this.host.nativeElement.addEventListener('contextmenu', this.contextMenu);
  }

  ngOnDestroy(): void {
    this.host.nativeElement.removeEventListener('contextmenu', this.contextMenu);
  }

  private contextMenu(event: Event) {
    event.preventDefault();
  }
}

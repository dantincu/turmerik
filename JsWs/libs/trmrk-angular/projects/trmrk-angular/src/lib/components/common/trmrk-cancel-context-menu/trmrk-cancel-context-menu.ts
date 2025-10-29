import { Component, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'trmrk-cancel-context-menu',
  imports: [],
  templateUrl: './trmrk-cancel-context-menu.html',
  styleUrl: './trmrk-cancel-context-menu.scss',
})
export class TrmrkCancelContextMenu implements OnDestroy, AfterViewInit {
  constructor(private hostEl: ElementRef) {
    this.contextMenu = this.contextMenu.bind(this);
  }

  ngAfterViewInit() {
    (this.hostEl.nativeElement as HTMLElement).addEventListener('contextmenu', this.contextMenu);
  }

  ngOnDestroy() {
    (this.hostEl.nativeElement as HTMLElement).removeEventListener('contextmenu', this.contextMenu);
  }

  private contextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}

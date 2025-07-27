import {
  Directive,
  ElementRef,
  OnDestroy,
  Input,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

import { toggleEventListener } from '../../trmrk-browser/domUtils/common';

@Directive()
export abstract class TrmrkEventCoreBase<TEvent extends Event> {
  @Input() trmrkCapture = false;

  abstract get event(): EventEmitter<TEvent>;

  constructor(protected host: ElementRef<HTMLElement>) {
    this.onEvent = this.onEvent.bind(this);
  }

  protected addEventListener(eventName: keyof HTMLElementEventMap) {
    this.toggleEventListener(eventName, true);
  }

  protected removeEventListener(eventName: keyof HTMLElementEventMap) {
    this.toggleEventListener(eventName, false);
  }

  private toggleEventListener(
    eventName: keyof HTMLElementEventMap,
    add: boolean
  ) {
    toggleEventListener(
      this.host.nativeElement,
      add,
      eventName,
      this.onEvent as (ev: Event) => any,
      this.getEventListenerOptions()
    );
  }

  private onEvent(event: TEvent) {
    this.event.emit(event as TEvent);
  }

  private getEventListenerOptions() {
    const retVal = {
      capture: this.trmrkCapture,
    };

    return retVal;
  }
}

@Directive({})
export abstract class TrmrkEventBase<TEvent extends Event>
  extends TrmrkEventCoreBase<TEvent>
  implements AfterViewInit, OnDestroy
{
  abstract get eventName(): keyof HTMLElementEventMap;

  ngAfterViewInit(): void {
    this.addEventListener(this.eventName);
  }

  ngOnDestroy(): void {
    this.removeEventListener(this.eventName);
  }
}

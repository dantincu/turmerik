import BaseComponent, {
  GetInstanceFactory,
  GetOrCreateInstanceFactory,
} from "./base-component";

import { Tooltip } from "./tooltip";

export class Popover extends BaseComponent {
  static getInstance: GetInstanceFactory<PopoverNs>;

  /**
   * Static method which allows you to get the popover instance associated with
   *  a DOM element, or create a new one in case it wasn’t initialised
   */
  static getOrCreateInstance: GetOrCreateInstanceFactory<
    PopoverNs,
    Partial<PopoverNs.Options>
  >;

  static jQueryInterface: PopoverNs.jQueryInterface;

  static NAME: "popover";

  /**
   * Default settings of this plugin
   *
   * @link https://getbootstrap.com/docs/5.0/getting-started/javascript/#default-settings
   */
  static Default: PopoverNs.Options;

  static DefaultType: Record<keyof PopoverNs.Options, string>;

  static Event: Record<
    | "CLICK"
    | "FOCUSIN"
    | "FOCUSOUT"
    | "HIDDEN"
    | "HIDE"
    | "INSERTED"
    | "MOUSEENTER"
    | "MOUSELEAVE"
    | "SHOW"
    | "SHOWN",
    string
  >;
  constructor(element: string | Element, options?: Partial<PopoverNs.Options>);

  /**
   * Reveals an element’s popover. Returns to the caller before the
   * popover has actually been shown (i.e. before the shown.bs.popover
   * event occurs). This is considered a “manual” triggering of the
   * popover. Popovers whose title and content are both zero-length are
   * never displayed.
   */
  show(): void;

  /**
   * Hides an element’s popover. Returns to the caller before the popover
   * has actually been hidden (i.e. before the hidden.bs.popover event
   * occurs). This is considered a “manual” triggering of the popover.
   */
  hide(): void;

  /**
   * Toggles an element’s popover. Returns to the caller before the
   * popover has actually been shown or hidden (i.e. before the
   * shown.bs.popover or hidden.bs.popover event occurs). This is
   * considered a “manual” triggering of the popover.
   */
  toggle(): void;

  /**
   * Gives an element’s popover the ability to be shown. Popovers are
   * enabled by default.
   */
  enable(): void;

  /**
   * Removes the ability for an element’s popover to be shown. The popover
   * will only be able to be shown if it is re-enabled.
   */
  disable(): void;

  /**
   * Toggles the ability for an element’s popover to be shown or hidden.
   */
  toggleEnabled(): void;

  /**
   * Updates the position of an element’s popover.
   */
  update(): void;

  /**
   * Gives a way to change the popover’s content after its initialization.
   */
  setContent(
    content?: Record<
      string,
      string | Element | Tooltip.SetContentFunction | null
    >
  ): void;
}

export namespace PopoverNs {
  export enum Events {
    /**
     * This event fires immediately when the show instance method is called.
     */
    show = "show.bs.popover",

    /**
     * This event is fired when the popover has been made visible to the
     * user (will wait for CSS transitions to complete).
     */
    shown = "shown.bs.popover",

    /**
     * This event is fired immediately when the hide instance method has
     * been called.
     */
    hide = "hide.bs.popover",

    /**
     * This event is fired when the popover has finished being hidden from
     * the user (will wait for CSS transitions to complete).
     */
    hidden = "hidden.bs.popover",

    /**
     * This event is fired after the show.bs.popover event when the popover
     * template has been added to the DOM.
     */
    inserted = "inserted.bs.popover",
  }

  export interface Options extends Tooltip.Options {
    /**
     * Default content value if data-content attribute isn't present.
     *
     * If a function is given, it will be called with its this reference set
     * to the element that the popover is attached to.
     *
     * @default ''
     */
    content:
      | string
      | Element
      | JQuery
      | ((this: HTMLElement) => string | Element | JQuery);
  }

  export type jQueryInterface = (
    config?:
      | Partial<Options>
      | "show"
      | "hide"
      | "toggle"
      | "enable"
      | "disable"
      | "toggleEnabled"
      | "update"
      | "setContent"
      | "dispose"
  ) => JQuery;
}

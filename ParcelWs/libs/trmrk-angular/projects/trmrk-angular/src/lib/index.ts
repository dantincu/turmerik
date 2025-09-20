/*
 * Public API Surface of trmrk-angular
 */

import { AppConfigCore as AppConfigCoreTsIntf } from './services/common/app-config';

import {
  TrmrkPanelListServiceItemData as TrmrkPanelListServiceItemDataTsIntf,
  TrmrkPanelListServiceRow as TrmrkPanelListServiceRowTsIntf,
  TrmrkPanelListServiceSetupArgs as TrmrkPanelListServiceSetupArgsTsIntf,
} from './services/common/trmrk-panel-list-service';

import {
  TrmrkTree as TrmrkTreeTsIntf,
  TrmrkTreeNode as TrmrkTreeNodeTsIntf,
  TrmrkTreeNodeData as TrmrkTreeNodeDataTsIntf,
  TrmrkTreeNodeEvent as TrmrkTreeNodeEventTsIntf,
  TrmrkTreeNodeEventCore as TrmrkTreeNodeEventCoreTsIntf,
} from './services/common/TrmrkTree';

export * as USER_CODE from './USER-CODE';
export * as assets from './assets';
export * as components from './components';
export * as directives from './directives';
export * as services from './services';

export { TrmrkForm } from './USER-CODE/forms/components/common/trmrk-form/trmrk-form';
export { TrmrkFormNode } from './USER-CODE/forms/components/common/trmrk-form-node/trmrk-form-node';
export { TrmrkFormRow } from './USER-CODE/forms/components/common/trmrk-form-row/trmrk-form-row';
export { TrmrkFormTextNode } from './USER-CODE/forms/components/common/trmrk-form-text-node/trmrk-form-text-node';
export { TrmrkSpinner } from './USER-CODE/forms/components/common/trmrk-spinner/trmrk-spinner';

export { TrmrkAcceleratingScrollControl } from './components/common/trmrk-accelerating-scroll-control/trmrk-accelerating-scroll-control';
export { TrmrkAcceleratingScrollPopover } from './components/common/trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';
export { TrmrkAppBar } from './components/common/trmrk-app-bar/trmrk-app-bar';
export { TrmrkAppLink } from './components/common/trmrk-app-link/trmrk-app-link';
export { TrmrkAppPage } from './components/common/trmrk-app-page/trmrk-app-page';
export { TrmrkCancelContextMenu as TrmrkCancelContextMenuComponent } from './components/common/trmrk-cancel-context-menu/trmrk-cancel-context-menu';
export { TrmrkDialog } from './components/common/trmrk-dialog/trmrk-dialog';
export { TrmrkHorizStrip } from './components/common/trmrk-horiz-strip/trmrk-horiz-strip';
export { TrmrkListAppPanel } from './components/common/trmrk-list-app-panel/trmrk-list-app-panel';
export { TrmrkLoading } from './components/common/trmrk-loading/trmrk-loading';
export { TrmrkPanelList } from './components/common/trmrk-panel-list/trmrk-panel-list';
export { TrmrkPanelListItem } from './components/common/trmrk-panel-list-item/trmrk-panel-list-item';
export { TrmrkThinHorizStrip } from './components/common/trmrk-thin-horiz-strip/trmrk-thin-horiz-strip';
export { TrmrkTreeViewNode } from './components/common/trmrk-tree-view-node/trmrk-tree-view-node';
export { TrmrkUserMessage } from './components/common/trmrk-user-message/trmrk-user-message';

export { TrmrkAppSettings } from './components/pages/trmrk-app-settings/trmrk-app-settings';
export { TrmrkResetAppDialog } from './components/pages/trmrk-app-settings/trmrk-reset-app-dialog/trmrk-reset-app-dialog';
export { TrmrkAppThemes } from './components/pages/trmrk-app-themes/trmrk-app-themes';
export { NotFound } from './components/pages/trmrk-not-found/trmrk-not-found';
export { TrmrkResetApp } from './components/pages/trmrk-reset-app/trmrk-reset-app';

export { TrmrkCancelContextMenu } from './directives/trmrk-cancel-context-menu';
export { TrmrkContinuousPress } from './directives/trmrk-continuous-press';
export { TrmrkDrag } from './directives/trmrk-drag';
export { TrmrkDynamicAttributesDirective } from './directives/trmrk-dynamic-attributes';
export { TrmrkEventBase } from './directives/trmrk-event-base';
export { TrmrkLongPressOrRightClick } from './directives/trmrk-long-press-or-right-click';
export { TrmrkMultiClick } from './directives/trmrk-multi-click';
export { TrmrkTouchEndOrMouseUp } from './directives/trmrk-touch-end-or-mouse-up';
export { TrmrkTouchOrMouseEventBase } from './directives/trmrk-touch-or-mouse-event-base';
export { TrmrkTouchOrMouseMove } from './directives/trmrk-touch-or-mouse-move';
export { TrmrkTouchStartOrMouseDown } from './directives/trmrk-touch-start-or-mouse-down';

export { AppBarMapService } from './services/common/app-bar-map-service';
export { AppServiceBase } from './services/common/app-service-base';
export { AppStateServiceBase } from './services/common/app-state-service-base';
export { ComponentIdService } from './services/common/component-id-service';
export { DragService } from './services/common/drag-service';
export { IntIdService } from './services/common/int-id-service';
export { IntIdServiceFactory } from './services/common/int-id-service-factory';
export { ModalIdService } from './services/common/modal-id-service';
export { ToggleAppBarServiceBase } from './services/common/toggle-app-bar-service-base';
export { TrmrkAcceleratingScrollService } from './services/common/trmrk-accelerating-scroll-service';
export { TrmrkPanelListService } from './services/common/trmrk-panel-list-service';

export type AppConfigCore = AppConfigCoreTsIntf;

export type TrmrkPanelListServiceRow<TEntity> = TrmrkPanelListServiceRowTsIntf<TEntity>;
export type TrmrkPanelListServiceItemData<TEntity> = TrmrkPanelListServiceItemDataTsIntf<TEntity>;

export type TrmrkPanelListServiceSetupArgs<TEntity, TItem> = TrmrkPanelListServiceSetupArgsTsIntf<
  TEntity,
  TItem
>;

export type TrmrkTree<T> = TrmrkTreeTsIntf<T>;
export type TrmrkTreeNode<T> = TrmrkTreeNodeTsIntf<T>;
export type TrmrkTreeNodeData<T> = TrmrkTreeNodeDataTsIntf<T>;

export type TrmrkTreeNodeEvent<T, TValue, TEvent = any> = TrmrkTreeNodeEventTsIntf<
  T,
  TValue,
  TEvent
>;

export type TrmrkTreeNodeEventCore<T, TEvent = any> = TrmrkTreeNodeEventCoreTsIntf<T, TEvent>;

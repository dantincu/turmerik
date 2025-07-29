import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TrmrkDrag, TrmrkDragEvent } from 'trmrk-angular';
import { TrmrkLongPressOrRightClick } from 'trmrk-angular';
import { TrmrkMultiClick } from 'trmrk-angular';

import {
  TrmrkUserMessage,
  TrmrkObservable,
  TrmrkTree,
  TrmrkTreeNode,
  TrmrkTreeNodeData,
  TrmrkTreeNodeEvent,
  TrmrkTreeNodeEventCore,
  ComponentIdService,
  AppBarMapService,
} from 'trmrk-angular';

import { TrmrkAppBar } from 'trmrk-angular';
import { TrmrkPanelListItem, trmrkTreeEventHandlers } from 'trmrk-angular';
import { TrmrkHorizStrip, TrmrkHorizStripType } from 'trmrk-angular';
import { TrmrkThinHorizStrip } from 'trmrk-angular';

import { encodeHtml } from '../../trmrk/text';
import { UserMessageLevel } from '../../trmrk/core';
import { getNextIdx } from '../../trmrk/math';
import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkAppIcon } from '../trmrk-app-icon/trmrk-app-icon';
import { TreeNode } from '../trmrk-tree-node/trmrk-tree-node';
import { TrmrkTreeView } from '../trmrk-tree-view/trmrk-tree-view';
import { CompaniesAppPanel } from '../companies-app-panel/companies-app-panel';
import { ToggleAppBarService } from '../services/toggle-app-bar-service';

import { companies } from '../services/companies';

@Component({
  selector: 'app-home-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    RouterLink,
    TrmrkAppIcon,
    MatMenuModule,
    CommonModule,
    TrmrkDrag,
    TrmrkLongPressOrRightClick,
    TrmrkMultiClick,
    TrmrkUserMessage,
    TrmrkHorizStrip,
    TrmrkAppBar,
    MatInputModule,
    MatFormFieldModule,
    TrmrkPanelListItem,
    TrmrkTreeView,
    TrmrkThinHorizStrip,
    CompaniesAppPanel,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  providers: [ToggleAppBarService],
})
export class HomePage implements OnDestroy {
  @ViewChild('appBar') appBar!: TrmrkAppBar;

  @ViewChild('appPageContent') appPageContent!: ElementRef<HTMLDivElement>;

  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  @ViewChild('optionsMenuTrigger', { read: MatMenuTrigger })
  optionsMenuTrigger!: MatMenuTrigger;

  @ViewChild('draggableStrip', { read: ElementRef })
  draggableStrip!: ElementRef;

  quote = '"';
  nonBreakingText = encodeHtml(
    'This is a    non-breaking &space example.<h5>asdfasdfasdf</h5>',
    true
  );

  longPressUserMsg1: string = '';
  longPressUserMsg2: string = '';
  multiClickUserMsg: string = '';

  showUserMsg = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  mainUserMessageStr = '';
  showMainUserMessage = 0;
  mainUserMessageLevel = UserMessageLevel.Info;

  TrmrkHorizStripType = TrmrkHorizStripType;

  horizStripText = [
    'asdfasdfsadsafd   asdfasdfsadsafda sdfasdfsadsafd',
    'asdfasdfsadsafdasdfasdfsadsafd asdfasdfsadsafdasdfasdfsadsafd',
    'asdfasdfsadsafd',
  ].join('  ');

  horizStripTextArr = [
    this.horizStripText,
    'asdfasdfsadsafd asdfasdfsadsafd',
    'asdfasdfsadsafd asdfasdfsadsafd asdfasdfsadsafd fsad.',
  ];

  companies = [...companies];

  treeViewData: TrmrkTree<TreeNode>;

  popupClosedMessage = '';

  private id: number;

  constructor(
    private appBarMapService: AppBarMapService,
    private toggleAppBarService: ToggleAppBarService,
    componentIdService: ComponentIdService
  ) {
    this.id = componentIdService.getNextId();

    appBarMapService.setCurrent(
      this.id,
      () => this.appBar.hostEl.nativeElement
    );

    this.toggleAppBarService.init({
      getAppPanelElem: () => this.appPageContent.nativeElement,
    });

    this.treeViewData = this.getTreeViewData();

    setTimeout(() => {
      this.optionsMenuTrigger.menu = this.optionsMenu;
    }, 0);
  }

  onOptionsMenuBtnClick(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
  }

  ngOnDestroy(): void {
    this.appBarMapService.clear(this.id);
  }

  onDrag(event: TrmrkDragEvent) {
    const draggableStripEl = this.draggableStrip.nativeElement as HTMLElement;
    const draggableStripWidth = draggableStripEl.offsetWidth;
    const dragStartPosition = event.dragStartPosition;
    const containerElWidth = draggableStripEl.parentElement!.scrollWidth;

    const newLeftOffset =
      dragStartPosition!.offsetLeft +
      event.touchOrMouseMoveCoords.clientX -
      event.touchStartOrMouseDownCoords.clientX;

    let newRightOffset = containerElWidth - newLeftOffset - draggableStripWidth;

    newRightOffset = Math.max(
      Math.min(newRightOffset, containerElWidth - draggableStripWidth),
      0
    );

    draggableStripEl.style.right = newRightOffset + 'px';
  }

  onLongPressMouseDownOrTouchStart1(event: Event) {
    console.log('onLongPressMouseDownOrTouchStart1', event);
    this.longPressUserMsg1 = 'Mouse Down or Touch Start';
  }

  onLongPress1(event: TouchOrMouseCoords) {
    console.log('onLongPress1', event);
    this.longPressUserMsg1 = 'Long Press or right click';
  }

  onShortPress1(event: TouchOrMouseCoords) {
    console.log('onShortPress1', event);
    this.longPressUserMsg1 = 'Short Press';
  }

  onLongPressMouseDownOrTouchStart2(event: Event) {
    console.log('onLongPressMouseDownOrTouchStart2', event);
    this.longPressUserMsg2 = 'Mouse Down or Touch Start';
  }

  onLongPress2(event: TouchOrMouseCoords) {
    console.log('onLongPress2', event);
    this.longPressUserMsg2 = 'Long Press or right click';
  }

  onShortPress2(event: TouchOrMouseCoords) {
    console.log('onShortPress2', event);
    this.longPressUserMsg2 = 'Short Press';
  }

  onMultiClickMouseDownOrTouchStart(event: MouseEvent | TouchEvent) {
    console.log('onMultiClick', event);
    this.multiClickUserMsg = 'Mouse Down or Touch Start';
  }

  onMultiClick(event: TouchOrMouseCoords) {
    console.log('onMultiClick', event);
    this.multiClickUserMsg = 'Clicked 5 times';
  }

  userMessageClose(idx: number) {
    setTimeout(() => {
      const msgElCollection =
        document.getElementsByTagName('trmrk-user-message');
      const msgEl = msgElCollection[idx];

      this.mainUserMessageStr = `Message box with index ${idx} closed and now it has
        clientHeight ${msgEl.clientHeight} and clientWidth ${msgEl.clientWidth}`;

      this.showMainUserMessage++;
      this.mainUserMessageLevel = UserMessageLevel.Info;
    }, 0);

    setTimeout(() => {
      this.showUserMsg[idx]++;
    }, 1000);
  }

  openPopupWindowClick() {
    if (this.popupClosedMessage) {
      this.popupClosedMessage = '';
    } else {
      this.popupClosedMessage = '';
      const popup = window.open(
        'login-redirect',
        'popupWindow',
        'resizable=yes,scrollbars=yes'
      );

      if (popup) {
        const intvId = setInterval(() => {
          if (popup.closed) {
            clearInterval(intvId);
            this.popupClosedMessage = 'Popup closed';
          }
        }, 500);
      }
    }
  }

  getCompaniesTextFromCoords(
    loopSizes: number[],
    loopIdxes: number[],
    wordsCount: number
  ) {
    const nextIdx = getNextIdx(loopSizes, loopIdxes);
    const wordsArr = this.companies.slice(nextIdx, nextIdx + wordsCount);
    const retText = wordsArr.join(' | ');
    return retText;
  }

  getCompaniesText(nextIdx: number, wordsCount: number) {
    const wordsArr = this.companies.slice(nextIdx, wordsCount);
    const retText = wordsArr.join(' | ');
    return retText;
  }

  private getTreeViewData() {
    const dim = 4;
    const retArr: TrmrkTreeNodeData<TreeNode>[] = [];

    const createFakeTreeNodeData = () =>
      ({
        nodeValue: {
          id: -1,
          text: '',
        },
        path: [],
      } as TrmrkTreeNodeData<TreeNode>);

    const retData: TrmrkTree<TreeNode> = {
      rootNodes: [],
      rootNodesData: new TrmrkObservable<TrmrkTreeNodeData<TreeNode>[]>(retArr),
      nodeExpandedToggled: new TrmrkObservable<
        TrmrkTreeNodeEvent<TreeNode, boolean, any>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
        value: false,
      }),
      nodeCheckBoxToggled: new TrmrkObservable<
        TrmrkTreeNodeEvent<TreeNode, boolean, any>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
        value: false,
      }),
      nodeIconShortPressOrLeftClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeIconLongPressOrRightClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeColorLabelShortPressOrLeftClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeColorLabelLongPressOrRightClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeTextShortPressOrLeftClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeTextLongPressOrRightClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
    };

    retData.nodeExpandedToggled.subscribe((event) =>
      trmrkTreeEventHandlers.nodeExpandedToggled(retData, event)
    );

    retData.nodeTextLongPressOrRightClick.subscribe((event) =>
      trmrkTreeEventHandlers.nodeTextLongPressOrRightClick(retData, event)
    );

    const createItem = (
      path: number[],
      isExpanded: boolean,
      isHcyNode = true
    ) => {
      const idx = path.at(-1)!;

      const nodeItem: TrmrkTreeNodeData<TreeNode> = {
        nodeValue: {
          id: idx,
          text: this.companies[getNextIdx([4, 4, 4, 4], path)],
        },
        isHcyNode,
        isExpanded,
      };

      return nodeItem;
    };

    const createFakeItem = (idx: number) =>
      ({
        nodeValue: {
          id: idx,
        },
      } as TrmrkTreeNodeData<TreeNode>);

    const createNode = (
      item: TrmrkTreeNodeData<TreeNode>
    ): TrmrkTreeNode<TreeNode> => ({
      data: new TrmrkObservable<TrmrkTreeNodeData<TreeNode>>(item),
      childNodes: [],
      childNodesData: new TrmrkObservable<TrmrkTreeNodeData<TreeNode>[]>([]),
    });

    for (let i = 0; i < dim; i++) {
      const expand1 = i % 2 === 0;
      const item1 = createItem([i], expand1);
      const node1 = createNode(item1);
      retArr.push(createFakeItem(i));
      retData.rootNodes.push(node1);

      for (let j = 0; j < dim; j++) {
        const expand2 = expand1 && j % 2 === 0;
        const item2 = createItem([i, j], expand2);
        const node2 = createNode(item2);
        node1.childNodesData!.value.push(createFakeItem(j));
        node1.childNodes!.push(node2);

        for (let k = 0; k < dim; k++) {
          const expand3 = expand2 && k % 2 === 0;
          const item3 = createItem([i, j, k], expand3);
          const node3 = createNode(item3);
          node2.childNodesData!.value.push(createFakeItem(k));
          node2.childNodes!.push(node3);

          for (let l = 0; l < dim; l++) {
            const item4 = createItem([i, j, k, l], false, false);
            const node4 = createNode(item4);
            node3.childNodesData!.value.push(createFakeItem(l));
            node3.childNodes!.push(node4);
          }
        }
      }
    }

    return retData;
  }
}

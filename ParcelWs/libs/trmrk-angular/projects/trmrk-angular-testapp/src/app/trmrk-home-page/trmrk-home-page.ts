import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatOptionSelectionChange } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';

import { MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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

import { TrmrkAppPage } from 'trmrk-angular';
import { TrmrkPanelListItem, trmrkTreeEventHandlers } from 'trmrk-angular';
import { TrmrkHorizStrip, TrmrkHorizStripType } from 'trmrk-angular';
import { TrmrkThinHorizStrip } from 'trmrk-angular';

import { encodeHtml } from '../../trmrk/text';
import { UserMessageLevel } from '../../trmrk/core';
import { getNextIdx } from '../../trmrk/math';
import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkAppIcon } from '../trmrk-app-icon/trmrk-app-icon';
import { TreeNode } from '../trmrk-app-tree-view-node/trmrk-app-tree-view-node';
import { TrmrkAppTreeView } from '../trmrk-app-tree-view/trmrk-app-tree-view';
import { ToggleAppBarService } from '../services/toggle-app-bar-service';
import { TrmrkSpinner } from '../USER-CODE/forms/trmrk-spinner/trmrk-spinner';

import { companies } from '../services/companies';

@Component({
  selector: 'trmrk-home-page',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    MatMenuModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckbox,
    MatRadioModule,
    MatAutocompleteModule,
    TrmrkAppIcon,
    TrmrkSpinner,
    TrmrkDrag,
    TrmrkLongPressOrRightClick,
    TrmrkMultiClick,
    TrmrkUserMessage,
    TrmrkHorizStrip,
    TrmrkAppPage,
    TrmrkPanelListItem,
    TrmrkAppTreeView,
    TrmrkThinHorizStrip,
  ],
  templateUrl: './trmrk-home-page.html',
  styleUrl: './trmrk-home-page.scss',
  providers: [ToggleAppBarService],
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkHomePage implements OnDestroy, AfterViewInit {
  appBarEl!: HTMLElement;
  appPageContentEl!: HTMLElement;

  @ViewChild('draggableStrip', { read: ElementRef })
  draggableStrip!: ElementRef;

  @ViewChild('foodAutocompleteInput_1', { read: MatAutocompleteTrigger })
  foodAutocompleteTrigger_1!: MatAutocompleteTrigger;

  @ViewChild('foodAutocompleteInput', { read: MatAutocompleteTrigger })
  foodAutocompleteTrigger!: MatAutocompleteTrigger;

  @ViewChild('foodAutocompleteInput1', { read: MatAutocompleteTrigger })
  foodAutocompleteTrigger1!: MatAutocompleteTrigger;

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
  foodOptionsSeparatorKeysCodes: number[] = [ENTER, COMMA];
  foodAutocompleteCtrl = new FormControl('');
  foodAutocompleteCtrl1 = new FormControl('');

  private id: number;

  constructor(
    private hostEl: ElementRef<HTMLElement>,
    private appBarMapService: AppBarMapService,
    private toggleAppBarService: ToggleAppBarService,
    componentIdService: ComponentIdService
  ) {
    this.id = componentIdService.getNextId();

    appBarMapService.setCurrent(this.id, () => this.appBarEl);

    this.toggleAppBarService.init({
      getAppPanelElem: () => this.appPageContentEl,
    });

    this.treeViewData = this.getTreeViewData();

    this.foodAutocompleteCtrl.valueChanges.subscribe((value) => {});
  }

  ngAfterViewInit(): void {
    this.appBarEl = this.hostEl.nativeElement.querySelector(
      'trmrk-app-bar'
    ) as HTMLElement;

    this.appPageContentEl = this.hostEl.nativeElement.querySelector(
      '.trmrk-app-page-body'
    ) as HTMLElement;
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

  foodsComboboxDisplayFn(option: any): string {
    return option?.viewValue || '';
  }

  selectFoodOption(
    event: MatOptionSelectionChange<any>,
    option: any,
    cssSelectorSuffix = ''
  ) {
    if (event.isUserInput) {
      let scrollTop: number | null = null;

      let panel = document.querySelector(
        `.trmrk-food-autocomplete${cssSelectorSuffix}`
      );

      if (panel) {
        scrollTop = panel.scrollTop;
      }

      setTimeout(() => {
        const foodAutocompleteTrigger =
          cssSelectorSuffix === ''
            ? this.foodAutocompleteTrigger
            : this.foodAutocompleteTrigger1;

        foodAutocompleteTrigger.openPanel();

        panel = document.querySelector(
          `.trmrk-food-autocomplete${cssSelectorSuffix}`
        );

        if (panel) {
          panel.scrollTo({
            top: scrollTop!,
          });
        }
      });
    }
  }

  selectFoodAutocompleteDoneClick(autoCompleteTriggerIdx = 0) {
    const foodAutocompleteTrigger =
      autoCompleteTriggerIdx === -1
        ? this.foodAutocompleteTrigger_1
        : autoCompleteTriggerIdx === 0
        ? this.foodAutocompleteTrigger
        : this.foodAutocompleteTrigger1;

    if (foodAutocompleteTrigger.panelOpen) {
      setTimeout(() => {
        foodAutocompleteTrigger.closePanel();
      });
    }
  }
}

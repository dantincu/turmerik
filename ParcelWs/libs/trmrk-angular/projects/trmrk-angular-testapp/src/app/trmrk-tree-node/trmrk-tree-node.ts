import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { MatCheckboxChange } from '@angular/material/checkbox';

import {
  TrmrkObservable,
  TrmrkTree,
  TrmrkTreeNode as TrmrkTreeNodeT,
  TrmrkTreeNodeExpandedToggledEvent,
  TrmrkTreeNodeData,
} from 'trmrk-angular';

import { TrmrkPanelListItem } from 'trmrk-angular';

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

export interface TreeNode {
  id: number;
  text: string;
}

@Component({
  selector: 'trmrk-tree-node',
  imports: [MatIconModule, TrmrkPanelListItem, CommonModule],
  templateUrl: './trmrk-tree-node.html',
  styleUrl: './trmrk-tree-node.scss',
})
export class TrmrkTreeNode implements OnInit, OnDestroy {
  @Input() trmrkTreeData!: TrmrkTree<TreeNode>;
  @Input() trmrkData!: TrmrkTreeNodeT<TreeNode>;

  get showChildNodes() {
    const showChildNodes = !!(
      this.childNodes &&
      this.trmrkData.childNodes &&
      this.trmrkData.data.value.isExpanded
    );

    return showChildNodes;
  }

  data!: TrmrkTreeNodeData<TreeNode>;
  childNodes?: TrmrkTreeNodeData<TreeNode>[] | null | undefined;

  private dataSubscription?: Subscription;
  private childNodesSubscription?: Subscription;

  ngOnInit() {
    this.data = this.trmrkData.data.value;
    this.childNodes = this.trmrkData.childNodesData?.value;

    this.dataSubscription = this.trmrkData.data.$obs.subscribe((data) => {
      this.data = data;
    });

    this.childNodesSubscription = this.trmrkData.childNodesData?.$obs.subscribe(
      (data) => {
        this.childNodes = data;
      }
    );
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
    this.childNodesSubscription?.unsubscribe();
  }

  expandedToggled(isExpandedNewValue: boolean) {
    this.trmrkTreeData.nodeExpandedToggled.next({
      data: this.trmrkData.data.value,
      isExpandedNow: isExpandedNewValue,
    });
  }

  checkBoxToggled(event: MatCheckboxChange) {
    this.trmrkTreeData.nodeCheckBoxToggled.next({
      data: this.trmrkData.data.value,
      event: event,
      value: event.checked,
    });
  }

  nodeIconShortPressOrLeftClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeIconShortPressOrLeftClick.next({
      data: this.trmrkData.data.value,
      event: event,
    });
  }

  nodeIconLongPressOrRightClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeIconLongPressOrRightClick.next({
      data: this.trmrkData.data.value,
      event: event,
    });
  }

  nodeColorLabelShortPressOrLeftClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeColorLabelShortPressOrLeftClick.next({
      data: this.trmrkData.data.value,
      event: event,
    });
  }

  nodeColorLabelLongPressOrRightClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeColorLabelLongPressOrRightClick.next({
      data: this.trmrkData.data.value,
      event: event,
    });
  }

  nodeTextShortPressOrLeftClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeTextShortPressOrLeftClick.next({
      data: this.trmrkData.data.value,
      event: event,
    });
  }

  nodeTextLongPressOrRightClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeTextLongPressOrRightClick.next({
      data: this.trmrkData.data.value,
      event: event,
    });
  }
}

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { MatCheckboxChange } from '@angular/material/checkbox';

import {
  TrmrkObservable,
  TrmrkTree,
  TrmrkTreeNode as TrmrkTreeNodeT,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrmrkTreeNode implements OnInit, OnDestroy {
  @Input() trmrkTreeData!: TrmrkTree<TreeNode>;
  @Input() trmrkData!: TrmrkTreeNodeT<TreeNode>;
  @Input() trmrkPath!: number[];

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
      data: this.data,
      event: null,
      value: isExpandedNewValue,
      path: this.trmrkPath,
    });
  }

  checkBoxToggled(event: MatCheckboxChange) {
    this.trmrkTreeData.nodeCheckBoxToggled.next({
      data: this.data,
      event: event,
      value: event.checked,
      path: this.trmrkPath,
    });
  }

  nodeIconShortPressOrLeftClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeIconShortPressOrLeftClick.next({
      data: this.data,
      event: event,
      path: this.trmrkPath,
    });
  }

  nodeIconLongPressOrRightClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeIconLongPressOrRightClick.next({
      data: this.data,
      event: event,
      path: this.trmrkPath,
    });
  }

  nodeColorLabelShortPressOrLeftClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeColorLabelShortPressOrLeftClick.next({
      data: this.data,
      event: event,
      path: this.trmrkPath,
    });
  }

  nodeColorLabelLongPressOrRightClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeColorLabelLongPressOrRightClick.next({
      data: this.data,
      event: event,
      path: this.trmrkPath,
    });
  }

  nodeTextShortPressOrLeftClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeTextShortPressOrLeftClick.next({
      data: this.data,
      event: event,
      path: this.trmrkPath,
    });
  }

  nodeTextLongPressOrRightClick(event: TouchOrMouseCoords) {
    this.trmrkTreeData.nodeTextLongPressOrRightClick.next({
      data: this.data,
      event: event,
      path: this.trmrkPath,
    });
  }

  getChildNodePath(index: number) {
    const childNodePath = [...this.trmrkPath, index];
    return childNodePath;
  }
}

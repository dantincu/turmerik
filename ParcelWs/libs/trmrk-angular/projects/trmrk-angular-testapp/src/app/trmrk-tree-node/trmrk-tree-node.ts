import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import {
  TrmrkObservable,
  TrmrkTreeNode as TrmrkTreeNodeT,
  TrmrkTreeNodeExpandedToggledEvent,
  TrmrkTreeNodeData,
} from 'trmrk-angular';

import { TrmrkPanelListItem } from 'trmrk-angular';

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
  @Input() trmrkNodeExpandedToggled!: TrmrkObservable<
    TrmrkTreeNodeExpandedToggledEvent<TreeNode>
  >;
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

  expandedClick(isExpandedNewValue: boolean) {
    this.trmrkNodeExpandedToggled.next({
      data: this.trmrkData.data.value,
      isExpandedNow: isExpandedNewValue,
    });
  }
}

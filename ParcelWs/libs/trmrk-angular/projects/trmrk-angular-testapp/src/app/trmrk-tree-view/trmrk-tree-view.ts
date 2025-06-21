import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TreeNode, TrmrkTreeNode } from '../trmrk-tree-node/trmrk-tree-node';

import { TrmrkTree, TrmrkTreeNodeData } from 'trmrk-angular';

@Component({
  selector: 'trmrk-tree-view',
  imports: [TrmrkTreeNode],
  templateUrl: './trmrk-tree-view.html',
  styleUrl: './trmrk-tree-view.scss',
})
export class TrmrkTreeView implements OnInit, OnDestroy {
  @Input() trmrkData!: TrmrkTree<TreeNode>;

  rootNodes!: TrmrkTreeNodeData<TreeNode>[] | null | undefined;

  private rootNodesSubscription?: Subscription;

  ngOnInit() {
    this.rootNodes = this.trmrkData.rootNodesData.value;

    this.rootNodesSubscription = this.trmrkData.rootNodesData.$obs.subscribe(
      (data) => {
        this.rootNodes = data;
      }
    );
  }

  ngOnDestroy() {
    this.rootNodesSubscription?.unsubscribe();
  }
}
